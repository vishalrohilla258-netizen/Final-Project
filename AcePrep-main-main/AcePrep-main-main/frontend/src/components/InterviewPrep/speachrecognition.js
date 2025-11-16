// useSpeechRecognition.js
import { useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const useCustomSpeechRecognition = (isStarted) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (isStarted) {
      SpeechRecognition.startListening({ continuous: true }); // Start listening when assessment starts
    } else {
      SpeechRecognition.stopListening(); // Stop listening when assessment stops
    }

    return () => {
      SpeechRecognition.stopListening(); // Ensure listening is stopped when component unmounts
    };
  }, [isStarted]); // Dependency on isStarted

  return {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  };
};

export default useCustomSpeechRecognition;
