// src/components/InterviewPrep.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import Gradient from "../partial/Gradient";

const InterviewPrep = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleStartPreparation = () => {
    navigate("/interviewprep/evaluate"); // Navigate to the Evaluate component
  };

  return (
    <>
      <main className="flex flex-grow items-center justify-center relative isolate px-6 py-14 lg:px-8">
        <Gradient />
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Ace Your Interviews with Confidence
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Prepare for your interviews with real-time feedback on your
            confidence, body language, and more.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={handleStartPreparation} // Call the handleStartPreparation function on click
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Start Preparation
            </button>
            <a
              href="/InterviewPrep"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Learn More <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </main>
    </>
  );
};

export default InterviewPrep;
