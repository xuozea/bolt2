import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
  });
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    setLoading(true);
    try {
      const imageRef = ref(storage, `profile-images/${currentUser.uid}`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      
      await updateProfile(currentUser, {
        photoURL: downloadURL
      });
      
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      await updateProfile(currentUser, {
        displayName: profileData.displayName
      });
      
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-gray-200/20"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                  disabled={loading}
                >
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">
                  {currentUser?.displayName || 'User Profile'}
                </h1>
                <p className="text-white/80">{currentUser?.email}</p>
              </div>
            </div>
            <button
              onClick={() => editing ? setEditing(false) : setEditing(true)}
              className="bg-white/20 backdrop-blur-lg text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
            >
              {editing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                  disabled={!editing}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!editing}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  disabled={!editing}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter your address"
                />
              </div>
            </div>
          </div>

          {editing && (
            <div className="mt-6 flex justify-end">
              <motion.button
                onClick={handleSaveProfile}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;