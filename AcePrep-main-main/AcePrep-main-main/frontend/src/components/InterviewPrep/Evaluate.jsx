import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Gradient from "../partial/Gradient"; // Ensure this is defined elsewhere in your project
import { FaCameraRetro } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Evaluate = () => {
  const videoRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [question, setQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [totalQuestions, setTotalQuestions] = useState(0);
  const token = localStorage.getItem("token");

  const handleToggleClick = async () => {
    if (!isStarted) {
      toast.success("Assessment starting...");
      setIsStarted(true);

      // Start webcam
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Start listening for speech continuously
        SpeechRecognition.startListening({ continuous: true });

        // Fetch the first question
        await fetchNextQuestion();
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    } else {
      stopWebcam();
      setIsStarted(false);
      resetState(); // Reset state
      toast.error("Assessment aborted.");
      stopSpeaking(); // Stop speaking on abort
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    SpeechRecognition.stopListening(); // Stop listening when webcam is stopped
  };

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
  };

  const fetchNextQuestion = async () => {
    stopSpeaking(); // Stop speaking before fetching the next question

    // Store the current response if there's a question and transcript
    if (question && transcript) {
      setResponses((prevResponses) => [
        ...prevResponses,
        { question, answer: transcript },
      ]);
      resetTranscript(); // Reset transcript for the next question
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/question?index=${questionIndex}`
      );
      if (response.ok) {
        const data = await response.json();
        setQuestion(data.question); // Set the new question
        setTotalQuestions(data.totalQuestions);
        setQuestionIndex((prevIndex) => prevIndex + 1); // Move to the next question

        // Speak the question
        speak(data.question);

        // Keep listening for the next answer
        SpeechRecognition.startListening({ continuous: true });
      } else {
        console.error("Failed to fetch question");
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const handleSubmitResponses = async () => {
    // Set the isSubmitting state to true to disable the button
    setIsSubmitting(true);

    // Include the last question and answer before submission
    if (question && transcript) {
      setResponses((prevResponses) => [
        ...prevResponses,
        { question, answer: transcript },
      ]);
    }

    console.log("Submitting responses:", [
      ...responses,
      { question, answer: transcript },
    ]);
    console.log("Token:", token);

    // Submit responses using toast.promise to show loading, success, and error states
    toast
      .promise(
        fetch("http://localhost:5000/api/submit-responses", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            responses: [...responses, { question, answer: transcript }],
          }), // Send the updated responses
        }),
        {
          loading: "Saving your responses...",
          success: <b>Responses submitted successfully!</b>,
          error: <b>Could not submit responses. Please try again.</b>,
        }
      )
      .then(async (response) => {
        if (response.ok) {
          console.log("Responses submitted successfully!");
        } else {
          throw new Error("Failed to submit responses");
        }
      })
      .catch((error) => {
        console.error("Error submitting responses:", error);
      })
      .finally(() => {
        // Reset isSubmitting to false after the submission is completed (either success or error)
        setIsSubmitting(false);
        stopWebcam();
        setIsStarted(false);
        resetState(); // Reset state after submission
      });
  };

  const resetState = () => {
    setQuestion(null);
    setQuestionIndex(0);
    setResponses([]);
    resetTranscript(); // Reset transcript
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopWebcam();
  }, []);

  return (
    <main className="flex flex-col flex-grow relative isolate px-6 pt-14 lg:px-8">
      <Gradient />
      <h1 className="text-3xl font-bold mb-4 mt-6">Evaluation Screen</h1>

      <div className="text-lg leading-8 text-gray-600">
        <p>Analyze your performance and receive feedback in real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 mx-4">
        <div className="flex flex-col items-center relative">
          {isStarted ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-lg rounded-lg shadow-lg"
                width={640}
                height={480}
              />
              <p className="mt-4 text-center">Webcam Feed</p>
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-60 bg-white border-2 border-dashed border-gray-400 rounded-lg">
              <FaCameraRetro className="text-gray-500 text-4xl" />
              <p className="mt-2 text-gray-500">No webcam feed available</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center p-4 bg-gray-900 rounded-lg shadow-md h-[400px]">
          <h2 className="text-xl font-semibold mb-2 text-white">
            Instructions
          </h2>
          <p className="mb-4 text-gray-300">Follow these key guidelines:</p>

          {!isStarted ? (
            <ul className="list-disc list-inside text-gray-200 space-y-2 overflow-y-auto">
              <li>Maintain eye contact and use natural hand gestures.</li>
              <li>Show confidence through posture and voice tone.</li>
              <li>Control anxiety and manage nerves professionally.</li>
              <li>Use clear, concise language to express your thoughts.</li>
              <li>Display positive body language and stay engaged.</li>
              <li>Listen actively and respond thoughtfully to questions.</li>
              <li>Adapt quickly to unexpected questions or scenarios.</li>
              <li>Show enthusiasm and energy for the role.</li>
            </ul>
          ) : (
            <>
              <p className="text-lg text-white mt-4">Question: {question}</p>
              <p className="text-md text-gray-300 mt-2">
                Your Answer: {transcript}
              </p>
            </>
          )}

          <button
            onClick={handleToggleClick}
            className="mt-auto bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
          >
            {isStarted ? "Abort" : "Next"}
          </button>

          {isStarted && (
            <button
              onClick={
                questionIndex < totalQuestions
                  ? fetchNextQuestion
                  : handleSubmitResponses
              }
              className="mt-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-500"
              disabled={isSubmitting} // Disable the button when isSubmitting is true
            >
              {questionIndex < totalQuestions
                ? "Next Question"
                : "Submit Responses"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default Evaluate;
