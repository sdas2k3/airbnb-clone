import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import BounceLoader from "react-spinners/ClipLoader";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";


const ProfilePage = () => {
  const { user, ready, setUser, setReady } = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);
  let { subpage } = useParams();

  const handleLogOut = async () => {
    await axios.post("/logout");
    setReady(true);
    setRedirect("/");
    setUser(null);
  };

  if (redirect === "/") {
    return <Navigate to={"/"} />;
  }

  if (subpage === undefined) {
    subpage = "profile";
  }

  if (!ready && redirect != "/") {
    return (
      <div className="w-full flex justify-center h-screen items-center">
        <BounceLoader
          color={"#de8b24"}
          loading={!ready}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
          className="mx-auto"
        />
      </div>
    );
  }

  if (!user && redirect != "/") {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div>
        <AccountNav/>
        {subpage === "profile" && (
          <div className="text-center max-w-lg mx-auto">
            Logged in as <span className="text-lg font-bold text-primary">{user?.name}, {user?.email}</span>
            <span className="text-2xl">👋</span>
            <br />
            <button
              className="inline-flex gap-1 justify-center bg-primary text-white rounded-full px-6 py-3 max-w-md mt-2 w-36"
              onClick={handleLogOut}
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
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
              Logout
            </button>
          </div>
        )}

        {subpage === "places" && <PlacesPage />}
      </div>
    </>
  );
};

export default ProfilePage;
