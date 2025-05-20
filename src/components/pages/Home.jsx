import React from 'react';
import HeroSection from '../views/home/HeroSection';
import StudentFeedback from '../views/home/StudentFeedback';
import HowItWorks from '../views/home/HowItWorks';
import CallToAction from '../views/home/CallToAction';
import CardLayout from '../layouts/CardLayout';
import SectionContainer from '../layouts/SectionContainer';

function Home() {
  const testimonials = [
    {
      quote: "Found my perfect supervisor within a week of using this platform!",
      name: "Ali Akbar",
      program: "Computer Science",
      rating: 5,
      color: "from-blue-100 to-indigo-100"
    },
    {
      quote: "The availability tracking saved me so much time in contacting busy professors.",
      name: "Rashid Ali",
      program: "Data Analytics",
      rating: 4,
      color: "from-purple-100 to-blue-100"
    },
    {
      quote: "Made the FYP process much less stressful by easily matching with supervisors in my domain.",
      name: "Rana Malik",
      program: "Cybersecurity",
      rating: 5,
      color: "from-indigo-100 to-purple-100"
    }
  ];

  return (
    <>
      <HeroSection />
      
      <SectionContainer title="How It Works" subtitle="Find your perfect supervisor in three simple steps">
        <HowItWorks />
      </SectionContainer>
      
      <SectionContainer title="Student Success Stories" subtitle="Hear from students who found their perfect match">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <CardLayout key={index} bgColor={`bg-gradient-to-br ${testimonial.color}`} hoverEffect={true}>
              <StudentFeedback {...testimonial} />
            </CardLayout>
          ))}
        </div>
      </SectionContainer>
      
      <CallToAction />
    </>
  );
}

export default Home;