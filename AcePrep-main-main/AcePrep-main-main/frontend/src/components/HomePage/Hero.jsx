// src/components/Hero.jsx
import React from "react";
import Gradient from "../partial/Gradient";

const Hero = () => {
  return (
    <>
      <main className="flex flex-grow items-center justify-center relative isolate px-6 pt-14 lg:px-8">
        <Gradient />
        <div className="mx-auto max-w-2xl text-center">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Introducing AcePrep - Your Softskills Partner.{" "}
              <a href="/" className="font-semibold text-indigo-600">
                <span className="absolute inset-0" aria-hidden="true"></span>
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            AcePrep - Master Your Softskills
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            AcePrep is an innovative platform designed to improve your
            communication abilities. Using cutting-edge generative AI, we assess
            your speaking, writing, and interpersonal skills through engaging
            interactive tests and exercises.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/InterviewPrep"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </a>
            <a
              href="/"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Discover Features <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </main>
    </>
  );
};

export default Hero;
