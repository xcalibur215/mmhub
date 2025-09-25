import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Home, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import PropertyCard, { PropertyCardProps } from "@/components/Property/PropertyCard";

const Favorites = () => {
  const [favorites, setFavorites] = useState<PropertyCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_favorites')
          .select(`
            property_id,
            properties (
              id,
              title,
              monthly_rent,
              security_deposit,
              bedrooms,
              bathrooms,
              square_feet,
              location,
              property_type,
              created_at,
              image_url,
              image_urls
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        interface PropertyFromSupabase {
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
          image_urls?: string[];
        }

        const transformedFavorites: PropertyCardProps[] = data
          ?.filter(item => item.properties)
          .map(item => {
            const property = item.properties as any;
            return {
              id: String(property.id), // Ensure id is always a string
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
              isFavorited: true
            };
          }) || [];

        setFavorites(transformedFavorites);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleToggleFavorite = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', id);
      
      if (error) throw error;

      setFavorites(prev => prev.filter(property => property.id !== id));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your favorite properties.
          </p>
          <Button asChild>
            <Link to="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted rounded-lg h-64 mb-4"></div>
                <div className="bg-muted rounded h-4 mb-2"></div>
                <div className="bg-muted rounded h-4 w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Favorites</h1>
            <p className="text-muted-foreground">
              {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-4">
              No favorites yet
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Browse properties and click the heart icon to add them to your favorites.
            </p>
            <Button asChild>
              <Link to="/listings">
                <Home className="w-4 h-4 mr-2" />
                Browse Properties
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((property) => (
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
  );
};

export default Favorites;