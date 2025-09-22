import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, MapPin, Bed, Bath, Square, Calendar } from "lucide-react";
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
            className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm"
          >
            {propertyType}
          </Badge>
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 h-8 w-8 bg-background/90 backdrop-blur-sm hover:bg-background/95 ${
              isFavorited ? 'text-red-500' : 'text-muted-foreground'
            }`}
            onClick={handleFavoriteClick}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>
          
          {/* Listing Date */}
          <div className="absolute bottom-3 right-3">
            <Badge variant="outline" className="bg-background/90 backdrop-blur-sm text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(listedAt)}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Price */}
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-foreground">
                {formatPrice(convertFromUSD(monthlyRent))}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
              {securityDeposit && (
                <div className="text-sm text-muted-foreground">
                  +{formatPrice(convertFromUSD(securityDeposit))} deposit
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-foreground line-clamp-2 leading-snug">
              {title}
            </h3>

            {/* Location */}
            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="text-sm truncate">{location}</span>
            </div>

            {/* Property Details */}
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/50">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  <span>{bedrooms} bed{bedrooms !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  <span>{bathrooms} bath{bathrooms !== 1 ? 's' : ''}</span>
                </div>
              </div>
              
              {squareFeet && (
                <div className="flex items-center">
                  <Square className="w-4 h-4 mr-1" />
                  <span>{squareFeet.toLocaleString()} sqft</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button 
            variant="premium" 
            className="w-full"
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