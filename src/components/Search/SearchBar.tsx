import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueue } from '../../contexts/QueueContext';
import { useGeolocation } from '../../hooks/useGeolocation';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchType, setSearchType] = useState<'nearby' | 'state'>('nearby');
  const [selectedState, setSelectedState] = useState('');
  const { businesses } = useQueue();
  const { location, requestLocation, loading: locationLoading } = useGeolocation();
  const searchRef = useRef<HTMLDivElement>(null);

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.services.some(service => 
                           service.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    if (searchType === 'state' && selectedState) {
      // In a real app, you'd filter by business location/state
      return matchesSearch;
    }
    
    return matchesSearch;
  });

  const filteredStates = indianStates.filter(state =>
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationRequest = async () => {
    await requestLocation();
    setSearchType('nearby');
  };

  const handleBusinessSelect = (business: any) => {
    setSearchTerm(business.name);
    setShowSuggestions(false);
    // Navigate to business or show details
  };

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setSearchTerm(state);
    setShowSuggestions(false);
    setSearchType('state');
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="flex space-x-2">
        {/* Search Type Toggle */}
        <div className="flex apple-glass-card rounded-lg p-1">
          <button
            onClick={() => setSearchType('nearby')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              searchType === 'nearby'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Navigation className="w-4 h-4 inline mr-1" />
            Nearby
          </button>
          <button
            onClick={() => setSearchType('state')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              searchType === 'state'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-1" />
            State
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                   style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="apple-input w-full pl-10 pr-12"
              placeholder={
                searchType === 'nearby' 
                  ? "Search businesses near you..." 
                  : "Search by state or business..."
              }
            />
            
            {/* Location Button for Nearby Search */}
            {searchType === 'nearby' && (
              <button
                onClick={handleLocationRequest}
                disabled={locationLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-blue-100 transition-colors"
                title="Get current location"
              >
                <Navigation 
                  className={`w-4 h-4 ${locationLoading ? 'animate-spin' : ''}`}
                  style={{ color: location ? 'var(--accent-primary)' : 'var(--text-tertiary)' }}
                />
              </button>
            )}
          </div>

          {/* Search Suggestions */}
          <AnimatePresence>
            {showSuggestions && searchTerm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="search-suggestions"
              >
                {searchType === 'nearby' ? (
                  <>
                    {location && (
                      <div className="p-3 border-b" style={{ borderColor: 'var(--glass-border)' }}>
                        <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <Navigation className="w-4 h-4" />
                          <span>
                            Current location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {filteredBusinesses.slice(0, 5).map((business) => (
                      <div
                        key={business.id}
                        onClick={() => handleBusinessSelect(business)}
                        className="search-suggestion-item"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {business.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                              {business.name}
                            </div>
                            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {business.type} • {business.address}
                            </div>
                          </div>
                          <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            {business.currentQueue} in queue
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {/* State Suggestions */}
                    {filteredStates.slice(0, 5).map((state) => (
                      <div
                        key={state}
                        onClick={() => handleStateSelect(state)}
                        className="search-suggestion-item"
                      >
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                          <span style={{ color: 'var(--text-primary)' }}>{state}</span>
                        </div>
                      </div>
                    ))}
                    
                    {/* Business Suggestions */}
                    {filteredBusinesses.slice(0, 3).map((business) => (
                      <div
                        key={business.id}
                        onClick={() => handleBusinessSelect(business)}
                        className="search-suggestion-item"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {business.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                              {business.name}
                            </div>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              {business.type} • {business.address}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                
                {filteredBusinesses.length === 0 && filteredStates.length === 0 && (
                  <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                    No results found
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;