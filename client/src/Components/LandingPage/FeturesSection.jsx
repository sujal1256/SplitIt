import React from "react";

const FeaturesSection = () => {
  const features = [
    {
      icon: "expand",
      title: "Easy Splitting",
      description:
        "Split expenses effortlessly with friends, roommates, and family using simple and intuitive controls.",
    },
    {
      icon: "chip",
      title: "Real-Time Tracking",
      description:
        "Monitor who owes what with automatic calculations and instant updates when new expenses are added.",
    },
    {
      icon: "at",
      title: "Secure Payments",
      description:
        "Settle debts with secure, integrated payment options that protect your financial information.",
    },
    {
      icon: "user",
      title: "Group Management",
      description:
        "Create multiple groups for different scenarios, from vacations to household expenses to dining out.",
    },
  ];

  return (
    <section className="w-full bg-gray-900 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-3">
            What makes us different?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our app helps you track and split expenses with surprisingly simple
            and effective features.
          </p>
        </div>

        {/* Modified grid layout to show 2x2 on medium screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center flex flex-col items-center">
              <div className="bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                {feature.icon === "expand" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5"
                    />
                  </svg>
                )}
                {feature.icon === "chip" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                )}
                {feature.icon === "at" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                )}
                {feature.icon === "user" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 mb-6 px-4">{feature.description}</p>
            </div>
          ))}
        </div>
        </div>
    </section>
  );
};

export default FeaturesSection;
