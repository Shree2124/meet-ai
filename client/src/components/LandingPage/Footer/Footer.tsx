import React from 'react';
import { Mail, Phone, MapPin, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-neutral-900 to-black text-white">
      {/* Main Footer Content */}
      <div className="mx-auto px-10 py-16 container">
        <div className="gap-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 font-bold text-transparent text-2xl">MeetAI</h3>
            <p className="mb-6 text-neutral-300 leading-relaxed">Empowering your meetings with AI-driven insights and productivity tools.</p>
            <div className="flex space-x-5">
              <a href="#" className="text-neutral-400 hover:text-blue-400 transition-colors duration-300">
                <Github size={22} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-blue-400 transition-colors duration-300">
                <Twitter size={22} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-blue-400 transition-colors duration-300">
                <Linkedin size={22} />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-6 font-bold text-white text-xl">Company</h3>
            <ul className="space-y-4">
              {['Home', 'About Us', 'Our Team', 'Careers', 'Press'].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="group flex items-center text-neutral-300 hover:text-blue-400 transition-colors duration-300">
                    <span>{item}</span>
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 ml-2 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-6 font-bold text-white text-xl">Product</h3>
            <ul className="space-y-4">
              {['Features', 'Pricing', 'Integrations', 'Documentation', 'API'].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="group flex items-center text-neutral-300 hover:text-blue-400 transition-colors duration-300">
                    <span>{item}</span>
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 ml-2 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-6 font-bold text-white text-xl">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="flex-shrink-0 mt-1 mr-3 text-blue-400" size={18} />
                <span className="text-neutral-300">123 Innovation Drive, Tech City, TC 98765</span>
              </div>
              <div className="flex items-center">
                <Phone className="flex-shrink-0 mr-3 text-blue-400" size={18} />
                <a href="tel:+11234567890" className="text-neutral-300 hover:text-blue-400 transition-colors duration-300">+1 (123) 456-7890</a>
              </div>
              <div className="flex items-center">
                <Mail className="flex-shrink-0 mr-3 text-blue-400" size={18} />
                <a href="mailto:info@meetai.com" className="text-neutral-300 hover:text-blue-400 transition-colors duration-300">info@meetai.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="py-10 border-neutral-800 border-t">
        <div className="mx-auto px-10 container">
          <div className="md:flex md:justify-between md:items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="font-bold text-white text-xl">Subscribe to our newsletter</h3>
              <p className="mt-2 text-neutral-400">Stay updated with the latest features and releases.</p>
            </div>
            <div className="flex sm:flex-row flex-col">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-neutral-800 mb-2 sm:mb-0 px-4 py-3 border border-neutral-700 focus:border-blue-400 rounded-l focus:outline-none w-full text-white"
              />
              <button className="bg-gradient-to-r from-blue-500 hover:from-blue-600 to-purple-600 hover:to-purple-700 px-6 py-3 rounded-r font-medium text-white transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-6 border-neutral-800 border-t">
        <div className="mx-auto px-10 container">
          <div className="md:flex md:justify-between md:items-center text-sm">
            <div className="mb-4 md:mb-0 text-neutral-400">
              © {currentYear} MeetAI. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Accessibility'].map((item, idx) => (
                <a key={idx} href="#" className="text-neutral-400 hover:text-blue-400 transition-colors duration-300">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}