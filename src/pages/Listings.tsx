import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "@/components/Property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, SlidersHorizontal, MapPin } from "lucide-react";

// Mock data - in real app this would come from API
const mockProperties = [
  {
    id: "1",
    title: "Modern Downtown Loft",
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
];

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    maxRent: searchParams.get("maxRent") || "",
    priceRange: [5000, 100000],
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
      (property) =>
        property.monthlyRent >= filters.priceRange[0] &&
        property.monthlyRent <= filters.priceRange[1]
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
      priceRange: [5000, 100000],
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
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Search by location..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
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
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Monthly Rent: ฿{filters.priceRange[0].toLocaleString()} - ฿{filters.priceRange[1].toLocaleString()}
                  </label>
                  <Slider
                    min={5000}
                    max={100000}
                    step={5000}
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange("priceRange", value)}
                    className="mb-4"
                  />
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Minimum Bedrooms
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
                      <SelectItem value="1">1+ Bedroom</SelectItem>
                      <SelectItem value="2">2+ Bedrooms</SelectItem>
                      <SelectItem value="3">3+ Bedrooms</SelectItem>
                      <SelectItem value="4">4+ Bedrooms</SelectItem>
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
                      <SelectItem value="Loft">Loft</SelectItem>
                      <SelectItem value="Townhouse">Townhouse</SelectItem>
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