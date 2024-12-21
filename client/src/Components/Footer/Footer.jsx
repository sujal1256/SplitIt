import React from "react";
import AboutBack from "../Assets/AboutBack2.jpg";

function Footer() {
  return (
    <footer className="bg-primary text-text-colour py-10 font-semibold text-3xl "
    style={{
      backgroundImage: `url(${AboutBack})`, 
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    }}
    >
      <div className="flex justify-items-end">
      {/* Top Section */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 ">
        {/* About Us */}
        <div>
          <h3 className="text-lg font-bold  mb-4">About SplitIt</h3>
          <p className="text-sm ">
            SplitIt is your ultimate expense management platform, simplifying
            group expense tracking and settlements. Join us to streamline your
            finances effortlessly.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold  mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm ">
            <li>
              <a
                href="/about"
                className="hover:text-text-colour transition duration-300"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="hover:text-text-colour transition duration-300"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="/privacy"
                className="hover:text-text-colour transition duration-300"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/terms"
                className="hover:text-text-colour transition duration-300"
              >
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-bold  mb-4">Get in Touch</h3>
          <p className="text-sm ">
            Have questions or feedback? Reach out to us:
          </p>
          <p className="mt-2 text-sm ">
            <strong>Email:</strong>{" "}
            <a
              href="mailto:support@splitit.com"
              className="hover:text-text-colour transition duration-300"
            >
              support@splitit.com
            </a>
          </p>
          <p className="text-sm  pt-2">
            <strong>Phone:</strong>{" "}
            <a
              href="tel:+1234567890"
              className="hover:text-text-colour transition duration-300"
            >
              +1 234 567 890
            </a>
          </p>
        </div>
      </div>
      </div>

      {/* Divider */}
      <div className="my-8 border-t border-text-colour"></div>

      {/* Bottom Section */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm ">
        <p className="mb-4 md:mb-0">
          © {new Date().getFullYear()} SplitIt. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-colour transition duration-300"
          >
            Facebook
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-colour transition duration-300"
          >
            Twitter
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-colour transition duration-300"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

