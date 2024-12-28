import React, { useState } from 'react';


function Contact() {

  const [isSubmitted, setIsSubmitted] = useState(false);

 
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault(); 
    setIsSubmitted(true); 
    setTimeout(() => {
      setIsSubmitted(false); 
    }, 3000);
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-stretch bg-gradient-to-b from-black via-gray-900 to-purple-800 min-h-screen p-10 space-x-4">
      
   
      <div className="w-full md:w-1/2 p-8 rounded-lg shadow-lg text-white flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-2 text-center">Message Us</h3>
          <p className="text-center text-gray-400 mb-6">Get in Touch with us ✨</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Email"
                required
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Name"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                Your Message
              </label>
              <textarea
                id="message"
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Your Message"
                rows={4}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-n-17 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-600 transition duration-300 shadow-md"
            >
              Send ➤
            </button>
          </form>

         
          {isSubmitted && (
            <div className="mt-4 text-center text-green-500">
              <p>Your message has been sent successfully!</p>
            </div>
          )}
        </div>

    
      </div>
    </div>
  );
}

export default Contact;
