import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Heart, 
  MessageCircle, 
  FileText, 
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Bell,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  first_name?: string;
  last_name?: string;
}

interface RenterDashboardProps {
  user: User;
}

const RenterDashboard = ({ user }: RenterDashboardProps) => {
  const [stats, setStats] = useState({
    savedProperties: 0,
    viewingScheduled: 0,
    applications: 0,
    messages: 0
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "saved",
      title: "Property saved",
      description: "Modern Studio in Downtown Bangkok",
      time: "2 hours ago",
      icon: Heart,
      color: "text-red-500"
    },
    {
      id: 2,
      type: "message",
      title: "New message from agent",
      description: "Sarah Johnson replied about the condo viewing",
      time: "5 hours ago",
      icon: MessageCircle,
      color: "text-blue-500"
    },
    {
      id: 3,
      type: "viewing",
      title: "Viewing scheduled",
      description: "Luxury Apartment in Sukhumvit - Tomorrow 2:00 PM",
      time: "1 day ago",
      icon: Calendar,
      color: "text-green-500"
    }
  ]);

  const quickActions = [
    { icon: Search, label: "Browse Properties", href: "/listings", description: "Find your perfect home" },
    { icon: Heart, label: "Saved Properties", href: "/favorites", description: "View your saved listings" },
    { icon: Calendar, label: "Schedule Viewing", href: "/viewings", description: "Book property tours" },
    { icon: MessageCircle, label: "Messages", href: "/messages", description: "Chat with agents" },
    { icon: FileText, label: "Applications", href: "/applications", description: "Track rental applications" },
    { icon: Settings, label: "Preferences", href: "/settings", description: "Set search preferences" }
  ];

  const [savedProperties, setSavedProperties] = useState<any[]>([]);

  useEffect(() => {
    // Simulate loading stats
    setStats({
      savedProperties: 8,
      viewingScheduled: 3,
      applications: 2,
      messages: 5
    });

    const fetchSavedProperties = async () => {
      try {
        const response = await fetch(`/api/v1/users/me`);
        const data = await response.json();
        setSavedProperties(data.favorite_properties || []);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
      }
    };

    fetchSavedProperties();

  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user.first_name || user.username}!
            </h1>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Renter
              </Badge>
              <span className="text-muted-foreground">Find your perfect home</span>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.savedProperties}</div>
              <p className="text-xs text-muted-foreground">Properties in your favorites</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Viewings Scheduled</CardTitle>
              <Calendar className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.viewingScheduled}</div>
              <p className="text-xs text-muted-foreground">Upcoming property tours</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <FileText className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.applications}</div>
              <p className="text-xs text-muted-foreground">Active rental applications</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.messages}</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Everything you need at your fingertips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-auto p-4 border border-border hover:border-primary"
                    asChild
                  >
                    <Link to={action.href}>
                      <action.icon className="h-5 w-5 mr-3 text-primary" />
                      <div className="text-left">
                        <div className="font-medium">{action.label}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest interactions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0">
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Sections */}
        <div className="mt-8">
          <Tabs defaultValue="saved" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-[400px]">
              <TabsTrigger value="saved">Saved Properties</TabsTrigger>
              <TabsTrigger value="viewings">Viewings</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>

            <TabsContent value="saved" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Saved Properties
                  </CardTitle>
                  <CardDescription>
                    Properties you've saved for later viewing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedProperties.map((property) => (
                      <Card key={property.id} className="border border-border hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                            <Home className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="font-semibold text-foreground mb-1">{property.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            {property.location}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-lg font-bold text-primary">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {property.price}/month
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {property.bedrooms}BR • {property.bathrooms}BA • {property.area}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {savedProperties.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No saved properties yet</p>
                      <p className="text-sm">Start browsing to save properties you like</p>
                      <Button className="mt-4" asChild>
                        <Link to="/listings">Browse Properties</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="viewings" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-green-500" />
                    Scheduled Viewings
                  </CardTitle>
                  <CardDescription>
                    Your upcoming property viewings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No viewings scheduled</p>
                    <p className="text-sm">Book viewings for properties you're interested in</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-yellow-500" />
                    Rental Applications
                  </CardTitle>
                  <CardDescription>
                    Track your rental application status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No applications submitted</p>
                    <p className="text-sm">Apply for properties you'd like to rent</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RenterDashboard;
