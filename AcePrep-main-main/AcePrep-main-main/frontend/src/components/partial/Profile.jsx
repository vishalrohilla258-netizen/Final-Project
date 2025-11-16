import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ProfileModal = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null); // State for user data

  // Sample user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await fetch("http://localhost:5000/api/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token in the Authorization header
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUserData(data);
      } else {
        if (response.status === 403) {
          // Session expired, JWT invalid
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token"); // Clear the invalid token
          onLogout(); // Log the user out
          navigate("/login"); // Redirect to the login page
        } else {
          console.error("Failed to fetch user data");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const capitalizeFirstLetter = (name) => {
    if (!name) return ""; // Handle cases where the name is null or undefined
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const openModal = () => {
    setIsOpen(true);
    fetchUserData();
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleAssessment = () => {
    if (userData && userData._id) {
      const userId = userData._id; // Assuming userData contains _id
      setIsOpen(false);
      navigate(`/profile/${userId}/assessments`); // Navigate to the assessments page for that user
    } else {
      console.error("User ID not found.");
    }
  };

  const handleLogout = async () => {
    onLogout(); // Call the logout function passed as a prop
  };

  return (
    <div>
      {/* Trigger to open modal */}
      <button
        onClick={openModal}
        className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md hover:bg-blue-700 transition duration-200"
      >
        Profile
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300 ease-out">
          {/* Modal Content */}
          <div
            className={`bg-white p-8 rounded-lg shadow-2xl w-96 relative transform transition-transform duration-300 ease-out ${
              isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <h2 className="text-2xl font-bold mb-5 text-gray-900 border-b pb-3">
              Profile Information
            </h2>

            {/* Display user data */}
            <div className="space-y-3">
              <p className="text-lg">
                <span className="font-medium text-gray-900">Email:</span>{" "}
                {userData ? userData.email : "Loading..."}
              </p>
              <p className="text-lg">
                <span className="font-medium text-gray-900">Name:</span>{" "}
                {userData
                  ? `${capitalizeFirstLetter(
                      userData.firstName
                    )} ${capitalizeFirstLetter(userData.lastName)}`
                  : "Loading..."}
              </p>
              <p className="text-lg">
                <span className="font-medium text-gray-900">
                  Subscription Type:
                </span>{" "}
                {userData ? userData.subscriptionType : "Loading..."}
              </p>
            </div>

            {/* Button row */}
            <div className="flex justify-between mt-6">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Close
              </button>
              <button
                onClick={handleAssessment}
                className="flex-1 px-4 py-2 mx-1 bg-green-700 text-white rounded-lg hover:bg-green-600 transition"
              >
                Assessments
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 mx-1 bg-red-700 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileModal;
