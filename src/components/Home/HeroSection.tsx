import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LocationAutocomplete from "@/components/ui/location-autocomplete";
import { Search, Bed, DollarSign } from "lucide-react";
import heroImage from "@/assets/hero-real-estate.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: "",
    bedrooms: "",
    maxRent: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.location) params.set("location", searchData.location);
    if (searchData.bedrooms && searchData.bedrooms !== "any") params.set("bedrooms", searchData.bedrooms);
    if (searchData.maxRent && searchData.maxRent !== "any") params.set("maxRent", searchData.maxRent);
    
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Beautiful neighborhood with modern apartments and houses"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Find Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-hero"> Rental Home</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              Discover thousands of quality rental properties from verified landlords and trusted agents. 
              Your dream home is just a search away.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-6 shadow-elegant border border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location in Thailand
                </label>
                <LocationAutocomplete
                  value={searchData.location}
                  onChange={(value) => setSearchData(prev => ({ ...prev, location: value }))}
                  placeholder="Bangkok, Chiang Mai, Phuket..."
                  className="h-12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Bed className="inline w-4 h-4 mr-1" />
                  Bedrooms (min)
                </label>
                <Select value={searchData.bedrooms} onValueChange={(value) => setSearchData(prev => ({ ...prev, bedrooms: value }))}>
                  <SelectTrigger className="h-12">
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

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Max Rent
                </label>
                <Select value={searchData.maxRent} onValueChange={(value) => setSearchData(prev => ({ ...prev, maxRent: value }))}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="15000">Up to ฿15,000</SelectItem>
                    <SelectItem value="25000">Up to ฿25,000</SelectItem>
                    <SelectItem value="35000">Up to ฿35,000</SelectItem>
                    <SelectItem value="50000">Up to ฿50,000</SelectItem>
                    <SelectItem value="75000">Up to ฿75,000</SelectItem>
                    <SelectItem value="100000">Up to ฿100,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={handleSearch}
                className="flex-1 h-12 text-base font-semibold"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Properties
              </Button>
              <Button 
                variant="premium" 
                size="lg" 
                className="h-12 font-semibold"
                onClick={() => navigate('/listings')}
              >
                Browse All
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { number: "10,000+", label: "Active Listings" },
              { number: "5,000+", label: "Happy Tenants" },
              { number: "1,200+", label: "Verified Landlords" },
              { number: "50+", label: "Cities Covered" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;