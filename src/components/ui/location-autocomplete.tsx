import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { searchLocationSuggestions, type LocationSuggestion } from '@/utils/locationSuggestions';
import { MapPin, Locate, Navigation, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showClearButton?: boolean;
  defaultText?: string;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Enter location in Thailand...",
  className = "",
  showClearButton = true,
  defaultText = "Default (all properties)"
}) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const results = searchLocationSuggestions(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  // Check geolocation permission on component mount
  useEffect(() => {
    const checkLocationPermission = async () => {
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          setHasLocationPermission(permission.state === 'granted');
          
          permission.addEventListener('change', () => {
            setHasLocationPermission(permission.state === 'granted');
          });
        } catch (error) {
          // Permissions API not supported, assume we can ask for permission
          setHasLocationPermission(false);
        }
      } else {
        // Permissions API not supported
        setHasLocationPermission(false);
      }
    };
    
    checkLocationPermission();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setHighlightedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    onChange(suggestion.name);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
            handleSuggestionClick(suggestions[highlightedIndex]);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setHighlightedIndex(-1);
          break;
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }, 200);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (value.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else if (value.length < 2) {
      // Show major regions when clicking in empty or short input
      const majorRegions = searchLocationSuggestions('');
      setSuggestions(majorRegions);
      setShowSuggestions(majorRegions.length > 0);
    }
  };

  const handleCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      if ('geolocation' in navigator) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 300000 // Cache for 5 minutes
            }
          );
        });

        // Use reverse geocoding to get a readable location name
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'MMHub Property Search App'
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data && !data.error) {
              const address = data.address || {};
              const city = address.city || address.town || address.village || address.suburb || 'Bangkok';
              const district = address.suburb || address.neighbourhood || address.quarter;
              
              let locationName = city;
              if (district && district !== city) {
                locationName = `${district}, ${city}`;
              }
              
              onChange(locationName);
              setHasLocationPermission(true);
            } else {
              throw new Error('Geocoding failed');
            }
          } else {
            throw new Error('Geocoding service unavailable');
          }
        } catch (geocodeError) {
          console.warn('Reverse geocoding failed:', geocodeError);
          // Fallback to Bangkok if reverse geocoding fails
          onChange('Bangkok');
        }
      } else {
        throw new Error('Geolocation not supported');
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      
      let errorMessage = 'Bangkok'; // Default fallback
      
      if (error instanceof GeolocationPositionError || (error as any).code) {
        const code = error instanceof GeolocationPositionError ? error.code : (error as any).code;
        switch (code) {
          case 1: // PERMISSION_DENIED
            setHasLocationPermission(false);
            errorMessage = 'Bangkok'; // Still use Bangkok as fallback
            break;
          case 2: // POSITION_UNAVAILABLE
          case 3: // TIMEOUT
          default:
            errorMessage = 'Bangkok';
            break;
        }
      }
      
      onChange(errorMessage);
    } finally {
      setIsGettingLocation(false);
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    onChange('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const getDisplayValue = () => {
    // When focused, show actual value for editing
    // When not focused and empty, show default text
    if (isFocused) {
      return value;
    }
    return value || defaultText;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'city':
        return '🏙️';
      case 'district':
        return '🏘️';
      case 'station':
        return '🚇';
      default:
        return '📍';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={getDisplayValue()}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={isFocused ? placeholder : ""}
          className={`pl-10 ${showClearButton && value ? 'pr-20' : 'pr-12'} ${className.includes('h-') ? className : `h-10 ${className}`} ${!value && !isFocused ? 'text-muted-foreground' : ''}`}
        />
        
        {/* Clear button */}
        {showClearButton && value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent"
            title="Clear location"
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </Button>
        )}
        
        {/* GPS button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCurrentLocation}
          disabled={isGettingLocation}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent disabled:opacity-50"
          title={
            isGettingLocation
              ? "Getting your location..."
              : hasLocationPermission
              ? "Use your current location"
              : "Click to enable location access"
          }
        >
          {isGettingLocation ? (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : hasLocationPermission ? (
            <Navigation className="w-4 h-4 text-blue-600" />
          ) : (
            <Locate className="w-4 h-4 text-gray-500" />
          )}
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.name}-${index}`}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                index === highlightedIndex
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent/50'
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
                  <div>
                    <div className="font-medium text-foreground">
                      {suggestion.name}
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {suggestion.type} • {suggestion.province}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;