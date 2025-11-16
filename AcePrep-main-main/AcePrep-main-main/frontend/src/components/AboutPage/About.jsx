import React, { useEffect } from "react";
import Gradient from "../partial/Gradient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedin,
  faInstagram,
  faTwitter,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const About = () => {
  useEffect(() => {
    const animateElements = document.querySelectorAll(".animate-on-scroll");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    animateElements.forEach((element) => {
      observer.observe(element);
    });
  }, []);

  return (
    <>
      <main className="relative isolate px-4 sm:px-6 lg:px-8">
        <Gradient />
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-on-scroll">
              Our Story
            </h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-on-scroll">
              Building solutions that make a difference
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Profile Image */}
            <div className="w-full lg:w-1/3 animate-on-scroll">
              <div className="profile-card rounded-2xl overflow-hidden shadow-xl w-full h-85 relative group">
                <img
                  src="/profile.jpg"
                  alt="Our Team"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Profile Content */}
            <div className="w-full lg:w-2/3 animate-on-scroll flex items-center">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  Meet the Creator & The Vision Behind AcePrep
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  <strong>Divyanshu Singh</strong> <br />
                  Full Stack Developer | GenAI Explorer | Building AcePrep | CSE
                  @ Chandigarh University
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  <strong>AcePrep</strong> is a cutting-edge platform designed
                  to help individuals enhance their communication and
                  interpersonal abilities. Leveraging advanced generative AI
                  technology, it aims to simulate realistic interview and HR
                  evaluation experiences.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Built with purpose and passion, AcePrep empowers users to grow
                  confidently by practicing real-world questions and receiving
                  constructive feedback — making career readiness accessible and
                  effective for everyone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Links Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Connect With Us
            </h3>
            <div className="flex justify-center space-x-6">
              <a
                href="https://www.linkedin.com/in/divi-/"
                className="social-icon text-gray-500 hover:text-purple-600 transition-colors duration-300"
              >
                <span className="sr-only">LinkedIn</span>
                <FontAwesomeIcon icon={faLinkedin} className="text-3xl" />
              </a>
              <a
                href="https://dev-divyanshu.netlify.app/"
                className="social-icon text-gray-500 hover:text-purple-600 transition-colors duration-300"
              >
                <span className="sr-only">Website</span>
                <FontAwesomeIcon icon={faGlobe} className="text-3xl" />
              </a>
              <a
                href="https://www.instagram.com/divyanshu_8/"
                className="social-icon text-gray-500 hover:text-purple-600 transition-colors duration-300"
              >
                <span className="sr-only">Instagram</span>
                <FontAwesomeIcon icon={faInstagram} className="text-3xl" />
              </a>
              <a
                href="https://x.com/idivyanshu8"
                className="social-icon text-gray-500 hover:text-purple-600 transition-colors duration-300"
              >
                <span className="sr-only">Twitter</span>
                <FontAwesomeIcon icon={faTwitter} className="text-3xl" />
              </a>
              <a
                href="https://github.com/divyanshuu8"
                className="social-icon text-gray-500 hover:text-purple-600 transition-colors duration-300"
              >
                <span className="sr-only">GitHub</span>
                <FontAwesomeIcon icon={faGithub} className="text-3xl" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;
