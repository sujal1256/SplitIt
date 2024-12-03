import React from "react";
import AboutBack from "../Assets/AboutBack.jpg";
import bk from "../Assets/Background.avif"


function About() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="text-center bg-gradient-to-r from-amber-500 to-yellow-700 text-white py-20 px-4"
      style={{
        backgroundImage: `url(${AboutBack})`, 
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to SplitIt</h1>
        <p className="text-lg md:text-2xl max-w-3xl mx-auto">
          Simplifying expense management for groups of all sizes. Split, track,
          and settle expenses seamlessly.
        </p>
      </section>

      {/* About SplitIt */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">What is SplitIt?</h2>
          <p className="text-lg text-gray-600">
            SplitIt is an intuitive platform that enables groups to manage
            shared expenses effortlessly. From casual outings to long-term
            commitments, we ensure smooth and transparent financial tracking.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold">Group Expense Tracking</h3>
            <p className="text-gray-600 mt-2">
              Organize shared expenses in real-time with accuracy and ease.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Secure Authentication</h3>
            <p className="text-gray-600 mt-2">
              Your data is safe with robust encryption and privacy measures.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Easy Settlements</h3>
            <p className="text-gray-600 mt-2">
              Transparent balances and simplified payment options for all users.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6" 
      style={{
        backgroundImage: `url(${bk})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover", 
        width: "100vw", 
        
      }}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-xl font-semibold">1. Create Groups</h3>
              <p className="text-gray-600 mt-2">
                Start by creating a group or joining one.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">2. Add Expenses</h3>
              <p className="text-gray-600 mt-2">
                Log expenses and payments easily.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">3. Track Balances</h3>
              <p className="text-gray-600 mt-2">
                See who owes what in real-time.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">4. Settle Up</h3>
              <p className="text-gray-600 mt-2">
                Pay or get paid with a single tap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <p className="text-gray-600 italic">
                "SplitIt makes splitting expenses with my roommates effortless.
                No more awkward conversations!"
              </p>
              <h4 className="mt-4 font-bold">- Sujal M.</h4>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <p className="text-gray-600 italic">
                "This app has made group trips so much more enjoyable. Tracking
                payments is a breeze!"
              </p>
              <h4 className="mt-4 font-bold">- Sachman S.</h4>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 bg-amber-500 text-white"
      style={{
        backgroundImage: `url(${AboutBack})`, 
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      >
        <h2 className="text-2xl md:text-4xl font-bold mb-6">
          Join the SplitIt Community
        </h2>
        <p className="text-lg md:text-xl mb-8">
          Take control of your expenses and avoid financial misunderstandings.
        </p>
        <a
          href="/"
          className="bg-amber-600 hover:bg-amber-900 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Get Started
        </a>
      </section>
    </div>
  );
}

export default About;
