import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Heart, 
  Share, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize,
  Phone, 
  Mail, 
  Star, 
  CheckCircle,
  Calendar,
  Building,
  Copy,
  ExternalLink,
  MessageCircle,
  Send,
  MessageSquare,
  Lock,
  Wifi, 
  Car, 
  Waves, 
  Dumbbell, 
  ChefHat, 
  Snowflake, 
  WashingMachine,
  Loader2
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  amenities: string[];
  images: string[];
  is_available: boolean;
  created_at: string;
}

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError('Property ID not found');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        
        if (!data) {
          setError('Property not found');
        } else {
          setProperty(data);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/listings')}
            className="flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Listings
          </Button>
          
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-2xl font-bold mb-2">Property Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || 'The property you\'re looking for doesn\'t exist or has been removed.'}
            </p>
            <Button onClick={() => navigate('/listings')}>
              Browse All Properties
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Transform property data for display
  const displayProperty = {
    id: property.id,
    title: property.title,
    description: property.description,
    monthly_rent: property.price,
    security_deposit: property.price * 2, // Typically 2 months security deposit
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    square_feet: Math.round(property.area_sqm * 10.764), // Convert sqm to sqft
    location: property.location.split(',').slice(0, 2).join(', '), // Short location
    full_address: property.location,
    property_type: property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1),
    available_date: property.created_at,
    image_urls: property.images && property.images.length > 0 ? property.images : ['/placeholder.svg'],
    amenities: Array.isArray(property.amenities) ? property.amenities.map(a => a.toLowerCase().replace(/\s+/g, '_')) : [],
    contact_profile: {
      name: 'Property Manager',
      role_tag: 'Verified Manager',
      phone: '+66 2 123 4567',
      email: 'manager@example.com',
      whatsapp: '+66 87 123 4567',
      telegram: '@propertymanager',
      line: 'property.manager',
      profile_picture: '/placeholder.svg',
      rating: 4.8,
      review_count: 127,
      response_time: '< 1 hour',
      verified: true,
      properties_count: 24
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'parking': return <Car className="w-4 h-4" />;
      case 'pool': return <Waves className="w-4 h-4" />;
      case 'gym': return <Dumbbell className="w-4 h-4" />;
      case 'kitchen': return <ChefHat className="w-4 h-4" />;
      case 'air_conditioning': return <Snowflake className="w-4 h-4" />;
      case 'washing_machine': return <WashingMachine className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleContactCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/listings')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Listings
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="relative mb-8">
          <div className="aspect-video rounded-xl overflow-hidden bg-muted">
            <img
              src={displayProperty.image_urls?.[0] || '/placeholder.svg'}
              alt={displayProperty.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{displayProperty.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{displayProperty.location}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{displayProperty.full_address}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    ฿{displayProperty.monthly_rent.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">per month</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    ฿{displayProperty.security_deposit.toLocaleString()} deposit
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="flex items-center gap-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{displayProperty.bedrooms} bed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{displayProperty.bathrooms} bath</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{displayProperty.square_feet} ft²</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{displayProperty.property_type}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">About this property</h2>
              <p className="text-muted-foreground leading-relaxed">{displayProperty.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.isArray(displayProperty.amenities) && displayProperty.amenities.length > 0 ? (
                  displayProperty.amenities.map((amenity, index) => {
                    const icon = getAmenityIcon(amenity);
                    if (!icon) return null;
                    
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        {icon}
                        <span className="text-sm font-medium capitalize">
                          {amenity.replace('_', ' ')}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No amenities listed for this property
                  </div>
                )}
              </div>
            </div>

            {/* Available Date */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Availability</h2>
              <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span>Available from {new Date(displayProperty.available_date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Contact Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Property Manager
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage 
                      src={displayProperty.contact_profile?.profile_picture} 
                      alt={displayProperty.contact_profile?.name} 
                    />
                    <AvatarFallback>
                      {displayProperty.contact_profile?.name?.charAt(0) || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{displayProperty.contact_profile?.name}</h3>
                      {displayProperty.contact_profile?.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {displayProperty.contact_profile?.role_tag}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {displayProperty.contact_profile.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({displayProperty.contact_profile.review_count} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold">
                      {displayProperty.contact_profile?.properties_count || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Properties</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold">
                      {displayProperty.contact_profile?.response_time || '< 24h'}
                    </div>
                    <div className="text-xs text-muted-foreground">Response time</div>
                  </div>
                </div>

                {/* Contact Information - Conditional */}
                {user ? (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground mb-3">
                      Contact Methods:
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{displayProperty.contact_profile.phone}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleContactCopy(displayProperty.contact_profile.phone, 'Phone')}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{displayProperty.contact_profile.email}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleContactCopy(displayProperty.contact_profile.email, 'Email')}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">WhatsApp</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => window.open(`https://wa.me/${displayProperty.contact_profile.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        <span className="text-sm">Telegram</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => window.open(`https://t.me/${displayProperty.contact_profile.telegram.replace('@', '')}`, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">LINE ID: {displayProperty.contact_profile.line}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleContactCopy(displayProperty.contact_profile.line, 'LINE ID')}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <h4 className="font-medium mb-2">Login to View Contact Details</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create a free account to access property manager's phone, email, and messaging contact information.
                      </p>
                      <div className="space-y-2">
                        <Button 
                          className="w-full" 
                          onClick={() => navigate('/auth/login')}
                        >
                          Login
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => navigate('/auth/signup')}
                        >
                          Sign Up
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        Managed by <span className="font-medium">{displayProperty.contact_profile?.name}</span>
                        {displayProperty.contact_profile?.verified && ' • Verified Manager'}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;