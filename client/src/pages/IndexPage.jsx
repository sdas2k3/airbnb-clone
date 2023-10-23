import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then((response) => {
      const { data } = response;
      setPlaces([...data]);
    });
  }, []);
  // console.log(places)
  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-6 gap-y-8 md:grid-cols-3 lg:grid-cols-5">
        {places.map((place) => {
          return (
            <Link to={"/places/"+place._id} key={Math.random()*1000}>
              <div className="bg-gray-500 rounded-2xl">
                {place?.photos?.length > 0 && (
                  <img
                    src={"http://localhost:4000/uploads/" + place.photos[0]}
                    alt=""
                    className="rounded-2xl aspect-square object-cover"
                  />
                )}
              </div>
              <h2 className="font-bold truncate mt-2 underline">{place?.address}</h2>
              <h3 className="text-sm text-gray-500 leading-5">{place?.title}</h3>
              <div className="mt-1">
                <span className="font-bold">$ {place.price}</span> per night
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default IndexPage;
