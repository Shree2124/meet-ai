import React from 'react';

function Footer() {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-start bg-black text-white p-10 space-y-8 md:space-y-0 animate-fade-in">
      <div className="flex flex-col text-gray-400">
        <h3 className="font-bold text-2xl mb-5">MeetAI</h3>
        <p className="text-sm">Empowering your meetings with AI.</p>
      </div>

      <div className="flex flex-col text-gray-400">
        <h3 className="font-bold text-2xl mb-5">Company</h3>
        <a href="#" className="mb-2 hover:underline transition duration-200">Home</a>
        <a href="#" className="mb-2 hover:underline transition duration-200">About Us</a>
        <a href="#" className="mb-2 hover:underline transition duration-200">FAQ</a>
        <a href="#" className="mb-2 hover:underline transition duration-200">Pricing</a>
      </div>

      <div className="flex flex-col text-gray-400">
        <h3 className="font-bold text-2xl mb-5">Product</h3>
        <a href="#" className="mb-2 hover:underline transition duration-200">Meetings</a>
        <a href="#" className="mb-2 hover:underline transition duration-200">Meeting Notes</a>
        <a href="#" className="mb-2 hover:underline transition duration-200">Booking Page</a>
      </div>

      <div className="flex flex-col text-gray-400">
        <h3 className="font-bold text-2xl mb-5">Contact</h3>
        <a href="#" className="mb-2 hover:underline transition duration-200">Help Center</a>
        <a href="#" className="mb-2 hover:underline transition duration-200">Feedback</a>
        <a href="#" className="mb-2 hover:underline transition duration-200">Sales</a>
      </div>
    </footer>
  );
}

export default Footer;
