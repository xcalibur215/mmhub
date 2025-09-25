import { useState, useEffect } from "react";
import HeroSection from "@/components/Home/HeroSection";
import PropertyCard from "@/components/Property/PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

interface Property {
  id: string;
  title: string;
  monthly_rent: number;
  security_deposit?: number;
  bedrooms: number;
  bathrooms: number;
  square_feet?: number;
  location: string;
  property_type: string;
  created_at: string;
  image_url?: string;
}

// Comprehensive dummy data for different property types and price ranges
const dummyProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury Downtown Condo',
    monthly_rent: 2500,
    security_deposit: 2500,
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1200,
    location: 'Downtown Bangkok, Thailand',
    property_type: 'Condo',
    created_at: '2024-01-15T10:00:00Z',
    image_url: '/placeholder.svg'
  },
  {
    id: '2',
    title: 'Cozy Studio Near BTS',
    monthly_rent: 800,
    security_deposit: 800,
    bedrooms: 0,
    bathrooms: 1,
    square_feet: 500,
    location: 'Sukhumvit, Bangkok, Thailand',
    property_type: 'Studio',
    created_at: '2024-01-14T15:30:00Z',
    image_url: '/placeholder.svg'
  },
  {
    id: '3',
    title: 'Family House with Garden',
    monthly_rent: 1800,
    security_deposit: 3600,
    bedrooms: 4,
    bathrooms: 3,
    square_feet: 2200,
    location: 'Thonglor, Bangkok, Thailand',
    property_type: 'House',
    created_at: '2024-01-13T09:15:00Z',
    image_url: '/placeholder.svg'
  },
  {
    id: '4',
    title: 'Modern Apartment Complex',
    monthly_rent: 1200,
    security_deposit: 1200,
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 700,
    location: 'Chatuchak, Bangkok, Thailand',
    property_type: 'Apartment',
    created_at: '2024-01-12T14:20:00Z',
    image_url: '/placeholder.svg'
  },
  {
    id: '5',
    title: 'Penthouse with City View',
    monthly_rent: 4500,
    security_deposit: 9000,
    bedrooms: 3,
    bathrooms: 3,
    square_feet: 2000,
    location: 'Sathorn, Bangkok, Thailand',
    property_type: 'Penthouse',
    created_at: '2024-01-11T11:45:00Z',
    image_url: '/placeholder.svg'
  },
  {
    id: '6',
    title: 'Budget-Friendly Shared Room',
    monthly_rent: 400,
    security_deposit: 400,
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 300,
    location: 'Ramkhamhaeng, Bangkok, Thailand',
    property_type: 'Shared Room',
    created_at: '2024-01-10T08:30:00Z',
    image_url: '/placeholder.svg'
  }
];

const Index = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        console.log('Fetching featured properties...');
        setError(null);
        
        if (!supabase) {
          console.log('Supabase not configured, using dummy data');
          // If Supabase is not configured, use dummy data
          setFeaturedProperties(dummyProperties.slice(0, 3));
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        
        console.log('Supabase response:', { data, error });
        
        if (error) {
          console.error('Error fetching featured properties:', error);
          setError('Failed to load properties from database. Using sample data.');
          // Fallback to dummy data on error
          setFeaturedProperties(dummyProperties.slice(0, 3));
          setLoading(false);
          return;
        }
        
        // Transform data to match expected interface
        const transformedData = data?.map(property => ({
          ...property,
          id: String(property.id), // Ensure id is always a string
          monthly_rent: property.price // Map price column to monthly_rent
        })) || [];
        
        setFeaturedProperties(transformedData.length > 0 ? transformedData : dummyProperties.slice(0, 3));
        
        // Fetch user favorites if logged in
        if (user) {
          const { data: favorites } = await supabase
            .from('user_favorites')
            .select('property_id')
            .eq('user_id', user.id);
          
          if (favorites) {
            setFavoriteIds(new Set(favorites.map(f => f.property_id)));
          }
        }
      } catch (error) {
        console.error('Error in fetchFeaturedProperties:', error);
        setError('An unexpected error occurred while loading properties.');
        // Fallback to dummy data on error
        setFeaturedProperties(dummyProperties.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, [user]);
  
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
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
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

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {error && (
              <div className="col-span-full bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
                <strong className="font-bold">Notice: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-64 mb-4"></div>
                  <div className="bg-muted rounded h-4 mb-2"></div>
                  <div className="bg-muted rounded h-4 w-2/3"></div>
                </div>
              ))
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  monthlyRent={property.monthly_rent}
                  securityDeposit={property.security_deposit}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  squareFeet={property.square_feet}
                  location={property.location}
                  propertyType={property.property_type}
                  listedAt={property.created_at}
                  imageUrl={property.image_url}
                  isFavorited={favoriteIds.has(property.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No featured properties available at the moment.</p>
              </div>
            )}
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
