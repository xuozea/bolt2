import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface GeolocationState {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      const errorMsg = 'Geolocation is not supported by this browser';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });

      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      setLocation(newLocation);
      toast.success('Location obtained successfully!');
      
      // Store in localStorage for future use
      localStorage.setItem('userLocation', JSON.stringify(newLocation));
      
    } catch (error: any) {
      let errorMsg = 'Failed to get location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMsg = 'Location access denied by user';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg = 'Location information unavailable';
          break;
        case error.TIMEOUT:
          errorMsg = 'Location request timed out';
          break;
        default:
          errorMsg = 'An unknown error occurred';
          break;
      }
      
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Filter businesses within radius
  const filterBusinessesByRadius = useCallback((businesses: any[], radiusKm: number = 5) => {
    if (!location) return businesses;

    return businesses.filter(business => {
      // In a real app, businesses would have lat/lng coordinates
      // For now, we'll use mock coordinates or return all businesses
      if (business.latitude && business.longitude) {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          business.latitude,
          business.longitude
        );
        return distance <= radiusKm;
      }
      return true; // Return all businesses if no coordinates
    });
  }, [location, calculateDistance]);

  return {
    location,
    loading,
    error,
    requestLocation,
    calculateDistance,
    filterBusinessesByRadius
  };
};