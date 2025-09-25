import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { geolocationService, GeolocationResult, LocationPermissionStatus } from '@/utils/geolocation';

interface LocationContextType {
  currentLocation: GeolocationResult | null;
  permissionStatus: LocationPermissionStatus | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  clearLocation: () => void;
  setCustomLocation: (location: string) => void;
  getDisplayLocation: () => string;
  getSearchLocation: () => string;
  hasLocationPermission: boolean;
  showLocationPrompt: boolean;
  dismissLocationPrompt: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<GeolocationResult | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [locationPromptDismissed, setLocationPromptDismissed] = useState(false);

  useEffect(() => {
    // Check if location prompt was previously dismissed
    const dismissed = localStorage.getItem('locationPromptDismissed');
    setLocationPromptDismissed(dismissed === 'true');

    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check permission status
      const permission = await geolocationService.checkLocationPermission();
      setPermissionStatus(permission);

      // If permission is granted, try to get current location
      if (permission.canUseLocation) {
        try {
          const location = await geolocationService.requestLocation();
          setCurrentLocation(location);
          setShowLocationPrompt(false);
        } catch (locationError) {
          console.warn('Failed to get GPS location, trying IP fallback:', locationError);
          
          // Try IP-based location as fallback
          try {
            const ipLocation = await geolocationService.getLocationFromIP();
            setCurrentLocation(ipLocation);
          } catch (ipError) {
            console.warn('IP location also failed:', ipError);
            setError('Unable to determine your location');
          }
        }
      } else if (permission.permission === 'prompt' && !locationPromptDismissed) {
        // Show location permission prompt
        setShowLocationPrompt(true);
        
        // Get IP location as fallback while waiting for user decision
        try {
          const ipLocation = await geolocationService.getLocationFromIP();
          setCurrentLocation(ipLocation);
        } catch (ipError) {
          console.warn('IP location failed:', ipError);
        }
      } else {
        // Permission denied or unavailable, use IP location
        try {
          const ipLocation = await geolocationService.getLocationFromIP();
          setCurrentLocation(ipLocation);
        } catch (ipError) {
          setError('Unable to determine your location');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Location initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  const requestLocation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setShowLocationPrompt(false);

      const location = await geolocationService.requestLocation();
      setCurrentLocation(location);

      // Update permission status
      const permission = await geolocationService.checkLocationPermission();
      setPermissionStatus(permission);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);

      // If GPS fails, try IP location as fallback
      if (errorMessage.includes('denied')) {
        try {
          const ipLocation = await geolocationService.getLocationFromIP();
          setCurrentLocation(ipLocation);
          setError('Using approximate location based on your internet connection');
        } catch (ipError) {
          setError('Unable to determine your location');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearLocation = () => {
    geolocationService.clearLocation();
    setCurrentLocation(null);
    setPermissionStatus(null);
    setError(null);
  };

  const setCustomLocation = (location: string) => {
    // Create a custom location result when user manually sets location
    const customLocation: GeolocationResult = {
      latitude: 0,
      longitude: 0,
      address: location,
      city: location.includes(',') ? location.split(',')[0].trim() : location,
      country: 'Thailand'
    };
    setCurrentLocation(customLocation);
    setError(null);
  };

  const dismissLocationPrompt = () => {
    setShowLocationPrompt(false);
    setLocationPromptDismissed(true);
    localStorage.setItem('locationPromptDismissed', 'true');
  };

  const getDisplayLocation = (): string => {
    if (currentLocation) {
      return geolocationService.getDisplayLocation();
    }
    return 'Location not set';
  };

  const getSearchLocation = (): string => {
    if (currentLocation) {
      return geolocationService.getSearchLocation();
    }
    return '';
  };

  const hasLocationPermission = permissionStatus?.canUseLocation || false;

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        permissionStatus,
        isLoading,
        error,
        requestLocation,
        clearLocation,
        setCustomLocation,
        getDisplayLocation,
        getSearchLocation,
        hasLocationPermission,
        showLocationPrompt,
        dismissLocationPrompt,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};