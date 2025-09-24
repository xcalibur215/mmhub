import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Phone,
  Mail,
  User,
  Shield,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface PropertyDetailType {
  id: string;
  title: string;
  description?: string;
  monthly_rent: number;
  security_deposit?: number;
  bedrooms: number;
  bathrooms: number;
  square_feet?: number;
  location: string;
  full_address?: string;
  property_type: string;
  created_at: string;
  available_date?: string;
  image_urls?: string[];
  amenities?: string[];
  contact_profile?: {
    name: string;
    role_tag: string;
    phone: string;
    email: string;
    profile_picture?: string;
    rating?: number;
    review_count?: number;
    response_time?: string;
  };
}


const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [property, setProperty] = useState<PropertyDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching property:', error);
          toast({
            title: "Property not found",
            description: "The property you're looking for doesn't exist.",
            variant: "destructive"
          });
          return;
        }
        
        setProperty(data);
        
        // Check if favorited by current user
        if (user) {
          const { data: favorite } = await supabase
            .from('user_favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('property_id', id)
            .single();
          
          setIsFavorited(!!favorite);
        }
        
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error loading property",
          description: "There was a problem loading the property details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, user, toast]);

  const handleToggleFavorite = async () => {
    if (!user || !property) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save properties to your favorites.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', property.id);
        
        if (error) throw error;
        
        toast({
          title: "Removed from favorites",
          description: property.title
        });
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert([{ user_id: user.id, property_id: property.id }]);
        
        if (error) throw error;
        
        toast({
          title: "Added to favorites",
          description: property.title
        });
      }

      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "There was a problem updating your favorites.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="bg-muted rounded-lg h-64"></div>
            <div className="bg-muted rounded h-8"></div>
            <div className="bg-muted rounded h-4 w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/listings">Browse Properties</Link>
          </Button>
        </div>
      </div>
    );
  }

  const images = property.image_urls && property.image_urls.length > 0 
    ? property.image_urls 
    : ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"];

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/listings">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Link>
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                <img
                  src={images[currentImageIndex]}
                  alt={`${property.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index
                        ? "border-primary"
                        : "border-transparent hover:border-border"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {property.property_type}
                    </Badge>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      {property.full_address || property.location}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleFavorite}
                    className={isFavorited ? "text-red-500" : "text-muted-foreground"}
                  >
                    <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price and Key Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-subtle rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      ฿{property.monthly_rent.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Monthly Rent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-foreground">
                      {property.bedrooms}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center">
                      <Bed className="w-3 h-3 mr-1" />
                      Bedrooms
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-foreground">
                      {property.bathrooms}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center">
                      <Bath className="w-3 h-3 mr-1" />
                      Bathrooms
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-foreground">
                      {property.square_feet?.toLocaleString() || 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center">
                      <Square className="w-3 h-3 mr-1" />
                      Sq Ft
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                {/* Description */}
                {property.description && (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {property.description}
                      </p>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {property.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                <Separator />

                {/* Lease Details */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Lease Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {property.security_deposit && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Security Deposit:</span>
                        <span className="font-medium">฿{property.security_deposit.toLocaleString()}</span>
                      </div>
                    )}
                    {property.available_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available Date:</span>
                        <span className="font-medium">{formatDate(property.available_date)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Listed Date:</span>
                      <span className="font-medium">{formatDate(property.created_at)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Property Manager</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Manager Profile */}
                  {property.contact_profile ? (
                    <>
                      <div className="flex items-start space-x-4">
                        <img
                          src={property.contact_profile.profile_picture || "/placeholder.svg"}
                          alt={property.contact_profile.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">
                            {property.contact_profile.name}
                          </h4>
                          <Badge variant="outline" className="text-xs mb-2">
                            {property.contact_profile.role_tag}
                          </Badge>
                          {property.contact_profile.rating && (
                            <div className="flex items-center text-sm text-muted-foreground mb-1">
                              <Shield className="w-4 h-4 mr-1" />
                              {property.contact_profile.rating} stars ({property.contact_profile.review_count} reviews)
                            </div>
                          )}
                          {property.contact_profile.response_time && (
                            <p className="text-xs text-muted-foreground">
                              {property.contact_profile.response_time}
                            </p>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {/* Contact Actions */}
                      <div className="space-y-3">
                        <Button variant="hero" className="w-full" size="lg">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </Button>
                        <Button variant="premium" className="w-full">
                          <Mail className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                        <Button variant="outline" className="w-full">
                          Schedule Tour
                        </Button>
                      </div>

                      <Separator />

                      {/* Quick Contact Info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>{property.contact_profile.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span className="truncate">{property.contact_profile.email}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">Contact information not available</p>
                      <Button variant="outline" className="w-full">
                        <Mail className="w-4 h-4 mr-2" />
                        Request Contact Info
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;