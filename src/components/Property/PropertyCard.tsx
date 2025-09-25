import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, MapPin, Bed, Bath, Maximize, Calendar, Wifi, Car, Waves, Dumbbell, ChefHat, Snowflake, WashingMachine } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/utils/currency";

export interface PropertyCardProps {
  id: string;
  title: string;
  monthlyRent: number;
  securityDeposit?: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  location: string;
  imageUrl?: string;
  propertyType: string;
  listedAt: string;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const PropertyCard = ({
  id,
  title,
  monthlyRent,
  securityDeposit,
  bedrooms,
  bathrooms,
  squareFeet,
  location,
  imageUrl = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
  propertyType,
  listedAt,
  isFavorited = false,
  onToggleFavorite,
}: PropertyCardProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { formatPrice, convertFromUSD } = useCurrency();
  
  const { toast } = useToast();

  // Mock amenities function (matches the one in Listings.tsx)
  const getPropertyAmenities = () => {
    const amenities: string[] = [];
    
    // Basic amenities that most properties have
    amenities.push('wifi', 'kitchen', 'refrigerator');
    
    // Add amenities based on property type
    if (propertyType.toLowerCase().includes('condo') || propertyType.toLowerCase().includes('apartment')) {
      amenities.push('air_conditioning');
    }
    
    if (propertyType.toLowerCase().includes('house')) {
      amenities.push('parking', 'washing_machine');
    }
    
    // Add amenities based on property ID for variety
    // Ensure id is a string before calling replace
    const idStr = String(id || '');
    const idNum = parseInt(idStr.replace(/\D/g, '')) || 0;
    if (idNum % 2 === 0) amenities.push('washing_machine');
    if (idNum % 3 === 0) amenities.push('air_conditioning', 'parking');
    if (idNum % 4 === 0) amenities.push('gym');
    if (idNum % 5 === 0) amenities.push('pool');
    
    // Higher rent properties tend to have more amenities
    if (monthlyRent > 25000) {
      amenities.push('gym', 'pool', 'air_conditioning', 'parking');
    } else if (monthlyRent > 15000) {
      amenities.push('air_conditioning', 'washing_machine');
    }
    
    // Remove duplicates and return top 4 for display
    return [...new Set(amenities)].slice(0, 4);
  };

  const displayAmenities = getPropertyAmenities();

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return <Wifi className="w-3 h-3" />;
      case 'parking': return <Car className="w-3 h-3" />;
      case 'pool': return <Waves className="w-3 h-3" />;
      case 'gym': return <Dumbbell className="w-3 h-3" />;
      case 'kitchen': return <ChefHat className="w-3 h-3" />;
      case 'air_conditioning': return <Snowflake className="w-3 h-3" />;
      case 'washing_machine': return <WashingMachine className="w-3 h-3" />;
      case 'refrigerator': return <ChefHat className="w-3 h-3" />; // Using ChefHat for kitchen appliances
      default: return null; // Don't show anything for unrecognized amenities
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(id);
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: title,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return "Today";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Link to={`/listings/${id}`}>
      <Card className="group hover:shadow-feature transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50 overflow-hidden">
        <div className="relative">
          {/* Property Image */}
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            {isImageLoading && (
              <div className="w-full h-full bg-muted animate-pulse" />
            )}
            <img 
              src={imageUrl}
              alt={title}
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                isImageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
          </div>
          
          {/* Property Type Badge */}
          <Badge 
            variant="secondary" 
            className="absolute top-2 md:top-3 left-2 md:left-3 bg-background/90 backdrop-blur-sm text-xs"
          >
            {propertyType}
          </Badge>
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 md:top-3 right-2 md:right-3 h-7 w-7 md:h-8 md:w-8 bg-background/90 backdrop-blur-sm hover:bg-background/95 ${
              isFavorited ? 'text-red-500' : 'text-muted-foreground'
            }`}
            onClick={handleFavoriteClick}
          >
            <Heart className={`h-3 w-3 md:h-4 md:w-4 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>
          
          {/* Listing Date */}
          <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3">
            <Badge variant="outline" className="bg-background/90 backdrop-blur-sm text-xs">
              <Calendar className="w-3 h-3 mr-0.5 md:mr-1" />
              <span className="hidden sm:inline">{formatDate(listedAt)}</span>
              <span className="sm:hidden">{formatDate(listedAt).split(' ')[0]}</span>
            </Badge>
          </div>
        </div>

        <CardContent className="p-3 md:p-4">
          <div className="space-y-2 md:space-y-3">
            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground break-words">
                    ฿{monthlyRent.toLocaleString()}
                  </div>
                  <div className="text-xs md:text-sm font-normal text-muted-foreground">/month</div>
                </div>
              </div>
              {securityDeposit && (
                <div className="text-xs text-muted-foreground">
                  +฿{securityDeposit.toLocaleString()} deposit
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-foreground leading-tight text-sm md:text-base min-h-[2.5rem] break-words overflow-wrap-anywhere">
              {title}
            </h3>

            {/* Location */}
            <div className="flex items-start text-muted-foreground min-h-[1.25rem]">
              <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0 mt-0.5" />
              <span className="text-xs md:text-sm break-words overflow-wrap-anywhere">{location}</span>
            </div>

            {/* Property Details */}
            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <Bed className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    <span>{bedrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    <span>{bathrooms}</span>
                  </div>
                </div>
                
                {/* Square Feet */}
                {squareFeet && (
                  <div className="flex items-center">
                    <Maximize className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    <span>{squareFeet.toLocaleString()} ft²</span>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities Preview */}
            {displayAmenities.length > 0 && (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs text-muted-foreground">Amenities:</span>
                <div className="flex items-center gap-1">
                  {displayAmenities.slice(0, 4).map((amenity) => {
                    const icon = getAmenityIcon(amenity);
                    if (!icon) return null; // Only show amenities with valid icons
                    
                    return (
                      <div
                        key={amenity}
                        className="flex items-center justify-center w-5 h-5 bg-primary/10 rounded-full text-primary"
                        title={amenity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      >
                        {icon}
                      </div>
                    );
                  }).filter(Boolean)} {/* Remove null entries */}
                  {displayAmenities.filter(amenity => getAmenityIcon(amenity) !== null).length > 4 && (
                    <span className="text-xs text-muted-foreground">+{displayAmenities.filter(amenity => getAmenityIcon(amenity) !== null).length - 4}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-3 md:p-4 pt-0">
          <Button 
            variant="premium" 
            className="w-full text-xs md:text-sm"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              // Handle contact action
            }}
          >
            Contact Now
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PropertyCard;