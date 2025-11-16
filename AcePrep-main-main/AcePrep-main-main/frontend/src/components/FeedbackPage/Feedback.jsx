import React from "react";
import Gradient from "../partial/Gradient"; // Ensure this is defined elsewhere in your project
import AssessmentCard from "./Card";

const Feedback = () => {
  return (
    <>
      <main className="flex flex-col flex-grow relative isolate px-6 py-14 lg:px-8">
        <Gradient />
        <h1 className="text-3xl font-bold mb-4 mt-6">Assesment Results</h1>

        <div className="text-lg leading-8 text-gray-600">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Exercitationem soluta veniam maiores ex unde laborum rerum a magni
            ipsam ad doloribus praesentium, dolor accusamus ab nulla tenetur vel
            architecto totam..
          </p>
        </div>
          {/* Example card 1 */}
          <AssessmentCard />
        
      </main>
    </>
  );
};

export default Feedback;
