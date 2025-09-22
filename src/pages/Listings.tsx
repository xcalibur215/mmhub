import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "@/components/Property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdvancedPriceSlider from "@/components/ui/advanced-price-slider";
import LocationAutocomplete from "@/components/ui/location-autocomplete";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

// Mock data - in real app this would come from API
const mockProperties = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    monthlyRent: 32000,
    securityDeposit: 32000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    location: "Sukhumvit, Bangkok",
    propertyType: "Apartment",
    listedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Cozy Studio Apartment",
    monthlyRent: 18000,
    securityDeposit: 18000,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 650,
    location: "Thong Lo, Bangkok",
    propertyType: "Studio",
    listedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Spacious Family Home",
    monthlyRent: 45000,
    securityDeposit: 45000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2200,
    location: "Rama 9, Bangkok",
    propertyType: "House",
    listedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "4",
    title: "Luxury Penthouse",
    monthlyRent: 85000,
    securityDeposit: 85000,
    bedrooms: 1,
    bathrooms: 1.5,
    squareFeet: 900,
    location: "Silom, Bangkok",
    propertyType: "Condo",
    listedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "5",
    title: "Pet-Friendly Townhouse",
    monthlyRent: 26000,
    securityDeposit: 26000,
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 1800,
    location: "Lat Phrao, Bangkok",
    propertyType: "Townhouse",
    listedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: "6",
    title: "Charming Cottage Near Park",
    monthlyRent: 22000,
    securityDeposit: 22000,
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 1000,
    location: "Chatuchak, Bangkok",
    propertyType: "House",
    listedAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: "7",
    title: "Beach View Condo",
    monthlyRent: 35000,
    securityDeposit: 35000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1100,
    location: "Phuket",
    propertyType: "Condo",
    listedAt: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    id: "8",
    title: "Mountain View Villa",
    monthlyRent: 28000,
    securityDeposit: 28000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1600,
    location: "Chiang Mai",
    propertyType: "House",
    listedAt: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: "9",
    title: "Beachfront Studio",
    monthlyRent: 25000,
    securityDeposit: 25000,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 550,
    location: "Pattaya",
    propertyType: "Studio",
    listedAt: new Date(Date.now() - 691200000).toISOString(),
  },
  {
    id: "10",
    title: "Luxury High-Rise Condo",
    monthlyRent: 65000,
    securityDeposit: 65000,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 1800,
    location: "Sathorn, Bangkok",
    propertyType: "Condo",
    listedAt: new Date(Date.now() - 777600000).toISOString(),
  },
  {
    id: "11",
    title: "Premium Penthouse Suite",
    monthlyRent: 85000,
    securityDeposit: 85000,
    bedrooms: 4,
    bathrooms: 4,
    squareFeet: 2500,
    location: "Silom, Bangkok",
    propertyType: "Condo",
    listedAt: new Date(Date.now() - 864000000).toISOString(),
  },
];

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    maxRent: searchParams.get("maxRent") || "",
    priceRange: [3000, 6000] as [number, number],
    propertyType: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Apply filters
    let filtered = mockProperties;

    if (filters.location) {
      filtered = filtered.filter((property) =>
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.bedrooms && filters.bedrooms !== "any") {
      const minBedrooms = parseInt(filters.bedrooms);
      filtered = filtered.filter((property) => property.bedrooms >= minBedrooms);
    }

    if (filters.maxRent && filters.maxRent !== "any") {
      const maxRent = parseInt(filters.maxRent);
      filtered = filtered.filter((property) => property.monthlyRent <= maxRent);
    }

    filtered = filtered.filter(
      (property) => {
        const minPrice = filters.priceRange[0];
        const maxPrice = filters.priceRange[1];
        
        // If max price is 50000, include all properties 50000 and above
        if (maxPrice >= 50000) {
          return property.monthlyRent >= minPrice;
        }
        
        return property.monthlyRent >= minPrice && property.monthlyRent <= maxPrice;
      }
    );

    if (filters.propertyType && filters.propertyType !== "any") {
      filtered = filtered.filter((property) => property.propertyType === filters.propertyType);
    }

    setFilteredProperties(filtered);
  }, [filters]);

  const handleFilterChange = (key: string, value: string | number[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleFavorite = (id: string) => {
    console.log('Toggle favorite for property:', id);
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
            {filteredProperties.length === 0 ? (
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