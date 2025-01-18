import React, { useState } from "react";
import contactBack from "../Assets/contactBack.jpg";
import { toast } from "react-toastify";
import { validateEmail } from "../../utils/regexCheck";

function Contact() {
  const [contact, setContact] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [subscribeEmail, setSubscribeEmail] = useState("");

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!validateEmail(subscribeEmail)) {
      toast.error("Please enter a valid email address", {
        className: "toast-mobile",
      });
      return;
    }
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/v1/mail/subscription",
      {
        method: "POST",
        body: JSON.stringify({
          email: subscribeEmail,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      console.log("Subscribed successfully!");
    } else {
      console.error("An error occurred while subscribing");
    }

    setSubscribeEmail("");
    toast.success("Subscribed successfully!", {
      className: "toast-mobile",
    });
  }

  async function handleSendMessage(e) {
    e.preventDefault();

    if (!validateEmail(contact.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/v1/mail/contact-us",
      {
        method: "POST",
        body: JSON.stringify({
          name: contact.name,
          email: contact.email,
          message: contact.message,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      toast.success("Message sent successfully!", {
        className: "toast-mobile",
      });
    } else {
      console.error("An error occurred while sending the message");
    }

    setContact({
      name: "",
      email: "",
      message: "",
    });
  }
  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col items-center p-8"
      style={{
        backgroundImage: `url(/contactBack.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Top Section: Centered Header */}
      <div className="text-center w-full max-w-4xl mb-12">
        <h1 className="text-5xl font-bold bg-clip-text text-text-colour bg-gradient-to-r from-white to-gray-300">
          Want to Know More?
        </h1>
        <p className="text-3xl text-text-color">Reach Out to Us!</p>
      </div>

      {/* Form Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Contact Us
        </h1>
        <p className="text-gray-600 text-center mb-6">
          We’d love to hear from you! Please fill out the form below.
        </p>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700">
              Your Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md "
              placeholder="Enter your name"
              required
              value={contact.name}
              onChange={(e) => {
                setContact({ ...contact, name: e.target.value });
              }}
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium text-gray-700">
              Your Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md "
              placeholder="Enter your email"
              required
              value={contact.email}
              onChange={(e) => {
                setContact({ ...contact, email: e.target.value });
              }}
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block font-medium text-gray-700"
            >
              Your Message:
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={contact.message}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Type your message here..."
              required
              onChange={(e) => {
                setContact({ ...contact, message: e.target.value });
              }}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-Accent "
            onClick={handleSendMessage}
          >
            Send Message
          </button>
        </form>
      </div>

      <div className="bg-primary p-8 mt-5 rounded-lg shadow-lg mb-12 w-full text-center">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-black-500">
              What is your response time?
            </h3>
            <p className="text-gray-300">
              We typically respond within 24-48 hours on business days.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-black-500">
              Do you offer international support?
            </h3>
            <p className="text-gray-300">
              Yes, we provide support for clients around the world.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-black-500">
              Can I schedule an appointment with your team?
            </h3>
            <p className="text-gray-300">
              Yes, please use our booking page to schedule a meeting with us.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full  mb-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Stay Updated!
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Subscribe to our newsletter for the latest updates.
        </p>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="email-newsletter"
              className="block font-medium text-gray-700"
            >
              Enter your email:
            </label>
            <input
              type="email"
              id="email-newsletter"
              name="email-newsletter"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              required
              value={subscribeEmail}
              onChange={(e) => {
                setSubscribeEmail(e.target.value);
              }}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-Accent"
            onClick={handleSubscribe}
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
