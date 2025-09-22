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
import { useState } from "react";

// Mock data - in real app this would be fetched from API
const mockProperty = {
  id: "1",
  title: "Modern Downtown Apartment with City Views",
  description: "Beautiful downtown apartment featuring floor-to-ceiling windows with stunning city views. This modern unit includes a fully equipped kitchen with stainless steel appliances, in-unit washer/dryer, and access to building amenities including a fitness center, rooftop deck, and 24/7 concierge service. Perfect for professionals seeking luxury urban living.",
  monthlyRent: 2400,
  securityDeposit: 2400,
  bedrooms: 2,
  bathrooms: 2,
  squareFeet: 1200,
  location: "Downtown Seattle, WA",
  fullAddress: "1234 Pine Street, Seattle, WA 98101",
  propertyType: "Apartment",
  listedAt: new Date().toISOString(),
  availableDate: new Date(Date.now() + 2592000000).toISOString(), // 30 days from now
  images: [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
  ],
  amenities: [
    "In-unit washer/dryer",
    "Dishwasher",
    "Air conditioning",
    "Hardwood floors",
    "Walk-in closet",
    "Balcony",
    "Fitness center",
    "Rooftop deck",
    "24/7 concierge",
    "Parking available",
  ],
  contactProfile: {
    name: "Sarah Johnson",
    roleTag: "Property Manager",
    phone: "(555) 123-4567",
    email: "sarah.johnson@renthub.com",
    profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    rating: 4.8,
    reviewCount: 47,
    responseTime: "Usually responds within 2 hours",
  },
};

const PropertyDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  // In real app, fetch property data using the id
  const property = mockProperty;

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
                  src={property.images[currentImageIndex]}
                  alt={`${property.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {property.images.map((image, index) => (
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
                      {property.propertyType}
                    </Badge>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      {property.fullAddress}
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
                      ${property.monthlyRent.toLocaleString()}
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
                      {property.squareFeet?.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center">
                      <Square className="w-3 h-3 mr-1" />
                      Sq Ft
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </div>

                <Separator />

                {/* Amenities */}
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

                {/* Lease Details */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Lease Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Security Deposit:</span>
                      <span className="font-medium">${property.securityDeposit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available Date:</span>
                      <span className="font-medium">{formatDate(property.availableDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Listed Date:</span>
                      <span className="font-medium">{formatDate(property.listedAt)}</span>
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
                  <div className="flex items-start space-x-4">
                    <img
                      src={property.contactProfile.profilePicture}
                      alt={property.contactProfile.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        {property.contactProfile.name}
                      </h4>
                      <Badge variant="outline" className="text-xs mb-2">
                        {property.contactProfile.roleTag}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <Shield className="w-4 h-4 mr-1" />
                        {property.contactProfile.rating} stars ({property.contactProfile.reviewCount} reviews)
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {property.contactProfile.responseTime}
                      </p>
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
                      <span>{property.contactProfile.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="truncate">{property.contactProfile.email}</span>
                    </div>
                  </div>
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