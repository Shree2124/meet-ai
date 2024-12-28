import React from 'react';

function Copyright() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-6 md:p-10 space-y-4 md:space-y-0 w-full">
      <div className="text-center md:text-left mx-auto md:mx-0 text-gray-400">
        &copy; 2024 MeetAI. All Rights Reserved
      </div>
      <div className="text-center md:text-right mx-auto md:mx-0 text-gray-400">
        <a href="/privacy-policy" className="mr-4 hover:underline transition duration-200" aria-label="Privacy Policy">Privacy Policy</a>
        <a href="/legal-notice" className="mr-4 hover:underline transition duration-200" aria-label="Legal Notice">Legal Notice</a>
        <a href="/terms-of-use" className="hover:underline transition duration-200" aria-label="Terms of Use">Terms of Use</a>
      </div>
    </div>
  );
}

export default Copyright;
