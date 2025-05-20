import React from 'react';
import CardLayout from '../../layouts/CardLayout';  // Updated import path

const TestimonialBox = ({ quote, name, program, rating, color }) => {
  return (
    <CardLayout bgColor={`bg-gradient-to-br ${color}`} hoverEffect={true}>
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300/70'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      
      <p className="text-gray-700 italic mb-4 relative">
        <span className="absolute -top-3 -left-2 text-3xl text-gray-300 font-serif">"</span>
        <span className="pl-4 block text-sm">{quote}</span>
      </p>
      
      <div className="border-t border-white/30 pt-3">
        <p className="font-semibold text-gray-800 text-sm">{name}</p>
        <p className="text-gray-600 text-xs">{program} Student</p>
      </div>
    </CardLayout>
  );
};

export default TestimonialBox;