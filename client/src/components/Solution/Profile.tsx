import React, { useEffect, useState } from 'react';

const ProfileEdit = () => {
  const [user, setUser] = useState({
    firstName: 'ARYAN',
    lastName: 'PATEL',
    email: 'aryan.patel@example.com',
    city: 'New York',
    state: 'NY',
    profileImage: '/default-profile.png',
    description: 'Developer, Admin',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setUser((prevUser) => ({
        ...prevUser,
        profileImage: savedImage,
      }));
    }
  }, []);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const previewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUser((prevUser) => ({
          ...prevUser,
          profileImage: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        console.log('User data saved successfully!');
        localStorage.setItem('profileImage', user.profileImage);
      } else {
        console.error('Error saving user data:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <main className="flex-1 p-6 bg-black min-h-screen flex justify-center items-center">
      <div className="bg-gray-800 p-10 rounded-xl shadow-lg max-w-lg w-full relative text-center">
        {/* Profile Image */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-20">
          <div
            className="w-40 h-40 rounded-full bg-cover bg-center border-4 border-white shadow-lg"
            style={{ backgroundImage: `url(${user.profileImage})` }}
          ></div>
        </div>

        {/* User Info */}
        <div className="mt-24">
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between space-x-0 md:space-x-4">
                {['firstName', 'lastName'].map((field, index) => (
                  <div className="flex-1 mb-4 md:mb-0" key={index}>
                    <label htmlFor={field} className="block text-sm font-medium text-white">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      id={field}
                      name={field}
                      value={user[field as keyof typeof user]}
                      onChange={handleChange}
                      className="mt-1 w-full p-3 bg-gray-700 text-white rounded-md"
                      placeholder={`Enter ${field}`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col md:flex-row justify-between space-x-0 md:space-x-4">
                {['city', 'state'].map((field, index) => (
                  <div className="flex-1 mb-4 md:mb-0" key={index}>
                    <label htmlFor={field} className="block text-sm font-medium text-white">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      id={field}
                      name={field}
                      value={user[field as keyof typeof user]}
                      onChange={handleChange}
                      className="mt-1 w-full p-3 bg-gray-700 text-white rounded-md"
                      placeholder={`Enter ${field}`}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 bg-gray-700 text-white rounded-md"
                  placeholder="Enter Email"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={user.description}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 bg-gray-700 text-white rounded-md"
                  placeholder="Enter description"
                />
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-white mb-1">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-400 mb-4">
                {user.city}, {user.state}
              </p>
              <p className="text-white">{user.description}</p>
              {/* Edit Button */}
              <button
                onClick={handleEditToggle}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>

        {/* Save/Cancel Buttons */}
        {isEditing && (
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="button"
              onClick={handleEditToggle}
              className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 ${loading ? 'cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProfileEdit;
