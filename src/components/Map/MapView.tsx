import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Navigation, MapPin, Star, Users, Clock } from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom business marker icon
const businessIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="#3B82F6"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      <circle cx="12.5" cy="12.5" r="3" fill="#3B82F6"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// User location marker icon
const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" fill="#10B981" stroke="white" stroke-width="2"/>
      <circle cx="10" cy="10" r="3" fill="white"/>
    </svg>
  `),
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface Business {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude?: number;
  longitude?: number;
  rating: number;
  currentQueue: number;
  averageServiceTime: number;
  services: string[];
}

interface MapViewProps {
  businesses: Business[];
}

// Component to handle map centering
const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
};

const MapView: React.FC<MapViewProps> = ({ businesses }) => {
  const { location, requestLocation, loading } = useGeolocation();
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]); // Delhi default

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
    if (location) {
      setMapCenter([location.latitude, location.longitude]);
    }
  }, [location]);

  const handleLocationRequest = async () => {
    await requestLocation();
  };

  const getQueueColor = (queueCount: number) => {
    if (queueCount === 0) return 'text-green-600';
    if (queueCount <= 2) return 'text-yellow-600';
    if (queueCount <= 5) return 'text-orange-600';
    return 'text-red-600';
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
        <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <MapController center={mapCenter} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* User Location Marker */}
            {location && (
              <Marker
                position={[location.latitude, location.longitude]}
                icon={userIcon}
              >
                <Popup>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">Your Location</div>
                    <div className="text-sm text-gray-600">
                      Lat: {location.latitude.toFixed(4)}<br />
                      Lng: {location.longitude.toFixed(4)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Business Markers */}
            {businessesWithCoords.map((business) => (
              <Marker
                key={business.id}
                position={[business.latitude!, business.longitude!]}
                icon={businessIcon}
              >
                <Popup maxWidth={300} className="custom-popup">
                  <div className="p-2">
                    <div className="font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                      {business.name}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{business.address}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">{business.rating}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className={`font-medium ${getQueueColor(business.currentQueue)}`}>
                          {business.currentQueue} in queue
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span className="text-gray-600">
                          ~{business.averageServiceTime} min service
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {business.services.slice(0, 3).map((service, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                      {business.services.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{business.services.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Your Location</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Businesses</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>High Queue</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="apple-glass-card p-3"
        >
          <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {businesses.length}
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Total Businesses
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="apple-glass-card p-3"
        >
          <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {businesses.reduce((sum, b) => sum + b.currentQueue, 0)}
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            People in Queues
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="apple-glass-card p-3"
        >
          <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {businesses.length > 0 ? (businesses.reduce((sum, b) => sum + b.rating, 0) / businesses.length).toFixed(1) : '0'}
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Avg Rating
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MapView;