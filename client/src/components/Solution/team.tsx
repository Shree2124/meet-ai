import React from 'react';

const Team = () => {
  const teamMembers = [
    {
      name: 'Shree Alasande',
      role: 'Team Lead',
      img: 'https://via.placeholder.com/150', // Replace with actual image URL
    },
    {
      name: 'Nikhil Patil',
      role: 'Product Designer',
      img: 'https://via.placeholder.com/150', // Replace with actual image URL
    },
    {
      name: 'Avantika Patil',
      role: 'Creative Designer',
      img: 'https://via.placeholder.com/150', // Replace with actual image URL
    },
    {
      name: 'Aryan Patel',
      role: 'Marketing Manager',
      img: 'https://via.placeholder.com/150', // Replace with actual image URL
    },
    {
      name: 'Pranav',
      role: 'Software Engineer',
      img: 'https://via.placeholder.com/150', // Replace with actual image URL
    },
  ];

  return (
    <div className="py-12 bg-gradient-to-b from-black via-gray-900 to-purple-900">
      <div className="text-center mb-12">
        <button className="text-white border border-purple-500 py-2 px-4 rounded-full mb-4 hover:bg-purple-500 transition">
          Our Team
        </button>
        <h2 className="text-3xl font-bold text-white">The Brains Behind Our Service</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 px-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="rounded-lg shadow-lg p-6 text-center"
            style={{
              backgroundColor: 'rgba(30, 30, 60, 0.9)', // Dark background with a slight purple tint
              color: 'white',
            }}
          >
            <img
              src={member.img}
              alt={member.name}
              className="rounded-lg w-full h-48 object-cover mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
