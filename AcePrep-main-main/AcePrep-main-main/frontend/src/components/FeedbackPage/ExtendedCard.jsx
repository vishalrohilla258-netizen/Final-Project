import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faStar,
  faCheckCircle,
  faCommentAlt,
  faLightbulb,
  faTag,
  faVolumeDown,
} from "@fortawesome/free-solid-svg-icons";
import Gradient from "../partial/Gradient";

const ExtendedCard = () => {
  const [geminiResponse, setGeminiResponse] = useState(null);
  const { assessmentId } = useParams();

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
        //console.log("Fetched data:", data); // Log the data to check its structure

        // Assuming the array is under 'geminiResponse'
        const dataArray = data.geminiResponse || [];

        if (Array.isArray(dataArray)) {
          const filteredData = dataArray.find(
            (item) => item._id === assessmentId
          );

          if (filteredData) {
            console.log(filteredData);
            setGeminiResponse([filteredData]); // Set the state with the matching item wrapped in an array
          } else {
            console.warn("No matching data found for the specified _id");
            setGeminiResponse([]); // Handle the case where no data matches
          }
        } else {
          console.error(
            "Expected data.geminiResponse to be an array but received:",
            typeof dataArray
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [assessmentId]);

  // Inline styles
  const styles = {
    gradientBg: {
      background: "linear-gradient(135deg, #6b73ff 0%, #000dff 100%)",
    },
    rating1: { backgroundColor: "#ef4444" },
    rating2: { backgroundColor: "#f97316" },
    rating3: { backgroundColor: "#eab308" },
    rating4: { backgroundColor: "#84cc16" },
    rating5: { backgroundColor: "#22c55e" },
    jsonViewer: {
      backgroundColor: "#1e293b",
      borderRadius: "0.5rem",
      padding: "1rem",
      fontFamily: "monospace",
      overflowX: "auto",
    },
    jsonKey: { color: "#7dd3fc" },
    jsonValue: { color: "#f0f9ff" },
    jsonString: { color: "#86efac" },
    jsonNumber: { color: "#fca5a5" },
    jsonBoolean: { color: "#93c5fd" },
  };

  if (!geminiResponse) {
    return <p>Loading...</p>;
  }

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!geminiResponse || geminiResponse.length === 0) return 0;
    const assessment = geminiResponse[0];
    if (!assessment || !assessment.assessments) return 0;

    const totalRating = assessment.assessments.reduce(
      (sum, assessmentItem) => sum + assessmentItem.rating,
      0
    );
    return assessment.assessments.length > 0
      ? totalRating / assessment.assessments.length
      : 0;
  };

  const averageRating = calculateAverageRating();

  return (
    <div>
      {/* Main Content */}
      <Gradient />
      <main className="container mx-auto px-4 py-20">
        {/* Summary Card */}
        {geminiResponse.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-0">
                  Interview Skills Assessment
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">
                    Response Time:
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    {geminiResponse[0].responseTime}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                      <FontAwesomeIcon icon={faQuestionCircle} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Questions</p>
                      <p className="font-bold text-gray-800">
                        {geminiResponse[0].responses.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                      <FontAwesomeIcon icon={faStar} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Average Rating</p>
                      <p className="font-bold text-gray-800">
                        {averageRating.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-bold text-gray-800">Completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Question Results */}
        <div className="space-y-6">
          {geminiResponse.length > 0 &&
            geminiResponse[0].responses.map((response, index) => {
              const assessmentItem = geminiResponse[0].assessments[index]; // Get corresponding assessment item
              const ratingStyle =
                assessmentItem.rating === 1
                  ? styles.rating1
                  : assessmentItem.rating === 2
                  ? styles.rating2
                  : assessmentItem.rating === 3
                  ? styles.rating3
                  : assessmentItem.rating === 4
                  ? styles.rating4
                  : styles.rating5;

              return (
                <div
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  key={index}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Question: {response.question}
                      </h3>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 mr-2">
                          Rating:
                        </span>
                        <span
                          className="text-white px-3 py-1 rounded-full text-sm font-bold"
                          style={ratingStyle}
                        >
                          {assessmentItem.rating}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-gray-600 mr-2">
                          Your Answer:
                        </span>
                      </div>
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                        <p className="text-gray-800">"{response.answer}"</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center mb-2">
                        <FontAwesomeIcon
                          icon={faCommentAlt}
                          className="text-blue-500 mr-2"
                        />
                        <span className="text-sm font-medium text-gray-600">
                          Grammar Review:
                        </span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-800">
                          {assessmentItem.grammarReview}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center mb-2">
                        <FontAwesomeIcon
                          icon={faLightbulb}
                          className="text-yellow-500 mr-2"
                        />
                        <span className="text-sm font-medium text-gray-600">
                          Suggested Answer:
                        </span>
                      </div>
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                        <p className="text-gray-800">
                          {assessmentItem.moreAppropriateAnswer}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <FontAwesomeIcon icon={faTag} className="mr-1" />
                        {assessmentItem.questionType}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <FontAwesomeIcon icon={faVolumeDown} className="mr-1" />
                        {assessmentItem.tone}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
};

export default ExtendedCard;
