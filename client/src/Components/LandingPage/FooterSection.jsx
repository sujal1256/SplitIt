import React, { useState } from "react";
import { Send, Mail, Instagram, Twitter, Facebook } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically integrate with your email service
      setSubscribed(true);
      setEmail("");
      // Reset subscription message after 3 seconds
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-white p-8">
      {/* Newsletter Subscription Section */}
      <div className="bg-gray-800 rounded-lg mx-4 md:mx-auto max-w-6xl mb-8 py-10 px-6 md:p-8 ">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h3 className="text-xl md:text-2xl font-bold mb-2">
              Sign Up For Our{" "}
              <span className="text-orange-400">Newsletters</span>
            </h3>
            <p className="text-gray-400 text-sm">
              To subscribe to our emails, you will get notified about our latest
              product and news letter
            </p>
          </div>
          <div className="w-full md:w-auto">
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email here"
                className="bg-gray-700 text-white px-4 py-3 rounded-l w-full focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-orange-400 text-white px-6 py-3 rounded-r hover:bg-blue-600 transition duration-200"
              >
                Submit
              </button>
            </form>
            {subscribed && (
              <p className="text-green-400 text-sm mt-2">
                Thanks for subscribing!
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="border-t border-gray-800 pt-4 mt-4 px-10 ">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs mb-2 md:mb-0">
            © Copyright {new Date().getFullYear()} SplitIt. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-white text-xs flex justify-center items-center">
              Terms and Conditions
            </a>
            <span className="text-gray-500">|</span>
            <a href="#" className="text-gray-500 hover:text-white text-xs flex justify-center items-center">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
