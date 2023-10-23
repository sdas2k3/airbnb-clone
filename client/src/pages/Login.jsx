import axios from "axios";
import {  useContext,useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../UserContext";

const Login = () => {
  // const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const {setUser,setReady} = useContext(UserContext)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/login", { email, password });
      // alert(data)
      if (!(data === "User not found" || data === "Password is not correct")) {
        setRedirect(true);
        setUser(data)
        setReady(true)
        toast.success("Log In Successful", {
          position: "top-right",
        });
      } else {
        toast.error(data);
        setRedirect(false);
        setReady(false)
      }
    } catch (error) {
      console.log(error)
      toast.error(error);
      setRedirect(false);
      setReady(false)
    }
  };

  if (redirect) {
    return <Navigate to="/"/>
  }
  return (
    <div className="mt-4 grow flex flex-col items-center justify-center">
      <div className="mb-32">
        <header className="text-4xl text-center">Login</header>
        <form
          action=""
          className="max-w-md mx-auto mt-4"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            name=""
            id=""
            value={email}
            placeholder="Enter your email"
            className="outline-2"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name=""
            id=""
            value={password}
            placeholder="Enter your password"
            className="outline-2"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="primary mt-2">
            Login
          </button>
        </form>
        <div className="mt-2 text-gray-500 text-center">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-[#423fdb] underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
