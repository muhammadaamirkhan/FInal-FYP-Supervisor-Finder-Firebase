import React from 'react'

const CardLayout = ({ children, bgColor = 'bg-white', hoverEffect = true }) => {
  return (
    <div className={`${bgColor} p-6 rounded-xl border border-gray-100 shadow-sm 
      ${hoverEffect ? 'hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300' : ''}`}>
      {children}
    </div>
  )
}

export default CardLayout