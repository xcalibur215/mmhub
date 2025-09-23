import HeroSection from "@/components/Home/HeroSection";
import PropertyCard from "@/components/Property/PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for featured properties
const featuredProperties = [
  {
    id: "1",
    title: "Modern Downtown Apartment with City Views",
    monthlyRent: 2400,
    securityDeposit: 2400,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    location: "Downtown Seattle, WA",
    propertyType: "Apartment",
    listedAt: new Date().toISOString(),
  },
  {
    id: "2", 
    title: "Cozy Studio in Trendy Neighborhood",
    monthlyRent: 1800,
    securityDeposit: 1800,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 650,
    location: "Capitol Hill, Seattle, WA",
    propertyType: "Studio",
    listedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: "3",
    title: "Spacious Family Home with Garden",
    monthlyRent: 3200,
    securityDeposit: 3200,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2200,
    location: "Bellevue, WA",
    propertyType: "House",
    listedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
];

const Index = () => {
  console.log('Index component rendering...');
  
  const handleToggleFavorite = (id: string) => {
    // TODO: Implement favorite toggle functionality
    console.log('Toggle favorite for property:', id);
  };

  return (
    <div>
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose MM Hub?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're committed to making your rental journey smooth, secure, and successful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Listings",
                description: "All properties are verified by our team for authenticity and quality.",
              },
              {
                icon: Users,
                title: "Trusted Community",
                description: "Connect with verified landlords and agents you can trust.",
              },
              {
                icon: Clock,
                title: "Quick Response",
                description: "Get responses from property managers within 24 hours.",
              },
              {
                icon: Star,
                title: "5-Star Support",
                description: "Our customer support team is here to help you every step of the way.",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-feature">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Featured Properties
              </h2>
              <p className="text-lg text-muted-foreground">
                Discover hand-picked properties from our premium collection.
              </p>
            </div>
            <Button variant="premium" asChild className="hidden md:flex">
              <Link to="/listings">
                View All Properties
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Button variant="premium" asChild>
              <Link to="/listings">
                View All Properties
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Perfect Home?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of satisfied renters who found their dream homes through MM Hub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild className="text-primary">
                <Link to="/listings">Browse Properties</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                <Link to="/auth/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
