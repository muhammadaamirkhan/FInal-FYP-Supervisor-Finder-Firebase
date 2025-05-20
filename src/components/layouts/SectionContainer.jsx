import React from 'react'

const SectionContainer = ({ title, subtitle, children, bg = "bg-indigo-50" }) => {
  return (
    <section className={`py-10 px-4 ${bg}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto mb-3"></div>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        {children}
      </div>
    </section>
  )
}

export default SectionContainer