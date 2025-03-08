import React from "react";
import {
  CreditCard,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react";
import FeaturesSection from "./FeturesSection.jsx";
import TestimonialSection from "./Testimonials.jsx";
import Footer from "./FooterSection.jsx";

const LandingPage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-12 md:py-24 lg:py-32 flex flex-col md:flex-row items-center">
        {/* Left Content */}
        <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
            Track & Split Expenses{" "}
            <span className="text-orange-400">Effortlessly</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 max-w-md mx-auto md:mx-0">
            Simplify your group finances and personal budgeting with SplitIt.
            Track expenses, split bills, and manage shared costs with friends,
            roommates, and family.
          </p>
          <button className="mx-auto md:mx-0 px-6 py-2 sm:py-3 bg-orange-400 text-white rounded hover:bg-orange-500 transition flex items-center justify-center">
            <span>Get Started</span>
          </button>
        </div>

        {/* Right Content - App Preview */}
        <div className="md:w-1/2 relative h-96 sm:h-80 md:h-96 w-full max-w-md mx-auto">
          {/* Dashboard Card */}
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg transform rotate-3 mb-4 border border-gray-700 absolute inset-x-0 top-0">
            <div className="mb-4">
              <div className="text-xs sm:text-sm text-gray-400">
                Total Expenses
              </div>
              <div className="text-xl sm:text-2xl font-bold">$1,342.75</div>
              <div className="text-xs sm:text-sm text-red-400">
                +12% from last month
              </div>
            </div>

            <div className="h-32 sm:h-40 flex items-end space-x-1 sm:space-x-2">
              {[60, 40, 75, 50, 65, 45, 80].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-orange-400 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs mt-1 text-gray-400">
                    {String.fromCharCode(65 + index)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expense Card */}
          <div className="absolute top-24 sm:top-32 right-0 bg-orange-400 p-4 sm:p-6 rounded-lg shadow-lg transform -rotate-3 w-48 sm:w-64 text-white">
            <div className="mb-3 sm:mb-4">
              <div className="text-xs sm:text-sm opacity-80">Group Balance</div>
              <div className="text-xl sm:text-2xl font-bold">$238.50</div>
              <div className="text-xs sm:text-sm">You are owed</div>
            </div>

            <div className="flex justify-between items-center mt-2 sm:mt-4 text-xs sm:text-sm">
              <div className="flex items-center">
                <Users size={16} className="mr-1 sm:mr-2" />
                <span>4 members</span>
              </div>
              <div className="text-white font-bold">View</div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="absolute bottom-0 left-0 bg-gray-800 p-3 sm:p-4 rounded-lg shadow-lg w-56 sm:w-72 border border-gray-700">
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <div className="font-bold text-sm sm:text-base">
                Recent Transactions
              </div>
              <Calendar size={16} />
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between bg-gray-700 p-2 rounded">
                <div className="flex items-center">
                  <div className="bg-green-500 p-1 sm:p-2 rounded mr-2 sm:mr-3">
                    <DollarSign size={14} />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium">
                      Dinner at Joe's
                    </div>
                    <div className="text-xs text-gray-400">
                      Split with Alex, Sam
                    </div>
                  </div>
                </div>
                <div className="text-red-400 text-xs sm:text-sm">-$48.50</div>
              </div>

              <div className="flex items-center justify-between bg-gray-700 p-2 rounded">
                <div className="flex items-center">
                  <div className="bg-blue-500 p-1 sm:p-2 rounded mr-2 sm:mr-3">
                    <CreditCard size={14} />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium">
                      Grocery Run
                    </div>
                    <div className="text-xs text-gray-400">
                      Split with Roommates
                    </div>
                  </div>
                </div>
                <div className="text-red-400 text-xs sm:text-sm">-$87.25</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="h-px border-0 bg-gray-700 mx-4 sm:mx-12 md:mx-20 lg:mx-28 my-6 sm:my-8" />

      <FeaturesSection />

      <hr className="h-px border-0 bg-gray-700 mx-4 sm:mx-12 md:mx-20 lg:mx-28 my-6 sm:my-8" />

      <TestimonialSection />

      <hr className="h-px border-0 bg-gray-700 mx-4 sm:mx-12 md:mx-20 lg:mx-28 my-6 sm:my-8" />

      <Footer />
    </div>
  );
};

export default LandingPage;
