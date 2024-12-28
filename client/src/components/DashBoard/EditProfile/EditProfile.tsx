
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchUser } from '@/redux/slices/authSlice';
import axiosInstance from '@/utils/axios';

interface LocalUser{
userName:string,
fullName:string,
avatar:string,
newAvatar:File | null
}

const ProfileEdit = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  


  // Initialize local state with user data from Redux store
  const [localUser, setLocalUser] = useState<LocalUser>({
    userName: user?.userName || 'Test',
    fullName: user?.fullName || 'Test',
    avatar: user?.avatar ,
    newAvatar:null
  });


  console.log("Local User: ", localUser);
  
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
     
      const formData = new FormData();
  
   
      if (localUser.newAvatar instanceof File) {
        formData.append('avatar', localUser.newAvatar);
      }
  

      formData.append('userName', localUser.userName);
      formData.append('fullName', localUser.fullName);

      const response = await axiosInstance.put('user/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file upload
        },
      });
  
      if (response) {
        console.log('User data saved successfully!');
      } else {
        console.error('Error saving user data:', response);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <main className="flex flex-1 h-screen overflow-hidden">
      <div className="sm:w-[130px] md:w-[130px] lg:w-[264px]"></div>
      <div className="flex-1 flex justify-center items-center p-6">
        <div className="bg-blueAccent-1001 p-10 rounded-xl shadow-lg max-w-lg w-full relative text-center">
          {/* Profile Image */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-20">
            <label htmlFor="avatar-upload" className={`relative ${isEditing ? 'cursor-pointer' : ''}`}>
              <div
                className="w-40 h-40 rounded-full bg-cover bg-center border-4 border-white shadow-lg"
                style={{
                  backgroundImage: localUser?.avatar ? `url(${localUser?.avatar})` : 'https://www.w3schools.com/howto/img_avatar.png',
                  backgroundColor: localUser?.avatar ? 'transparent' : 'gray', // For debugging
                }}
              >
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                    <span className="text-white text-sm">Click to change avatar</span>
                  </div>
                )}
              </div>
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setLocalUser((prevUser) => ({
                          ...prevUser,
                          newAvatar: file,
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                  id="avatar-upload"
                />
              )}
            </label>
          </div>

          <div className="mt-24 space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-white">Username</label>
                  <input
                    type="text"
                    name="userName"
                    value={localUser.userName}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 bg-gray-700 text-white rounded-md"
                    placeholder="Enter Username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={localUser.fullName}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 bg-gray-700 text-white rounded-md"
                    placeholder="Enter Full Name"
                  />
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-white mb-1">
                  {localUser.fullName}
                </h2>
                <p className="text-gray-400 mb-4">{localUser.userName}</p>
                <button
                  onClick={handleEditToggle}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>

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
      </div>
    </main>
  );
};

export default ProfileEdit;
