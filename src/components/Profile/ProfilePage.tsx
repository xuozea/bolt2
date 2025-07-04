import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, User, Mail, Phone, MapPin, Edit2, Save, X, Bell, Shield, Globe, 
  Calendar, Star, Award, TrendingUp, Clock, CreditCard, Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import { useQueue } from '../../contexts/QueueContext';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { permission, requestPermission } = useNotifications();
  const { userAppointments } = useQueue();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    bio: '',
    dateOfBirth: '',
    preferences: {
      notifications: permission === 'granted',
      emailUpdates: true,
      smsUpdates: false,
      language: 'en',
      theme: 'auto'
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'profile', label: 'Profile', icon: Edit2 },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings }
  ];

  const stats = [
    {
      label: 'Total Appointments',
      value: userAppointments.length,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      label: 'Completed',
      value: userAppointments.filter(a => a.status === 'completed').length,
      icon: Award,
      color: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      label: 'Average Rating',
      value: '4.8',
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      change: '+0.2'
    },
    {
      label: 'Time Saved',
      value: `${userAppointments.length * 25}m`,
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      change: '+45m'
    }
  ];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = async () => {
    if (permission === 'granted') {
      setProfileData(prev => ({
        ...prev,
        preferences: { ...prev.preferences, notifications: false }
      }));
      toast.success('Notifications disabled');
    } else {
      const token = await requestPermission();
      if (token) {
        setProfileData(prev => ({
          ...prev,
          preferences: { ...prev.preferences, notifications: true }
        }));
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="apple-glass-card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm text-green-600 font-medium">
                        {stat.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {stat.value}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="apple-glass-card p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Recent Activity
              </h3>
              <div className="space-y-4">
                {userAppointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {appointment.service} at {appointment.businessName}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {format(appointment.appointmentDate.toDate(), 'MMM dd, yyyy • HH:mm')}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="apple-glass-card p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent-primary)' }} />
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Book Appointment
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Find and book your next service
                </p>
                <button className="apple-button w-full">
                  Browse Services
                </button>
              </div>

              <div className="apple-glass-card p-6 text-center">
                <Bell className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent-primary)' }} />
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Notifications
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Manage your notification preferences
                </p>
                <button 
                  onClick={() => setActiveTab('notifications')}
                  className="apple-button-secondary w-full"
                >
                  Settings
                </button>
              </div>

              <div className="apple-glass-card p-6 text-center">
                <CreditCard className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent-primary)' }} />
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Payment Methods
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Manage your payment options
                </p>
                <button className="apple-button-secondary w-full">
                  Add Card
                </button>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                        style={{ color: 'var(--text-tertiary)' }} />
                  <input
                    type="text"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                    disabled={!editing}
                    className="apple-input w-full pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                        style={{ color: 'var(--text-tertiary)' }} />
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="apple-input w-full pl-10 opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                         style={{ color: 'var(--text-tertiary)' }} />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!editing}
                    className="apple-input w-full pl-10"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                  disabled={!editing}
                  className="apple-input w-full"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                          style={{ color: 'var(--text-tertiary)' }} />
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    disabled={!editing}
                    className="apple-input w-full pl-10"
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                disabled={!editing}
                className="apple-input w-full"
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Your Appointments
              </h3>
              <select className="apple-input">
                <option>All Appointments</option>
                <option>Upcoming</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>

            <div className="space-y-4">
              {userAppointments.map((appointment) => (
                <div key={appointment.id} className="apple-glass-card p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {appointment.service}
                        </h4>
                        <p style={{ color: 'var(--text-secondary)' }}>
                          {appointment.businessName}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          <span>{format(appointment.appointmentDate.toDate(), 'MMM dd, yyyy')}</span>
                          <span>{format(appointment.appointmentDate.toDate(), 'HH:mm')}</span>
                          <span>Queue: #{appointment.queuePosition}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </div>
                      <button className="apple-button-secondary text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="apple-glass-card p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Push Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      Queue Updates
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Get notified when your queue position changes
                    </div>
                  </div>
                  <button
                    onClick={handleNotificationToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      profileData.preferences.notifications
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                        : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profileData.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      Email Updates
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Receive appointment confirmations via email
                    </div>
                  </div>
                  <button
                    onClick={() => setProfileData(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, emailUpdates: !prev.preferences.emailUpdates }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      profileData.preferences.emailUpdates
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                        : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profileData.preferences.emailUpdates ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="apple-glass-card p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Privacy Settings
              </h3>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Location Data
                  </div>
                  <div className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                    We use your location to find nearby businesses. This data is not stored permanently.
                  </div>
                  <button className="apple-button-secondary text-sm">
                    Manage Location Settings
                  </button>
                </div>

                <div className="p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Data Export
                  </div>
                  <div className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                    Download a copy of your data including appointments and preferences.
                  </div>
                  <button className="apple-button-secondary text-sm">
                    Download My Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="apple-glass-card p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                App Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Language
                  </label>
                  <select
                    value={profileData.preferences.language}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, language: e.target.value }
                    }))}
                    className="apple-input w-full"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="ta">Tamil</option>
                    <option value="te">Telugu</option>
                    <option value="bn">Bengali</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Theme
                  </label>
                  <select
                    value={profileData.preferences.theme}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, theme: e.target.value }
                    }))}
                    className="apple-input w-full"
                  >
                    <option value="auto">Auto (System)</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="apple-glass-card overflow-hidden"
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
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                    Member since {new Date(currentUser?.metadata.creationTime || '').getFullYear()}
                  </span>
                  {permission === 'granted' && (
                    <span className="text-sm bg-green-500/20 px-2 py-1 rounded-full flex items-center">
                      <Bell className="w-3 h-3 mr-1" />
                      Notifications On
                    </span>
                  )}
                </div>
              </div>
            </div>
            {activeTab === 'profile' && (
              <button
                onClick={() => editing ? setEditing(false) : setEditing(true)}
                className="bg-white/20 backdrop-blur-lg text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                {editing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b" style={{ borderColor: 'var(--border-color)' }}>
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500'
                      : 'border-transparent hover:text-blue-600'
                  }`}
                  style={{ 
                    color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)' 
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}

          {editing && activeTab === 'profile' && (
            <div className="mt-6 flex justify-end">
              <motion.button
                onClick={handleSaveProfile}
                disabled={loading}
                className="apple-button flex items-center space-x-2"
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