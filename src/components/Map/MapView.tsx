import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Zap } from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation';

interface Business {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude?: number;
  longitude?: number;
  rating: number;
  currentQueue: number;
}

interface MapViewProps {
  businesses: Business[];
}

const MapView: React.FC<MapViewProps> = ({ businesses }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const { location, requestLocation, loading } = useGeolocation();

  // Mock coordinates for Delhi area if businesses don't have coordinates
  const mockCoordinates = [
    { lat: 28.6139, lng: 77.2090 },
    { lat: 28.6129, lng: 77.2295 },
    { lat: 28.6169, lng: 77.2090 },
    { lat: 28.6109, lng: 77.2295 },
    { lat: 28.6149, lng: 77.2090 },
    { lat: 28.6179, lng: 77.2295 },
  ];

  const businessesWithCoords = businesses.map((business, index) => ({
    ...business,
    latitude: business.latitude || mockCoordinates[index % mockCoordinates.length].lat,
    longitude: business.longitude || mockCoordinates[index % mockCoordinates.length].lng,
  }));

  useEffect(() => {
    // Initialize map (using a simple implementation)
    // In a real app, you'd use Google Maps, Mapbox, or OpenStreetMap
    if (mapRef.current) {
      // Map initialization would go here
    }
  }, []);

  const handleLocationRequest = async () => {
    await requestLocation();
  };

  return (
    <div className="apple-glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Business Locations
        </h3>
        <button
          onClick={handleLocationRequest}
          disabled={loading}
          className="apple-button-secondary flex items-center space-x-2"
        >
          <Navigation className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>My Location</span>
        </button>
      </div>

      <div className="relative">
        {/* Map Container */}
        <div
          ref={mapRef}
          className="w-full h-80 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 to-green-900 rounded-lg relative overflow-hidden"
        >
          {/* Mock Map Background */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Mock roads */}
              <path d="M0,150 L400,150" stroke="currentColor" strokeWidth="2" />
              <path d="M200,0 L200,300" stroke="currentColor" strokeWidth="2" />
              <path d="M0,100 L400,100" stroke="currentColor" strokeWidth="1" />
              <path d="M0,200 L400,200" stroke="currentColor" strokeWidth="1" />
              <path d="M100,0 L100,300" stroke="currentColor" strokeWidth="1" />
              <path d="M300,0 L300,300" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          {/* User Location */}
          {location && (
            <div
              className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
              style={{
                left: '50%',
                top: '50%',
              }}
            >
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping"></div>
            </div>
          )}

          {/* Business Markers */}
          {businessesWithCoords.map((business, index) => {
            const x = 20 + (index % 4) * 90;
            const y = 40 + Math.floor(index / 4) * 80;
            
            return (
              <motion.div
                key={business.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => setSelectedBusiness(business)}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  {business.currentQueue > 0 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                      {business.currentQueue}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Business Info Popup */}
        {selectedBusiness && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 apple-glass-card p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {selectedBusiness.name}
                </h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {selectedBusiness.address}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm flex items-center">
                    ⭐ {selectedBusiness.rating}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {selectedBusiness.currentQueue} in queue
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBusiness(null)}
                className="apple-button-secondary text-sm"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Your Location</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Businesses</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span>Queue Count</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="apple-glass-card p-3">
          <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {businesses.length}
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Total Businesses
          </div>
        </div>
        <div className="apple-glass-card p-3">
          <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {businesses.reduce((sum, b) => sum + b.currentQueue, 0)}
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            People in Queues
          </div>
        </div>
        <div className="apple-glass-card p-3">
          <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {(businesses.reduce((sum, b) => sum + b.rating, 0) / businesses.length).toFixed(1)}
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Avg Rating
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;