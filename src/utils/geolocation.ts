export interface GeolocationResult {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  district?: string;
  country: string;
  accuracy?: number;
}

export interface LocationPermissionStatus {
  permission: 'granted' | 'denied' | 'prompt' | 'unavailable';
  canUseLocation: boolean;
  error?: string;
}

class GeolocationService {
  private static instance: GeolocationService;
  private permissionStatus: LocationPermissionStatus | null = null;
  private currentLocation: GeolocationResult | null = null;

  private constructor() {}

  static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService();
    }
    return GeolocationService.instance;
  }

  /**
   * Check if geolocation is supported and permission status
   */
  async checkLocationPermission(): Promise<LocationPermissionStatus> {
    if (!('geolocation' in navigator)) {
      this.permissionStatus = {
        permission: 'unavailable',
        canUseLocation: false,
        error: 'Geolocation is not supported by this browser'
      };
      return this.permissionStatus;
    }

    try {
      // Check current permission status
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      
      this.permissionStatus = {
        permission: permission.state,
        canUseLocation: permission.state === 'granted',
        error: permission.state === 'denied' ? 'Location permission denied' : undefined
      };

      return this.permissionStatus;
    } catch (error) {
      // Fallback for browsers that don't support permissions API
      this.permissionStatus = {
        permission: 'prompt',
        canUseLocation: true,
        error: undefined
      };
      return this.permissionStatus;
    }
  }

  /**
   * Request location permission and get current position
   */
  async requestLocation(): Promise<GeolocationResult> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // Cache for 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude, accuracy } = position.coords;
            const address = await this.reverseGeocode(latitude, longitude);
            
            const result: GeolocationResult = {
              latitude,
              longitude,
              accuracy,
              ...address
            };

            this.currentLocation = result;
            resolve(result);
          } catch (error) {
            // If reverse geocoding fails, still provide basic location info
            const fallbackResult: GeolocationResult = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              address: 'Unknown Location',
              city: 'Bangkok', // Default to Bangkok for Thailand-focused app
              country: 'Thailand'
            };
            
            this.currentLocation = fallbackResult;
            resolve(fallbackResult);
          }
        },
        (error) => {
          let errorMessage = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  /**
   * Reverse geocode coordinates to address using multiple services
   */
  private async reverseGeocode(latitude: number, longitude: number): Promise<{
    address: string;
    city: string;
    district?: string;
    country: string;
  }> {
    // Try multiple reverse geocoding services for reliability
    const services = [
      () => this.reverseGeocodeNominatim(latitude, longitude),
      () => this.reverseGeocodeOpenCage(latitude, longitude),
      () => this.reverseGeocodeMapBox(latitude, longitude)
    ];

    for (const service of services) {
      try {
        const result = await service();
        if (result) return result;
      } catch (error) {
        console.warn('Reverse geocoding service failed:', error);
        continue;
      }
    }

    // Fallback if all services fail
    return {
      address: `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
      city: 'Bangkok',
      country: 'Thailand'
    };
  }

  /**
   * Nominatim (OpenStreetMap) reverse geocoding - free service
   */
  private async reverseGeocodeNominatim(latitude: number, longitude: number) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en`,
        {
          headers: {
            'User-Agent': 'MMHub Property Search App'
          }
        }
      );

      if (!response.ok) throw new Error('Nominatim request failed');

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      const address = data.address || {};
      const displayName = data.display_name || '';

      return {
        address: displayName,
        city: address.city || address.town || address.village || address.suburb || 'Unknown City',
        district: address.suburb || address.neighbourhood || address.quarter,
        country: address.country || 'Thailand'
      };
    } catch (error) {
      console.warn('Nominatim reverse geocoding failed:', error);
      throw error;
    }
  }

  /**
   * OpenCage reverse geocoding - has free tier
   */
  private async reverseGeocodeOpenCage(latitude: number, longitude: number) {
    // Note: You would need to add your OpenCage API key as an environment variable
    const apiKey = process.env.VITE_OPENCAGE_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenCage API key not configured');
    }

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=en&pretty=1`
      );

      if (!response.ok) throw new Error('OpenCage request failed');

      const data = await response.json();
      
      if (data.status.code !== 200) throw new Error(data.status.message);

      const result = data.results[0];
      if (!result) throw new Error('No results found');

      const components = result.components;
      
      return {
        address: result.formatted,
        city: components.city || components.town || components.village || components.suburb || 'Unknown City',
        district: components.suburb || components.neighbourhood || components.quarter,
        country: components.country || 'Thailand'
      };
    } catch (error) {
      console.warn('OpenCage reverse geocoding failed:', error);
      throw error;
    }
  }

  /**
   * MapBox reverse geocoding
   */
  private async reverseGeocodeMapBox(latitude: number, longitude: number) {
    const apiKey = process.env.VITE_MAPBOX_API_KEY;
    
    if (!apiKey) {
      throw new Error('MapBox API key not configured');
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${apiKey}&language=en`
      );

      if (!response.ok) throw new Error('MapBox request failed');

      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        throw new Error('No results found');
      }

      const result = data.features[0];
      const context = result.context || [];
      
      const city = context.find((c: any) => c.id.includes('place'))?.text || 'Unknown City';
      const district = context.find((c: any) => c.id.includes('neighborhood'))?.text;
      const country = context.find((c: any) => c.id.includes('country'))?.text || 'Thailand';

      return {
        address: result.place_name,
        city,
        district,
        country
      };
    } catch (error) {
      console.warn('MapBox reverse geocoding failed:', error);
      throw error;
    }
  }

  /**
   * Get location using IP-based service as fallback
   */
  async getLocationFromIP(): Promise<GeolocationResult> {
    try {
      // Using ipapi.co service (free tier available)
      const response = await fetch('https://ipapi.co/json/');
      
      if (!response.ok) throw new Error('IP location service failed');

      const data = await response.json();
      
      if (data.error) throw new Error(data.reason || 'IP location failed');

      const result: GeolocationResult = {
        latitude: data.latitude || 13.7563,
        longitude: data.longitude || 100.5018,
        address: `${data.city || 'Bangkok'}, ${data.region || ''}, ${data.country_name || 'Thailand'}`,
        city: data.city || 'Bangkok',
        district: data.region,
        country: data.country_name || 'Thailand'
      };

      this.currentLocation = result;
      return result;
    } catch (error) {
      console.warn('IP-based location failed:', error);
      
      // Ultimate fallback to Bangkok coordinates
      const fallback: GeolocationResult = {
        latitude: 13.7563,
        longitude: 100.5018,
        address: 'Bangkok, Thailand',
        city: 'Bangkok',
        country: 'Thailand'
      };

      this.currentLocation = fallback;
      return fallback;
    }
  }

  /**
   * Get current stored location
   */
  getCurrentLocation(): GeolocationResult | null {
    return this.currentLocation;
  }

  /**
   * Clear stored location
   */
  clearLocation(): void {
    this.currentLocation = null;
    this.permissionStatus = null;
  }

  /**
   * Get user-friendly location string for display
   */
  getDisplayLocation(): string {
    if (!this.currentLocation) return 'Location not set';
    
    const { city, district, country } = this.currentLocation;
    
    if (district) {
      return `${district}, ${city}, ${country}`;
    }
    return `${city}, ${country}`;
  }

  /**
   * Format location for search/filtering purposes
   */
  getSearchLocation(): string {
    if (!this.currentLocation) return '';
    
    const { city, district } = this.currentLocation;
    
    if (district) {
      return `${district}, ${city}`;
    }
    return city;
  }
}

export const geolocationService = GeolocationService.getInstance();