/* eslint-disable react/jsx-no-target-blank */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BounceLoader from "react-spinners/ClipLoader";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";

const PlacePage = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);

  if (!place) {
    return (
      <div className="w-full flex justify-center h-screen items-center">
        <BounceLoader
          color={"#de8b24"}
          loading={!place}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
          className="mx-auto"
        />
      </div>
    );
  }

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 py-8">
      <h1 className="text-3xl">{place.title}</h1>
      <a
        target="_blank"
        href={"https://maps.google.com/?q=" + place.address}
        className="flex gap-1 mt-3 font-semibold underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>

        {place?.address}
      </a>

      <PlaceGallery place={place} />

      <div className="my-8 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="mb-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {place?.description}
          </div>
          Check-in Time: {place.checkIn}
          <br />
          Check-out Time: {place.checkOut}
          <br />
          Max number of guests: {place.maxGuests}
        </div>
        <BookingWidget place={place} />
      </div>
      <div className="bg-white -mx-8 px-8 py-8 -mb-8 mt-2 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra Info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
          {place.extraInfo}
        </div>
        <div>
          <h2 className="font-semibold text-2xl">Perks</h2>
        </div>
        <div className="flex gap-2">
          {place.perks.length > 0 && 
            place.perks.map((perk) => {
              return (
                <div
                  className="mb-4 mt-2 text-md p-4 border rounded-2xl shadow shadow-gray-200 text-gray-700 leading-5"
                  key={perk}
                >
                  {perk.toUpperCase()}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default PlacePage;
