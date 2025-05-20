import React from "react";

function HowItWorks() {
  const steps = [
    {
      title: "Browse Profiles",
      description:
        "Explore supervisor profiles based on research domains and availability",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Check Availability",
      description: "View open slots and office hours for each supervisor",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      title: "Make Contact",
      description: "Send meeting requests to potential supervisors",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      color: "text-green-500",
      bg: "bg-green-50",
    },
  ];

  return (
    <section className="py-10 px-4 bg-indigo-50">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 relative overflow-hidden group"
            >
              {/* Animated border effect */}
              <div
                className={`absolute inset-x-0 bottom-0 h-1 ${step.bg.replace(
                  "50",
                  "400"
                )} transition-all duration-500 group-hover:h-2`}
              ></div>

              <div className={`${step.color} mb-3 flex justify-center`}>
                <div
                  className={`${step.bg} p-3 rounded-full group-hover:scale-110 transition-transform duration-300`}
                >
                  {step.icon}
                </div>
              </div>

              <h3 className="text-md font-semibold text-gray-800 mb-2 text-center group-hover:text-blue-600 transition-colors">
                {step.title}
              </h3>
              <p className="text-gray-600 text-xs text-center mb-3">
                {step.description}
              </p>

              <div className="flex justify-center">
                <span
                  className={`text-xs font-medium ${step.bg} ${step.color} px-2 py-1 rounded-full`}
                >
                  Step {index + 1}
                </span>
              </div>

              {/* Pulse animation dot */}
              <div
                className={`absolute top-3 right-3 w-2 h-2 rounded-full ${step.bg.replace(
                  "50",
                  "400"
                )} animate-pulse`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
