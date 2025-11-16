import React, { useState, useEffect } from "react";
import Hero from "./components/HomePage/Hero";
import Pricing from "./components/PricingPage/Pricing";
import About from "./components/AboutPage/About";
import Login from "./components/LoginPage/Login.jsx";
import SignUp from "./components/SignUp Page/SignUp.jsx";
import Navbar from "./components/partial/Navbar";
import Footer from "./components/partial/Footer";
import InterviewPrep from "./components/InterviewPrep/InterviewPrep.jsx";
import Evaluate from "./components/InterviewPrep/Evaluate.jsx";
import FeedbackPage from "./components/FeedbackPage/Feedback.jsx";
import ExtendedCard from "./components/FeedbackPage/ExtendedCard.jsx";

import { Toaster, toast } from "react-hot-toast";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const App = () => {
  // eslint-disable-next-line
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to check session on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setToken("");
    // Remove the token from client-side storage (e.g., local storage or a cookie)
    localStorage.removeItem("token");
    toast.success("Logged out successfully.");
    setIsLoggedIn(false); // Update the parent component's state
  };

  const EvaluationRoute = () => {
    if (isLoggedIn) {
      return <Evaluate />;
    }
    toast.error("Please Login first !!!");
    return <Navigate to="/login" />; // Redirect if not admin
  };

  return (
    <Router>
      <div>
        <Toaster />
        {/* Define Routes */}
        <div className="relative flex flex-col h-screen">
          <Navbar
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          />
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/aboutus" element={<About />} />
            <Route
              path="/login"
              element={
                <Login setIsLoggedIn={setIsLoggedIn} setToken={setToken} />
              }
            />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/interviewprep" element={<InterviewPrep />} />
            <Route
              path="/interviewprep/evaluate"
              element={<EvaluationRoute />}
            />
            <Route
              path="/profile/:userId/assessments"
              element={<FeedbackPage />}
            />{" "}
            {/* Profile Assessment page */}
            <Route
              path="/profile/:userId/assessments/:assessmentId"
              element={<ExtendedCard />}
            />
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
