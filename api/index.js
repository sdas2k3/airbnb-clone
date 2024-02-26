import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { config } from "dotenv";
import User from "./models/User.js";
import Booking from "./models/Booking.js"
import Place from "./models/Place.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import imageDownloader from "image-downloader";
import path from "path";
import multer from "multer";
import fs from "fs";
const __dirname = path.resolve();

const app = express();
const PORT = 4000;
const bcryptSalt = bcrypt.genSaltSync(12);
const jwtSecret = "sdgucsiufhshcsadcnsiofrwjf123e3144";
// console.log(__dirname)
config(); 

app.use(
  cors({
    credentials: true, 
    origin: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(__dirname + "\\uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Connected to database"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.json("Hello");
});

// REGISTER USER
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  let myuser = await User.findOne({ email: email });
  if (myuser) {
    // console.log(myuser)
    console.log("Duplicate User");
    return res.status(200).json("User with same email already exists");
  }
  try {
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, bcryptSalt),
    });
    res.json(user);
  } catch (err) {
    res.status(422).json(err);
  }
});

// LOGIN USER

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email: email });
  try {
    if (!user) {
      return res.json("User not found");
    }
    // console.log(user.password)
    const passok = bcrypt.compareSync(password, user.password);
    if (passok) {
      jwt.sign(
        { email: email, userId: user._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          return res.status(200).cookie("token", token).json(user);
        }
      );
    } else {
      return res.status(200).json("Password is not correct");
    }
  } catch (error) {
    return res.status(404).json(error);
  }
});

// USER PROFILE
app.post("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.userId);
      // console.log(userDoc)
      return res.status(200).json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

// LOGOUT USER
app.post("/logout", (req, res) => {
  return res.cookie("token", "").json(true);
});

// UPLOAD FILE BY LINK
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const destpath = __dirname + "\\uploads\\";
  const newname = "photo" + Date.now() + ".jpg";
  // console.log(link)
  try {
    await imageDownloader.image({
      url: link,
      dest: destpath + newname,
    });
    res.status(200).json(newname);
  } catch (err) {
    return res.status(403).json(err);
  }
});

// UPLOAD FILE
const photoMiddleware = multer({ dest: "uploads/" });

app.post("/upload", photoMiddleware.array("photos", 100), (req, res) => {
  let uploadedFiles = [];
  // console.log(req.files)
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname, filename } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

// ADD A PLACE
app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    photos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.userId,
      title,
      address,
      photos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.json(placeDoc);
  });
});

// GET ALL PLACES OF A USER
app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { userId } = userData;
    res.json(await Place.find({ owner: userId }));
  });
});

// GET A PARTICULAR PLACE INFO

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  // console.log({id})
  res.json(await Place.findById(id));
});

// UPDATE PLACE INFO
app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    photos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { userId } = userData;
    const placeDoc = await Place.findById(id);
    // console.log(userId)
    if (placeDoc.owner.toString() === userId) {
      placeDoc.set({
        title,
        address,
        photos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
}); 

// GET ALL PLACES
app.get("/places", async (req, res) => {
  res.json(await Place.find());
});

// BOOK A PLACE
app.post("/bookings", async (req, res) => {
  const { checkIn, checkOut, numberOfGuests, name, phone, place, price, user } =
    req.body; 
  console.log(req.body)
  Booking.create({
    checkIn,
    checkOut,
    name,
    numberOfGuests,
    phone,
    place,
    price,
    user
  }).then((doc) => {
    return res.json(doc);
  }).catch((err)=>{
    res.json(false)
  })
});


// GET ALL BOOKINGS OF A USER
app.get("/bookings",(req,res)=>{
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { userId } = userData;
    res.json(await Booking.find({user:userId}).populate({path:'place',model:Place})) 
  }); 
})
  
  
const LINK = `http://localhost:${PORT}`;
app.listen(PORT, () => { 
  console.log(`Server started on ${LINK}`);
});
