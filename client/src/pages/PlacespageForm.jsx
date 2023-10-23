import { useEffect, useState } from "react";
import PhotosUploader from "../PhotosUploader";
import axios from "axios";
import Perks from "../Perks";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";

const PlacespageForm = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price,setPrice] = useState(100)
  const [redirect, setRedirect] = useState("");
  useEffect(() => {
    if (id === undefined) {
      return;
    } else {
      axios.get("/places/" + id).then((response) => {
        const { data } = response;
        setTitle(data.title);
        setAddress(data.address);
        setAddedPhotos(data.photos);
        setDescription(data.description);
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setPrice(data.price)
      });
    }
  }, [id]);

  const savePlace = async (e) => {
    e.preventDefault();
    const placeData = {
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn: checkIn,
      checkOut: checkOut,
      maxGuests: maxGuests,
      price
    }
    // Update a place
    if (id) {
      await axios.put("/places",{id,...placeData})
      setRedirect("/account/places");
    }
    // Save a new Place
    else {
      await axios.post("/places", placeData);
      setRedirect("/account/places");
    }
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <>
      <div>
        <AccountNav />
        <form onSubmit={savePlace}>
          <h2 className="text-2xl mt-4">Title</h2>
          <p className="text-sm text-gray-500">
            Title should be short and cachy for advertisement
          </p>
          <input
            type="text"
            name=""
            id=""
            value={title}
            placeholder="title, for eg:my lovely appartment"
            onChange={(e) => setTitle(e.target.value)}
          />
          <h2 className="text-2xl mt-4">Address</h2>
          <p className="text-sm text-gray-500">Address to this place(For eg: city,country)</p>
          <input
            type="text"
            name=""
            id=""
            value={address}
            placeholder="type your address"
            onChange={(e) => setAddress(e.target.value)}
          />

          <h2 className="text-2xl mt-4">Photos</h2>
          <p className="text-sm text-gray-500">More=Better</p>

          <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

          <h2 className="text-2xl mt-4">Description</h2>
          <p className="text-sm text-gray-500">description of the place</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <h2 className="text-2xl mt-4">Perks</h2>
          <p className="text-sm text-gray-500">Select perks about the places</p>

          <Perks selected={perks} onChange={setPerks} />

          <h2 className="text-2xl mt-4">Extra Info</h2>
          <p className="text-sm text-gray-500">House rules,etc</p>
          <textarea
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
          />

          <h2 className="text-2xl mt-4">Check in & Out time, max guest</h2>
          <p className="text-sm text-gray-500">
            Rememeber to keep a time window for cleaning b/w check in & out
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <div>
              <h3 className="mt-2">Check In time</h3>
              <input
                type="text"
                placeholder="14:00"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div>
              <h3 className="mt-2">Check Out time</h3>
              <input
                type="text"
                placeholder="15:00"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
            <div>
              <h3 className="mt-2">Max no of guest</h3>
              <input
                type="text"
                placeholder="1"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
              />
            </div>
            <div>
              <h3 className="mt-2">Price per night in ($)</h3>
              <input
                type="text"
                placeholder="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-primary mt-2 text-white px-4 py-2 rounded-full w-full max-w-sm"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PlacespageForm;
