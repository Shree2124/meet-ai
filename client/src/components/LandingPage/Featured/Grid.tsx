import React from 'react';
import { BentoGrid, BentoGridItem, gridItems } from '@/components/LandingPage/ui/bento-grid';
import { cn } from '@/lib/utils';

function Aboutdemo() {
  return (
    <section id="about" className="mx-auto px-4 py-16 max-w-6xl">
      <div className="items-center gap-8 grid grid-cols-1 md:grid-cols-2">
        <div>
          <h2 className="mb-4 font-bold text-gray-900 dark:text-white text-2xl md:text-3xl">
            Transform Your Meeting Experience
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Our platform streamlines meeting workflows from preparation to follow-up, helping teams collaborate more effectively and accomplish more together.
          </p>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <div className="mr-3 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="shadow-lg rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
            alt="Team collaboration" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

// Benefits data
const benefits = [
  {
    title: "Save Time with AI Summaries",
    description: "Get concise, actionable summaries of all your meetings automatically."
  },
  {
    title: "Never Miss Action Items",
    description: "Track tasks and follow-ups with smart assignment and deadline features."
  },
  {
    title: "Seamless Integration",
    description: "Works with the tools you already use - calendar, email, and more."
  }
];

export default Aboutdemo;
