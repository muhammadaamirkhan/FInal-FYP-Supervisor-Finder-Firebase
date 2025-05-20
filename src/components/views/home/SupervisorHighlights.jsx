import React from 'react';

function SupervisorHighlights() {
  const supervisors = [
    {
      name: "Dr. Ali Akbar",
      domain: "Artificial Intelligence",
      availability: "5 slots remaining",
      expertise: "Machine Learning, NLP"
    },
    {
      name: "Prof. Nadeem Ahmad",
      domain: "Data Science",
      availability: "3 slots remaining",
      expertise: "Big Data, Analytics"
    },
    {
      name: "Dr. Yasir",
      domain: "Cybersecurity",
      availability: "2 slots remaining",
      expertise: "Network Security, Cryptography"
    }
  ];

  const domainColors = {
    "Artificial Intelligence": "bg-purple-100 text-purple-800",
    "Data Science": "bg-blue-100 text-blue-800",
    "Cybersecurity": "bg-green-100 text-green-800"
  };

  return (
    <section className="py-12 px-4 bg-indigo-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Featured Supervisors</h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto mb-3"></div>
          <p className="text-gray-600">Connect with our most sought-after academic advisors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supervisors.map((supervisor, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 group"
            >
              {/* Initials Badge */}
              <div className={`${domainColors[supervisor.domain]} w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold shadow-sm`}>
                {supervisor.name.split(' ')[0].charAt(0)}{supervisor.name.split(' ')[1].charAt(0)}
              </div>

              {/* Supervisor Name */}
              <h3 className="text-lg font-semibold text-center mb-1 transition-colors duration-300 group-hover:text-blue-600">
                {supervisor.name}
              </h3>

              {/* Domain Tag */}
              <div className={`text-xs font-medium ${domainColors[supervisor.domain]} px-3 py-1 rounded-full text-center mb-2 transition-all`}>
                {supervisor.domain}
              </div>

              {/* Expertise */}
              <p className="text-sm text-gray-500 text-center mb-3">
                {supervisor.expertise}
              </p>

              {/* Availability */}
              <p className="text-blue-600 font-medium text-center text-sm mb-4">
                <span className="inline-block bg-blue-50 px-3 py-1 rounded-full">
                  {supervisor.availability}
                </span>
              </p>

              {/* Button */}
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-300 hover:bg-blue-700 hover:shadow-md transform hover:scale-105 active:scale-95">
                View Profile →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SupervisorHighlights;
