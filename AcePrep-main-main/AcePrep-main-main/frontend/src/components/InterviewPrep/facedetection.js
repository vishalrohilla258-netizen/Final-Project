// src/components/InterviewPrep/FaceDetection.js

import * as faceapi from "face-api.js";

let modelsLoaded = false; // Global variable to track model loading status

const FaceDetection = (videoRef, canvasRef) => {
  const loadModels = async () => {
    if (!modelsLoaded) {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        modelsLoaded = true; // Set the modelsLoaded flag to true after loading
        console.log("Models loaded successfully.");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    }
  };

  const detectFaces = async () => {
    let isStraight = false; // Initialize isStraight

    if (videoRef.current && canvasRef.current) {
      const videoElement = videoRef.current;
      const canvasElement = canvasRef.current;

      const displaySize = {
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
      };

      // Match canvas to video dimensions
      faceapi.matchDimensions(canvasElement, displaySize);

      // Detect faces with landmarks and expressions
      const detections = await faceapi
        .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions({
          inputSize: 512,
          scoreThreshold: 0.5,
        }))
        .withFaceLandmarks()
        .withFaceExpressions();

      // Resize detections to match display size
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      // Clear canvas before drawing
      const ctx = canvasElement.getContext("2d");
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      // Draw detections on the canvas
      faceapi.draw.drawDetections(canvasElement, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasElement, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvasElement, resizedDetections);

      // Set fill color to red for facial landmarks
      ctx.fillStyle = "red"; 

      let straightCount = 0; // Counter for straight points
      let notStraightCount = 0; // Counter for not straight points

      resizedDetections.forEach(detection => {
        const landmarks = detection.landmarks;

        // Draw all landmarks as points
        landmarks.positions.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI); // Circle radius
          ctx.fill(); // Fill the circle

          // Count points based on straight criteria
          if (Math.round(point.x) > 300 && Math.round(point.x) < 380) {
            straightCount++;
          } else {
            notStraightCount++;
          }
        });
      });

      // Determine if the overall is straight
      isStraight = straightCount - notStraightCount > 0;

      // Log the result
      console.log(`isStraight: ${isStraight}`);
    }

    return { isStraight }; // Return isStraight
  };

  return { loadModels, detectFaces };
};

export default FaceDetection;
