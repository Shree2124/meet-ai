
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
  const { user }: any = useSelector((state: RootState) => state.auth);
  


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
      <div className="flex flex-1 justify-center items-center p-6">
        <div className="relative bg-blueAccent-1001 shadow-lg p-10 rounded-xl w-full max-w-lg text-center">
          {/* Profile Image */}
          <div className="-top-20 left-1/2 absolute -translate-x-1/2 transform">
            <label htmlFor="avatar-upload" className={`relative ${isEditing ? 'cursor-pointer' : ''}`}>
              <div
                className="bg-cover bg-center shadow-lg border-4 border-white rounded-full w-40 h-40"
                style={{
                  backgroundImage: localUser?.avatar ? `url(${localUser?.avatar})` : 'https://www.w3schools.com/howto/img_avatar.png',
                  backgroundColor: localUser?.avatar ? 'transparent' : 'gray', // For debugging
                }}
              >
                {isEditing && (
                  <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-full">
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

          <div className="space-y-4 mt-24">
            {isEditing ? (
              <>
                <div>
                  <label className="block font-medium text-white text-sm">Username</label>
                  <input
                    type="text"
                    name="userName"
                    value={localUser.userName}
                    onChange={handleChange}
                    className="bg-gray-700 mt-1 p-3 rounded-md w-full text-white"
                    placeholder="Enter Username"
                  />
                </div>
                <div>
                  <label className="block font-medium text-white text-sm">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={localUser.fullName}
                    onChange={handleChange}
                    className="bg-gray-700 mt-1 p-3 rounded-md w-full text-white"
                    placeholder="Enter Full Name"
                  />
                </div>
              </>
            ) : (
              <>
                <h2 className="mb-1 font-bold text-white text-3xl">
                  {localUser.fullName}
                </h2>
                <p className="mb-4 text-gray-400">{localUser.userName}</p>
                <button
                  onClick={handleEditToggle}
                  className="bg-blue-600 hover:bg-blue-700 mt-6 px-6 py-2 rounded-full font-bold text-white transition-colors"
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
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full text-white"
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
