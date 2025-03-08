import React from "react";
import bgAbout from "../Assets/bg-about.jpeg";
import dev1 from "../Assets/dev1.jpg";
import dev2 from "../Assets/dev2.jpg";
import { FaWhatsapp, FaLinkedin, FaInstagramSquare } from "react-icons/fa";

function About() {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-gray-900 text-white">

      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center py-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-orange-400">
            What is SplitIt?
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 leading-relaxed">
            SplitIt is an intuitive platform that enables groups to manage
            shared expenses effortlessly. From casual outings to long-term
            commitments, we ensure smooth and transparent financial tracking.
          </p>
          <p className="text-lg md:text-xl text-gray-300">
            Simplifying expense management for groups of all sizes. Split,
            track, and settle expenses seamlessly.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-6 bg-gray-800">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300">
            <h3 className="text-xl font-semibold text-orange-400">
              Group Expense Tracking
            </h3>
            <p className="text-gray-300 mt-2">
              Organize shared expenses in real-time with accuracy and ease.
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300">
            <h3 className="text-xl font-semibold text-orange-400">
              Secure Authentication
            </h3>
            <p className="text-gray-300 mt-2">
              Your data is safe with robust encryption and privacy measures.
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300">
            <h3 className="text-xl font-semibold text-orange-400">
              Easy Settlements
            </h3>
            <p className="text-gray-300 mt-2">
              Transparent balances and simplified payment options for all users.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 md:px-6 bg-gray-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-orange-400">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="border border-orange-400 rounded-lg p-6 bg-gray-900 hover:bg-gray-800 transition duration-300">
              <h3 className="text-xl font-semibold">1. Create Groups</h3>
              <p className="text-gray-300 mt-2">
                Start by creating a group or joining one.
              </p>
            </div>
            <div className="border border-orange-400 rounded-lg p-6 bg-gray-900 hover:bg-gray-800 transition duration-300">
              <h3 className="text-xl font-semibold">2. Add Expenses</h3>
              <p className="text-gray-300 mt-2">
                Log expenses and payments easily.
              </p>
            </div>
            <div className="border border-orange-400 rounded-lg p-6 bg-gray-900 hover:bg-gray-800 transition duration-300">
              <h3 className="text-xl font-semibold">3. Track Balances</h3>
              <p className="text-gray-300 mt-2">
                See who owes what in real-time.
              </p>
            </div>
            <div className="border border-orange-400 rounded-lg p-6 bg-gray-900 hover:bg-gray-800 transition duration-300">
              <h3 className="text-xl font-semibold">4. Settle Up</h3>
              <p className="text-gray-300 mt-2">
                Pay or get paid with a single tap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section className="py-16 px-4 md:px-6 bg-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-orange-400">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="p-6 bg-gray-900 shadow-lg rounded-lg hover:bg-gray-800 transition duration-300">
              <img
                src={dev1}
                alt="Developer 1"
                className="rounded-lg mx-auto w-full max-w-xs"
              />
              <h4 className="mt-4 font-bold text-orange-400">SHRIYA SETH</h4>
              <p className="text-gray-300">Leading Front-End Developer</p>
              <div className="flex justify-center gap-6 md:gap-9 text-2xl md:text-3xl p-2">
                <a
                  target="_blank"
                  href="https://www.linkedin.com/in/shriya-seth-a4059b266/"
                  className="text-gray-300 hover:text-orange-400 transition duration-300"
                >
                  <FaLinkedin />
                </a>
                <a
                  target="_blank"
                  href="https://www.instagram.com/shriyaseth.25/"
                  className="text-gray-300 hover:text-orange-400 transition duration-300"
                >
                  <FaInstagramSquare />
                </a>
              </div>
            </div>
            <div className="p-6 bg-gray-900 shadow-lg rounded-lg hover:bg-gray-800 transition duration-300">
              <img
                src={dev2}
                alt="Developer 2"
                className="rounded-lg mx-auto w-full max-w-xs"
              />
              <h4 className="mt-4 font-bold text-orange-400">SUJAL MALHOTRA</h4>
              <p className="text-gray-300">Leading Back-End Developer</p>
              <div className="flex justify-center gap-6 md:gap-9 text-2xl md:text-3xl p-2">
                <a
                  target="_blank"
                  href="https://www.linkedin.com/in/sujal-malhotra/"
                  className="text-gray-300 hover:text-orange-400 transition duration-300"
                >
                  <FaLinkedin />
                </a>
                <a
                  target="_blank"
                  href="https://www.instagram.com/msujal29/"
                  className="text-gray-300 hover:text-orange-400 transition duration-300"
                >
                  <FaInstagramSquare />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 md:py-20 px-4 md:px-6 bg-gray-900">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-orange-400">
          Join the SplitIt Community
        </h2>
        <p className="text-base md:text-lg lg:text-xl mb-8 text-gray-300 max-w-3xl mx-auto">
          Take control of your expenses and avoid financial misunderstandings.
        </p>
        <a
          href="/"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 md:px-8 py-3 rounded-lg font-semibold transition duration-300"
        >
          Get Started
        </a>
      </section>
    </div>
  );
}

export default About;