import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Gradient from "../partial/Gradient";

import { toast } from "react-hot-toast"; // Import toast

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLogin, setIsLogin] = useState(false); // State to manage toggle
  const navigate = useNavigate();

  const toggleAuth = () => {
    setIsLogin(!isLogin);
  };
  const handleLoginClick = () => {
    navigate("/login"); // navigate to /login
  };
  const handleSignUpAndToggle = () => {
    toggleAuth(); // Call toggleAuth to change state
    handleLoginClick(); // Navigate to /login
  };
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const data = { email, password, firstName, lastName };

    // Check if passwords match
    if (password !== repeatPassword) {
      toast.error("Passwords do not match!"); // Show error message
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        credentials: "include", // Ensure cookies are included in the request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Handle responses from the server
      const responseData = await response.json(); // Get the response data

      // Show flash messages based on status
      if (response.status === 400) {
        toast.error(responseData.message); // Handle bad requests
      } else if (response.status === 409) {
        toast.error(responseData.message); // Handle conflict (email already in use)
      } else if (response.status === 201) {
        toast.success(responseData.message); // Handle successful sign up
        if (responseData.token) {
          localStorage.setItem("token", responseData.token);
          console.log("Token saved to localStorage:", responseData.token);
        }
        navigate("/login"); // Redirect after successful sign up
      } else if (response.status === 500) {
        toast.error(responseData.message); // Handle server error
      } else {
        toast.error("Unexpected response from server."); // Handle unexpected response
      }

      console.log("Response status:", response.status);
      console.log("Response data:", responseData);
    } catch (error) {
      // Log the error to see what went wrong
      console.error("Error during signup:", error);
      toast.error("Something went wrong. Try again."); // Generic error message
    }
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
                /*onClick={}*/
              >
                Sign Up
              </div>
              <div
                className={`cursor-pointer py-2 px-6 flex items-center justify-center transition-all duration-300 ease-in-out ${
                  isLogin
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
                onClick={handleSignUpAndToggle}
              >
                Login
              </div>
            </div>

            {/* Conditional rendering of the Sign Up Form */}
            {!isLogin && (
              <form
                className="max-w-md mx-auto mt-5 w-full"
                onSubmit={handleSignupSubmit}
              >
                {/* Sign-up form inputs */}
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="email"
                    name="floating_email"
                    id="floating_email"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label
                    htmlFor="floating_password"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Password
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="password"
                    name="repeat_password"
                    id="floating_repeat_password"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)} // Handle repeat password input
                  />
                  <label
                    htmlFor="floating_repeat_password"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Confirm password
                  </label>
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="relative z-0 w-full mb-5 group">
                    <input
                      type="text"
                      name="floating_first_name"
                      id="floating_first_name"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <label
                      htmlFor="floating_first_name"
                      className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      First Name
                    </label>
                  </div>
                  <div className="relative z-0 w-full mb-5 group">
                    <input
                      type="text"
                      name="floating_last_name"
                      id="floating_last_name"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    <label
                      htmlFor="floating_last_name"
                      className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Last Name
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full mt-5 text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Sign Up
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default SignUp;
