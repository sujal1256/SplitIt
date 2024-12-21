import React from "react";
import bgAbout from "../Assets/bg-about.jpeg"
import bgAbout2 from "../Assets/bg-about2.jpeg"
import bgAbout3 from "../Assets/bg-about3.jpeg"
import dev1 from "../Assets/dev1.jpg"
import dev2 from "../Assets/dev2.jpg"
import { FaWhatsapp , FaLinkedin, FaInstagramSquare} from "react-icons/fa";


function About() {
  return (
    <div className="min-h-screen w-full  overflow-hidden">
  
  <section className="text-center text-white py-20 px-4 " 
   style={{ backgroundImage: `url(${bgAbout2})`, backgroundSize: 'cover' }}
     >
        <h1 className="text-4xl font-bold mb-4 ">Welcome to SplitIt</h1>
        <p className="text-lg md:text-2xl max-w-3xl mx-auto ">
          Simplifying expense management for groups of all sizes. Split, track,
          and settle expenses seamlessly.
        </p>
      </section>

      <div>
      <section className="py-16 px-6 bg-gradient-to-r from-background-color to-Accent">
        <div className="max-w-4xl mx-auto text-center ">
          <h2 className="text-3xl font-bold mb-6">What is SplitIt?</h2>
          <p className="text-lg text-gray-600">
            SplitIt is an intuitive platform that enables groups to manage
            shared expenses effortlessly. From casual outings to long-term
            commitments, we ensure smooth and transparent financial tracking.
          </p>
        </div>
      </section>

      
      <section className=" py-16 px-6 bg-gradient-to-r from-background-color to-Accent">
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
      </div>

      <section className="py-16 px-6 bg-primary" style={{ backgroundImage: `url(${bgAbout3})`, backgroundSize: 'cover' }}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-xl font-semibold">1. Create Groups</h3>
              <p className="text-black-600 mt-2">
                Start by creating a group or joining one.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">2. Add Expenses</h3>
              <p className="text-black-600 mt-2">
                Log expenses and payments easily.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">3. Track Balances</h3>
              <p className="text-black-600 mt-2">
                See who owes what in real-time.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">4. Settle Up</h3>
              <p className="text-black-600 mt-2">
                Pay or get paid with a single tap.
              </p>
            </div>
          </div>
        </div>
      </section>

      
      <section className=" py-16 px-6  bg-gray-200 ">
        <div className="max-w-5xl mx-auto text-center ">
          <h2 className="text-3xl font-bold mb-6 ">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white shadow-lg rounded-lg bg-gradient-to-r from-primary to-secondary">
              <p className="text-black-600 italic ">
                "SplitIt makes splitting expenses with my roommates effortless.
                No more awkward conversations!"
              </p>
              <h4 className="mt-4 font-bold">- Sujal M.</h4>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg bg-gradient-to-r from-primary to-secondary">
              <p className="text-black-600 italic">
                "This app has made group trips so much more enjoyable. Tracking
                payments is a breeze!"
              </p>
              <h4 className="mt-4 font-bold">- Sachman S.</h4>
            </div>
          </div>
        </div>
      </section>


      <section className=" py-16 px-6 bg-secondary" style={{ backgroundImage: `url(${bgAbout})`, backgroundSize: 'cover' }}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Developers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <img src={dev1} alt="Developer 1" />
              <h4 className="mt-4 font-bold"> SHRIYA SETH </h4>
              <p>Leading front-end developer</p>
              <div className="flex justify-center gap-9 text-3xl p-2">
                <a href="" ><FaWhatsapp /></a>
                <a href="https://www.linkedin.com/in/shriya-seth-a4059b266/"><FaLinkedin /></a>
                <a href="https://www.instagram.com/shriyaseth.25/"><FaInstagramSquare /></a>
              </div>
              

            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
            <img src={dev2} alt="Developer 2" />
              <h4 className="mt-4 font-bold">SUJAL MALHOTRA</h4>
              <p>Leading back-end developer</p>
              <div className="flex justify-center gap-9 text-3xl p-2">
                <a href=""><FaWhatsapp /></a>
                <a href=""><FaLinkedin /></a>
                <a href=""><FaInstagramSquare /></a>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="text-center py-20 text-white bg-gradient-to-r from-background-color to-Accent">
        <h2 className="text-2xl md:text-4xl font-bold mb-6 text-text-colour">
          Join the SplitIt Community
        </h2>
        <p className="text-lg md:text-xl mb-8 text-text-colour">
          Take control of your expenses and avoid financial misunderstandings.
        </p>
        <a
          href="/"
          className="bg-text-colour hover:bg-secondary text-white px-6 py-3 rounded-lg font-semibold"
        >
          Get Started
        </a>
      </section>
    </div>
  );
}

export default About;
