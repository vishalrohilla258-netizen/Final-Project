import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Updated import

const AssessmentCard = () => {
  const [geminiResponse, setGeminiResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch the geminiResponse data on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/geminiResponse", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setGeminiResponse(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  const handleViewClick = (assessmentId) => {
    const id = geminiResponse.userId;
    // Navigate to the assessment details page with the ID and userId
    navigate(`/profile/${id}/assessments/${assessmentId}`);
  };

  // Check if geminiResponse is null or an empty array
  if (
    !geminiResponse.geminiResponse ||
    geminiResponse.geminiResponse.length === 0
  ) {
    return (
      <div className="text-center mt-8">
        <p className="text-xl text-gray-500">No data available.</p>
      </div>
    );
  }

  // Assuming geminiResponse is an array of assessment objects
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mt-8">
      {geminiResponse?.geminiResponse?.map((assessment, index) => (
        <div
          key={index}
          className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 transition-colors duration-300 hover:text-indigo-600">
              Assessment {index + 1}
            </h2>

            <p className="text-gray-600 mb-4">
              {Array.isArray(assessment.responses)
                ? assessment.responses.length
                : 0}{" "}
              Questions
            </p>

            <p className="text-gray-600 mb-2">
              Date: {new Date(assessment.responseDate).toLocaleDateString()}
            </p>

            <p className="text-gray-600 mb-4">
              Time: {assessment.responseTime}
            </p>

            <button
              className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition-colors duration-300"
              onClick={() => handleViewClick(assessment._id)}
            >
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssessmentCard;

/**/
