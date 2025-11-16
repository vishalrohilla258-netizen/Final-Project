import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Gradient from "../partial/Gradient";
import { toast } from "react-hot-toast";

const Login = ({ setIsLoggedIn, setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLogin, setIsLogin] = useState(true); // State to manage toggle
  const navigate = useNavigate();

  const toggleAuth = () => {
    setIsLogin(!isLogin);
  };
  const handleSignUpClick = () => {
    navigate("/signup"); // navigate to /register
  };
  const handleSignUpAndToggle = () => {
    toggleAuth(); // Call toggleAuth to change state
    handleSignUpClick(); // Navigate to /register
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",

        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Log the full response for debugging
      const responseText = await response.text(); // Get response as text first
      console.log("Raw response: ", responseText);

      // Try parsing JSON only if the response is not HTML (contains no "<!DOCTYPE" or "<html>")
      if (response.headers.get("content-type")?.includes("application/json")) {
        const data = JSON.parse(responseText);
        console.log(data); // Debugging the parsed JSON response

        if (response.ok) {
          toast.success(data.message);
          setIsLoggedIn(true);
          setToken(data.token);
          localStorage.setItem("token", data.token); // Update login state in the parent component
          navigate("/"); // Redirect after successful login
        } else {
          toast.error(data.message || "Login failed");
        }
      } else {
        throw new Error("Unexpected response format, not JSON.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Login error: ", error);
    }

    /*try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Parse the JSON response
      console.log(data); // Debugging the response data

      if (response.ok) {
        toast.success(data.message);
        onLogin(); // Update login state in the parent component
        navigate("/dashboard"); // Redirect after successful login
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Login error: ", error);
    }*/
  };

  return (
    <>
      <main className="flex flex-grow items-center justify-center relative isolate px-6 pt-14 lg:px-8">
        <Gradient />
        <div className="relative isolate px-6 py-24 sm:py-32 lg:px-8">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Welcome
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {isLogin ? "Log in to your account !" : "Register with us !"}
          </p>
          <div className="flex flex-col items-center mt-10">
            <div className="flex border border-gray-300 rounded-full overflow-hidden">
              <div
                className={`cursor-pointer py-2 px-6 flex items-center justify-center transition-all duration-300 ease-in-out ${
                  isLogin
                    ? "bg-gray-300 text-gray-700"
                    : "bg-indigo-600 text-white"
                }`}
                onClick={handleSignUpAndToggle}
              >
                Sign Up
              </div>
              <div
                className={`cursor-pointer py-2 px-6 flex items-center justify-center transition-all duration-300 ease-in-out ${
                  isLogin
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                Login
              </div>
            </div>

            {/* Conditional rendering of the Login Form */}
            {isLogin && (
              <form
                className="max-w-md mx-auto mt-5 w-full"
                onSubmit={handleLoginSubmit}
              >
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="email"
                    name="floating_email"
                    id="floating_email"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Set email state
                  />
                  <label
                    htmlFor="floating_email"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Email address
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="password"
                    name="floating_password"
                    id="floating_password"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Set password state
                  />
                  <label
                    htmlFor="floating_password"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Password
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full mt-5 text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Log In
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
