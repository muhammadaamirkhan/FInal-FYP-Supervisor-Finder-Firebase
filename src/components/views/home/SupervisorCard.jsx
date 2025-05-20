import React from 'react';
import { Link } from 'react-router-dom';

const domainColors = {
  "AI": "bg-purple-100 text-purple-800",
  "Cybersecurity": "bg-green-100 text-green-800",
  "Data Science": "bg-blue-100 text-blue-800",
  "Networks": "bg-orange-100 text-orange-800"
};

const SupervisorCard = ({ id, name, domain, slots, expertise, assignedStudents }) => {
  const availabilityText = slots > 0 
    ? `${slots} slot${slots > 1 ? 's' : ''} available` 
    : "No slots available";

  return (
    <>
      <div className={`${domainColors[domain] || 'bg-gray-100 text-gray-800'} w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold shadow-sm`}>
        {name.split(' ').map(n => n[0]).join('')}
      </div>

      <h3 className="text-lg font-semibold text-center mb-1 hover:text-blue-600 transition-colors">
        {name}
      </h3>

      <div className={`text-xs font-medium ${domainColors[domain] || 'bg-gray-100 text-gray-800'} px-3 py-1 rounded-full text-center mb-2`}>
        {domain}
      </div>

      <p className="text-sm text-gray-500 text-center mb-3">
        {expertise}
      </p>

      <div className="bg-gray-50 p-2 rounded text-center mb-4">
        <p className="text-xs text-gray-500">Assigned Students</p>
        <p className="font-medium">{assignedStudents}</p>
      </div>

      <p className={`text-sm font-medium text-center mb-4 ${
        slots > 0 ? 'text-green-600' : 'text-red-600'
      }`}>
        <span className={`inline-block px-3 py-1 rounded-full ${
          slots > 0 ? 'bg-green-50' : 'bg-red-50'
        }`}>
          {availabilityText}
        </span>
      </p>

      <Link 
        to={`/faculty/${id}`}  
        className="block w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all text-center"
      >
        View Profile →
      </Link>
    </>
  );
};

export default SupervisorCard;