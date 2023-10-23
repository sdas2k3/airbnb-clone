import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import IndexPage from "./pages/IndexPage";
import Layout from "./Layout";
import axios from "axios";
// import { Toaster } from 'react-hot-toast';
import { ToastContainer } from "react-toastify";
import { UserContextProvider } from "./UserContext";
import "react-toastify/dist/ReactToastify.css";
import ProfilePage from "./pages/ProfilePage";
import PlacesPage from "./pages/PlacesPage";
import PlacespageForm from "./pages/PlacespageForm";
import PlacePage from "./pages/PlacePage";
import BookingsPage from "./pages/BookingsPage";
import BookingPage from "./pages/BookingPage";

axios.defaults.baseURL = "http://localhost:4000/";
axios.defaults.withCredentials = true;
function App() {
  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<ProfilePage />} />
            <Route path="/account/places" element={<PlacesPage />} />
            <Route path="/account/places/new" element={<PlacespageForm />} />
            <Route path="/account/places/:id" element={<PlacespageForm/>}/>
            <Route path="/places/:id" element={<PlacePage/>}/>
            <Route path="/account/bookings" element={<BookingsPage/>}/>
            <Route path="/account/bookings/:id" element={<BookingPage/>}/>
          </Route>
        </Routes>
      </UserContextProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
