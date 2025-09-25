export interface LocationSuggestion {
  name: string;
  type: 'district' | 'city' | 'station';
  province: string;
}

// Thailand location suggestions data
export const THAILAND_LOCATIONS: LocationSuggestion[] = [
  // Major Regions/Cities (Priority 1)
  { name: "Bangkok", type: "city" as const, province: "Bangkok" },
  { name: "Chiang Mai", type: "city" as const, province: "Chiang Mai" },
  { name: "Chiang Rai", type: "city" as const, province: "Chiang Rai" },
  { name: "Phuket", type: "city" as const, province: "Phuket" },
  { name: "Pattaya", type: "city" as const, province: "Chonburi" },
  { name: "Hua Hin", type: "city" as const, province: "Prachuap Khiri Khan" },
  { name: "Koh Samui", type: "city" as const, province: "Surat Thani" },
  { name: "Rayong", type: "city" as const, province: "Rayong" },
  { name: "Nakhon Ratchasima", type: "city" as const, province: "Nakhon Ratchasima" },
  { name: "Hat Yai", type: "city" as const, province: "Songkhla" },
  
  // Bangkok Districts (Priority 2)
  { name: "Sukhumvit, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Silom, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Sathorn, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Thong Lo, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Ekkamai, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Phrom Phong, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Asok, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Chitlom, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Ploenchit, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Ratchadamri, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Siam, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Rama 9, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Lat Phrao, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Chatuchak, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Huai Khwang, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Dindaeng, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Ratchathewi, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Phaya Thai, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Bangrak, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Khlong Toei, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Watthana, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Vadhana, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Bang Na, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Suan Luang, Bangkok", type: "district" as const, province: "Bangkok" },
  { name: "Prawet, Bangkok", type: "district" as const, province: "Bangkok" },
  
  // BTS/MRT Station Areas
  { name: "Nana, Bangkok", type: "station" as const, province: "Bangkok" },
  { name: "Asok, Bangkok", type: "station" as const, province: "Bangkok" },
  { name: "Phrom Phong, Bangkok", type: "station" as const, province: "Bangkok" },
  { name: "Thong Lo, Bangkok", type: "station" as const, province: "Bangkok" },
  { name: "Ekkamai, Bangkok", type: "station" as const, province: "Bangkok" },
  { name: "Phra Khanong, Bangkok", type: "station" as const, province: "Bangkok" },
  { name: "On Nut, Bangkok", type: "station" as const, province: "Bangkok" },
  { name: "Bang Chak, Bangkok", type: "station" as const, province: "Bangkok" },
  { name: "Punnawithi, Bangkok", type: "station" as const, province: "Bangkok" },
  { name: "Udom Suk, Bangkok", type: "station" as const, province: "Bangkok" },
  { name: "Bang Na, Bangkok", type: "station" as const, province: "Bangkok" },
  { name: "Victory Monument, Bangkok", type: "station" as const, province: "Bangkok" },
  { name: "Saphan Phut, Bangkok", type: "station" as const, province: "Bangkok" },
  { name: "Mo Chit, Bangkok", type: "station" as const, province: "Bangkok" },
  { name: "Ari, Bangkok", type: "station" as const, province: "Bangkok" },
  { name: "Sanam Pao, Bangkok", type: "station" as const, province: "Bangkok" },
];

export interface LocationSuggestion {
  name: string;
  type: 'district' | 'city' | 'station';
  province: string;
}

export const searchLocationSuggestions = (query: string): LocationSuggestion[] => {
  // If no query or very short query, show major regions first
  if (!query || query.length < 2) {
    return THAILAND_LOCATIONS.filter(location => location.type === 'city').slice(0, 8);
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  // Filter matching locations
  const matches = THAILAND_LOCATIONS.filter(location => 
    location.name.toLowerCase().includes(normalizedQuery) ||
    location.province.toLowerCase().includes(normalizedQuery)
  );
  
  // Sort by priority: cities first, then districts, then stations
  const prioritized = matches.sort((a, b) => {
    const typeOrder = { city: 0, district: 1, station: 2 };
    const aPriority = typeOrder[a.type];
    const bPriority = typeOrder[b.type];
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    // If same type, sort alphabetically
    return a.name.localeCompare(b.name);
  });
  
  return prioritized.slice(0, 8); // Limit to 8 suggestions
};

// Get user's current location (Bangkok as fallback for Thailand)
export const getCurrentLocationName = async (): Promise<string> => {
  return new Promise((resolve) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would reverse geocode the coordinates
          // For now, we'll return Bangkok as the default for Thailand
          resolve("Bangkok");
        },
        () => {
          // Fallback to Bangkok if geolocation fails
          resolve("Bangkok");
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    } else {
      resolve("Bangkok");
    }
  });
};

export const detectLocationFromIP = async (): Promise<string> => {
  try {
    // In a real app, you might use a geolocation API
    // For now, return Bangkok as the default Thai location
    return "Bangkok";
  } catch (error) {
    return "Bangkok";
  }
};