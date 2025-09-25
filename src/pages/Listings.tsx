import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import PropertyCard, { PropertyCardProps } from "@/components/Property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import AdvancedPriceSlider from "@/components/ui/advanced-price-slider";
import LocationAutocomplete from "@/components/ui/location-autocomplete";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<PropertyCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredProperties, setFilteredProperties] = useState<PropertyCardProps[]>([]);
  const [filters, setFilters] = useState({
    location: "",
    bedrooms: "",
    maxRent: "",
    priceRange: [1000, 50000] as [number, number], // Show all properties by default
    propertyType: "",
    amenities: [] as string[], // Add amenities filter
  });
  const [showFilters, setShowFilters] = useState(false);
  const [locationCleared, setLocationCleared] = useState(false);
  const { user } = useAuth();
  const { currentLocation, getSearchLocation } = useLocation();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Parse search parameters on component mount
  useEffect(() => {
    const locationParam = searchParams.get('location');
    const bedroomsParam = searchParams.get('bedrooms');
    const maxRentParam = searchParams.get('maxRent');
    
    if (locationParam || bedroomsParam || maxRentParam) {
      setFilters(prev => ({
        ...prev,
        location: locationParam || prev.location,
        bedrooms: bedroomsParam || prev.bedrooms,
        maxRent: maxRentParam || prev.maxRent,
      }));
      // If there's a location parameter, consider it as not cleared
      if (locationParam) {
        setLocationCleared(false);
      }
    } else {
      // No search parameters means default state - allow auto-location
      setLocationCleared(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform data to match PropertyCardProps interface
        const transformedData = data?.map(property => ({
          id: String(property.id), // Ensure id is always a string
          title: property.title,
          monthlyRent: property.price || 0, // Use price column from database
          securityDeposit: property.security_deposit || property.price * 0.1, // Fallback to 10% of rent
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          squareFeet: property.area_sqm ? Math.round(property.area_sqm * 10.764) : undefined, // Convert sqm to sqft
          location: property.location || '',
          imageUrl: (property.images && property.images.length > 0) ? property.images[0] : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
          propertyType: property.property_type || '',
          listedAt: property.created_at || new Date().toISOString(),
          isFavorited: false
        })) || [];

        setProperties(transformedData);
        setFilteredProperties(transformedData);
        
        // Fetch user favorites if logged in
        if (user) {
          const { data: favorites } = await supabase
            .from('user_favorites')
            .select('property_id')
            .eq('user_id', user.id);
          
          if (favorites) {
            const favoriteSet = new Set(favorites.map(f => f.property_id));
            setFavoriteIds(favoriteSet);
            
            // Update properties with favorite status
            const updatedProperties = transformedData.map(property => ({
              ...property,
              isFavorited: favoriteSet.has(property.id)
            }));
            setFilteredProperties(updatedProperties);
          }
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [user]);

  // Auto-set location from geolocation if available and no search params
  useEffect(() => {
    if (!filters.location && !searchParams.get('location') && !locationCleared && currentLocation) {
      const searchLocation = getSearchLocation();
      if (searchLocation) {
        setFilters(prev => ({ ...prev, location: searchLocation }));
      }
    }
  }, [currentLocation, filters.location, searchParams, getSearchLocation, locationCleared]);

  // Apply filters whenever filters or properties change
  useEffect(() => {
    if (!properties.length) return;

    const filtered = properties.filter(property => {
      // Location filter - enhanced matching
      if (filters.location) {
        const searchTerm = filters.location.toLowerCase().trim();
        const propertyLocation = property.location.toLowerCase();
        
        // Remove common suffixes from search term for better matching
        const cleanSearchTerm = searchTerm
          .replace(/, bangkok$/, '')
          .replace(/ bangkok$/, '')
          .replace(/, chiang mai$/, '')
          .replace(/ chiang mai$/, '')
          .replace(/, phuket$/, '')
          .replace(/ phuket$/, '');
        
        // Check if any part of the search term matches the property location
        const searchWords = cleanSearchTerm.split(/[\s,]+/).filter(word => word.length > 0);
        const matchesLocation = searchWords.some(word => 
          propertyLocation.includes(word) || 
          // Also try matching the original search term
          propertyLocation.includes(searchTerm)
        );
        
        if (!matchesLocation) {
          return false;
        }
      }

      // Price range filter
      if (property.monthlyRent < filters.priceRange[0] || property.monthlyRent > filters.priceRange[1]) {
        return false;
      }

      // Bedrooms filter
      if (filters.bedrooms && filters.bedrooms !== "any") {
        const minBedrooms = parseInt(filters.bedrooms);
        if (property.bedrooms < minBedrooms) {
          return false;
        }
      }

      // Property type filter
      if (filters.propertyType && filters.propertyType !== "any" && 
          property.propertyType.toLowerCase() !== filters.propertyType.toLowerCase()) {
        return false;
      }

      // Amenities filter - Enhanced mock data for testing
      if (filters.amenities && filters.amenities.length > 0) {
        // Mock amenities data based on property characteristics
        const mockAmenities: string[] = [];
        
        // Basic amenities that most properties have
        mockAmenities.push('wifi', 'kitchen', 'refrigerator');
        
        // Add amenities based on property type and ID patterns
        if (property.propertyType.toLowerCase().includes('condo') || property.propertyType.toLowerCase().includes('apartment')) {
          mockAmenities.push('air_conditioning');
        }
        
        if (property.propertyType.toLowerCase().includes('house')) {
          mockAmenities.push('parking', 'washing_machine');
        }
        
        // Add amenities based on property ID for variety
        // Ensure id is a string before calling replace
        const idStr = String(property.id || '');
        const idNum = parseInt(idStr.replace(/\D/g, '')) || 0;
        if (idNum % 2 === 0) mockAmenities.push('washing_machine');
        if (idNum % 3 === 0) mockAmenities.push('air_conditioning', 'parking');
        if (idNum % 4 === 0) mockAmenities.push('gym');
        if (idNum % 5 === 0) mockAmenities.push('pool');
        
        // Higher rent properties tend to have more amenities
        if (property.monthlyRent > 25000) {
          mockAmenities.push('gym', 'pool', 'air_conditioning', 'parking');
        } else if (property.monthlyRent > 15000) {
          mockAmenities.push('air_conditioning', 'washing_machine');
        }
        
        // Remove duplicates
        const uniqueAmenities = [...new Set(mockAmenities)];
        
        const hasAllSelectedAmenities = filters.amenities.every(amenity => 
          uniqueAmenities.includes(amenity)
        );
        
        if (!hasAllSelectedAmenities) {
          return false;
        }
      }

      return true;
    });

    // Debug logging during development
    if (filters.amenities && filters.amenities.length > 0) {
      console.log('🔍 Filtering by amenities:', filters.amenities);
      console.log('📊 Properties before filter:', properties.length);
      console.log('✅ Properties after filter:', filtered.length);
      
      // Show a sample of how properties are being filtered
      if (filtered.length > 0) {
        const sampleProperty = filtered[0];
        const sampleAmenities: string[] = [];
        
        // Replicate the same amenity logic used in filtering
        sampleAmenities.push('wifi', 'kitchen', 'refrigerator');
        if (sampleProperty.propertyType.toLowerCase().includes('condo') || sampleProperty.propertyType.toLowerCase().includes('apartment')) {
          sampleAmenities.push('air_conditioning');
        }
        if (sampleProperty.propertyType.toLowerCase().includes('house')) {
          sampleAmenities.push('parking', 'washing_machine');
        }
        // Ensure id is a string before calling replace
        const idStr = String(sampleProperty.id || '');
        const idNum = parseInt(idStr.replace(/\D/g, '')) || 0;
        if (idNum % 2 === 0) sampleAmenities.push('washing_machine');
        if (idNum % 3 === 0) sampleAmenities.push('air_conditioning', 'parking');
        if (idNum % 4 === 0) sampleAmenities.push('gym');
        if (idNum % 5 === 0) sampleAmenities.push('pool');
        if (sampleProperty.monthlyRent > 25000) {
          sampleAmenities.push('gym', 'pool', 'air_conditioning', 'parking');
        } else if (sampleProperty.monthlyRent > 15000) {
          sampleAmenities.push('air_conditioning', 'washing_machine');
        }
        const uniqueSampleAmenities = [...new Set(sampleAmenities)];
        
        console.log('🏠 Sample property amenities:', uniqueSampleAmenities);
        console.log('🎯 Required amenities:', filters.amenities);
        console.log('✓ Match:', filters.amenities.every(amenity => uniqueSampleAmenities.includes(amenity)));
      }
    }

    setFilteredProperties(filtered);
  }, [filters, properties]);

  const handleFilterChange = (key: string, value: string | number[] | string[]) => {
    // If location is being changed, track if it's being cleared
    if (key === 'location') {
      const locationValue = value as string;
      setLocationCleared(!locationValue || locationValue.trim() === '');
    }
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleFavorite = async (id: string) => {
    if (!user) return;

    const isFavorited = favoriteIds.has(id);

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert([{ user_id: user.id, property_id: id }]);
        
        if (error) throw error;
      }

      setFavoriteIds(prev => {
        const newFavorites = new Set(prev);
        if (isFavorited) {
          newFavorites.delete(id);
        } else {
          newFavorites.add(id);
        }
        return newFavorites;
      });
    } catch (e: unknown) {
      console.error(e instanceof Error ? e.message : 'Unknown error');
    }
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      bedrooms: "",
      maxRent: "",
      priceRange: [1000, 50000] as [number, number], // Show all properties by default
      propertyType: "",
      amenities: [], // Reset amenities
    });
    setLocationCleared(false); // Reset location cleared flag to allow auto-location
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-subtle py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find Your Perfect Rental
            </h1>
            <p className="text-lg text-muted-foreground">
              {filteredProperties.length} properties available
            </p>
          </div>

          {/* Quick Search */}
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="w-full">
              <LocationAutocomplete
                placeholder="Search properties in Thailand..."
                value={filters.location}
                onChange={(value) => handleFilterChange("location", value)}
                className="h-12 w-full"
              />
            </div>

            {/* Mobile Price Slider - Show on smaller screens */}
            <div className="lg:hidden">
              <Card className="bg-background/95 backdrop-blur-sm border-border/50">
                <CardContent className="p-4">
                  <AdvancedPriceSlider
                    min={1000}
                    max={50000}
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange("priceRange", value)}
                    showInputs={true}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-4 lg:py-6">
        {/* Mobile Filters Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide More Filters' : 'Show More Filters'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? "block" : "hidden"} space-y-6`}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Range - Hidden on mobile since it's shown above */}
                <div className="hidden lg:block">
                  <AdvancedPriceSlider
                    min={1000}
                    max={50000}
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange("priceRange", value)}
                    showInputs={true}
                  />
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bedrooms (minimum)
                  </label>
                  <Select
                    value={filters.bedrooms}
                    onValueChange={(value) => handleFilterChange("bedrooms", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4">4 Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Property Type
                  </label>
                  <Select
                    value={filters.propertyType}
                    onValueChange={(value) => handleFilterChange("propertyType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Type</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Townhouse">Townhouse</SelectItem>
                      <SelectItem value="Condo">Condo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Amenities
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'wifi', label: 'WiFi' },
                      { value: 'washing_machine', label: 'In-unit Washing Machine' },
                      { value: 'kitchen', label: 'Kitchen' },
                      { value: 'refrigerator', label: 'Refrigerator' },
                      { value: 'air_conditioning', label: 'Air Conditioning' },
                      { value: 'parking', label: 'Parking' },
                      { value: 'gym', label: 'Gym' },
                      { value: 'pool', label: 'Swimming Pool' },
                    ].map((amenity) => (
                      <div key={amenity.value} className="flex items-center space-x-3">
                        <Checkbox
                          id={amenity.value}
                          checked={filters.amenities.includes(amenity.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleFilterChange("amenities", [...filters.amenities, amenity.value]);
                            } else {
                              handleFilterChange("amenities", filters.amenities.filter(a => a !== amenity.value));
                            }
                          }}
                        />
                        <label htmlFor={amenity.value} className="text-sm text-foreground cursor-pointer">
                          {amenity.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Active Filters Display */}
            {(filters.location || filters.bedrooms !== "" || filters.propertyType !== "" || filters.amenities.length > 0) && (
              <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    Active filters ({filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}):
                  </span>
                  {filters.location && (
                    <Badge variant="secondary" className="text-xs">
                      📍 {filters.location}
                    </Badge>
                  )}
                  {filters.bedrooms && filters.bedrooms !== "any" && (
                    <Badge variant="secondary" className="text-xs">
                      🛏️ {filters.bedrooms}+ beds
                    </Badge>
                  )}
                  {filters.propertyType && filters.propertyType !== "any" && (
                    <Badge variant="secondary" className="text-xs">
                      🏠 {filters.propertyType}
                    </Badge>
                  )}
                  {filters.amenities.map(amenity => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      ✨ {amenity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-xs h-6 px-2"
                  >
                    Clear all
                  </Button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-muted rounded-lg h-64 mb-4"></div>
                    <div className="bg-muted rounded h-4 mb-2"></div>
                    <div className="bg-muted rounded h-4 w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Error loading properties
                </h3>
                <p className="text-muted-foreground mb-4">
                  {error}
                </p>
                <Button variant="premium" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No properties found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search criteria.
                </p>
                <Button variant="premium" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    {...property}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;