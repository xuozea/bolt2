import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, MapPin, Clock, Users, MessageCircle, Navigation } from 'lucide-react';
import { useQueue } from '../../contexts/QueueContext';
import { Link } from 'react-router-dom';
import ChatWindow from '../Chat/ChatWindow';
import MapView from '../Map/MapView';

const BusinessList: React.FC = () => {
  const { businesses, loading } = useQueue();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showChat, setShowChat] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<{ id: string; name: string } | null>(null);
  const [showMap, setShowMap] = useState(false);

  const businessTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'salon', label: 'Salon' },
    { value: 'spa', label: 'Spa' },
    { value: 'tattoo', label: 'Tattoo' },
    { value: 'barber', label: 'Barber' },
    { value: 'other', label: 'Other' }
  ];

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || business.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleChatOpen = (businessId: string, businessName: string) => {
    setSelectedBusiness({ id: businessId, name: businessName });
    setShowChat(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Find Your Perfect Service
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Discover top-rated businesses in your area
        </p>
      </motion.div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                 style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search businesses or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="apple-input w-full pl-10"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                 style={{ color: 'var(--text-tertiary)' }} />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="apple-input pl-10 pr-8 min-w-[150px]"
          >
            {businessTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowMap(!showMap)}
          className={`apple-button-secondary flex items-center space-x-2 ${showMap ? 'bg-blue-100' : ''}`}
        >
          <Navigation className="w-4 h-4" />
          <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
        </button>
      </div>

      {/* Map View */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 400 }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <MapView businesses={filteredBusinesses} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Business Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map((business, index) => (
          <motion.div
            key={business.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="apple-glass-card overflow-hidden hover:shadow-xl transition-all duration-200"
          >
            <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
              <img
                src={business.image}
                alt={business.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-1">{business.name}</h3>
                <p className="text-white/80 capitalize">{business.type}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {business.rating}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Users className="w-4 h-4" />
                  <span>{business.currentQueue} in queue</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin className="w-4 h-4" />
                  <span>{business.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Clock className="w-4 h-4" />
                  <span>Avg. {business.averageServiceTime} min service</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {business.services.slice(0, 3).map((service, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                  >
                    {service}
                  </span>
                ))}
                {business.services.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                    +{business.services.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                <Link
                  to={`/book/${business.id}`}
                  className="flex-1 apple-button text-center"
                >
                  Book Appointment
                </Link>
                <button
                  onClick={() => handleChatOpen(business.id, business.name)}
                  className="apple-button-secondary p-3"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBusinesses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            No businesses found
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {showChat && selectedBusiness && (
          <ChatWindow
            businessId={selectedBusiness.id}
            businessName={selectedBusiness.name}
            onClose={() => setShowChat(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BusinessList;