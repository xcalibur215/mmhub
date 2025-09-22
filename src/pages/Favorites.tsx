import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PropertyCard from "@/components/Property/PropertyCard";
import { Heart, Home } from "lucide-react";

const Favorites = () => {
  // Mock favorite properties data
  const [favoriteProperties] = useState([
    {
      id: "1",
      title: "Modern Condo in Sukhumvit",
      monthlyRent: 25000,
      bedrooms: 2,
      bathrooms: 2,
      location: "Sukhumvit, Bangkok",
      imageUrl: "/placeholder.svg",
      propertyType: "Condo" as const,
      description: "Luxury condo with city views",
      amenities: ["Pool", "Gym", "BTS Access"],
      contact: {
        name: "Khun Somchai",
        phone: "+66 2 123 4567",
        email: "somchai@example.com"
      }
    },
    {
      id: "2", 
      title: "Cozy Studio in Thong Lo",
      monthlyRent: 18000,
      bedrooms: 1,
      bathrooms: 1,
      location: "Thong Lo, Bangkok",
      imageUrl: "/placeholder.svg",
      propertyType: "Studio" as const,
      description: "Perfect for young professionals",
      amenities: ["WiFi", "Kitchen", "Near BTS"],
      contact: {
        name: "Khun Malee",
        phone: "+66 2 987 6543", 
        email: "malee@example.com"
      }
    },
    {
      id: "3",
      title: "Family House in Rama 9",
      monthlyRent: 35000,
      bedrooms: 3,
      bathrooms: 3,
      location: "Rama 9, Bangkok",
      imageUrl: "/placeholder.svg",
      propertyType: "House" as const,
      description: "Spacious house perfect for families",
      amenities: ["Garden", "Parking", "School Nearby"],
      contact: {
        name: "Khun Niran",
        phone: "+66 2 555 0123",
        email: "niran@example.com"
      }
    }
  ]);

  const removeFavorite = (propertyId: string) => {
    // In real app, this would call API to remove favorite
    console.log(`Removing property ${propertyId} from favorites`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Favorite Properties
            </h1>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {favoriteProperties.length} Properties
              </Badge>
              <span className="text-muted-foreground">Saved for later</span>
            </div>
          </div>
        </div>

        {favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property) => (
              <div key={property.id} className="relative">
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  monthlyRent={property.monthlyRent}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  location={property.location}
                  imageUrl={property.imageUrl}
                  propertyType={property.propertyType}
                  listedAt={new Date().toISOString()}
                  isFavorited={true}
                  onToggleFavorite={removeFavorite}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => removeFavorite(property.id)}
                >
                  <Heart className="w-4 h-4 fill-current" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Favorites Yet</CardTitle>
              <CardDescription>
                Start browsing properties and save your favorites here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Find Your Perfect Home
                </h3>
                <p className="text-muted-foreground mb-4">
                  Browse our listings and save properties you're interested in.
                </p>
                <Button variant="hero" asChild>
                  <a href="/listings">Browse Properties</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Favorites;