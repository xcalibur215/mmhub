import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import PropertyCard, { PropertyCardProps } from "@/components/Property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    location: searchParams.get("location") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    maxRent: searchParams.get("maxRent") || "",
    priceRange: [3000, 6000] as [number, number],
    propertyType: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

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
          id: property.id,
          title: property.title,
          monthlyRent: property.monthly_rent || 0,
          securityDeposit: property.security_deposit,
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          squareFeet: property.square_feet,
          location: property.location || '',
          imageUrl: property.image_url || property.image_urls?.[0],
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

  const handleFilterChange = (key: string, value: string | number[]) => {
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
      priceRange: [3000, 6000] as [number, number],
      propertyType: "",
    });
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
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <LocationAutocomplete
                  placeholder="Search properties in Thailand..."
                  value={filters.location}
                  onChange={(value) => handleFilterChange("location", value)}
                  className="h-12"
                />
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
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

      <div className="container mx-auto px-4 py-8">
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
                {/* Price Range */}
                <div>
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
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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