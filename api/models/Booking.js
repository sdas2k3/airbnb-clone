import mongoose from "mongoose";

const bookingScheme = new mongoose.Schema({
  place: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Place" },
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true }, 
  price: Number,
  numberOfGuests:Number
});

const BookingModel = mongoose.model("booking", bookingScheme);

export default BookingModel;
