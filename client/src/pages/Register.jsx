import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = { name, email, password };
    console.log(data)
    toast.success("Registered Successfully", {
      position: "top-right",
    });
    // try {
    //   const response  = await axios.post("/register", data);
    //   data = response.data
    //   console.log(response)
    //   console.log(data)
    //   if (data === "User with same email already exists") {
    //     toast.error(data);
    //   } else {
        
    //     setRedirect(true);
    //   }
    // } catch (error) {
    //   toast.error(error);
    // }
    // // console.log(data)
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="mt-4 grow flex flex-col items-center justify-center">
      <div className="mb-32">
        <header className="text-4xl text-center">Register</header>
        <form
          action=""
          className="max-w-md mx-auto mt-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name=""
            id=""
            value={name}
            placeholder="Enter your name"
            className="outline-2"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            name=""
            id=""
            placeholder="Enter your email"
            className="outline-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name=""
            id=""
            placeholder="Enter your password"
            className="outline-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="primary mt-2">
            Register
          </button>
        </form>
        <div className="mt-2 text-gray-500 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-[#423fdb] underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
