
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  MessageCircle, 
  Search,
  MapPin,
  DollarSign,
  Clock,
  Bell,
  Settings,
  Users,
  BarChart,
  PlusCircle
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

interface LandlordDashboardProps {
  user: User;
}

const LandlordDashboard = ({ user }: LandlordDashboardProps) => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    occupiedProperties: 0,
    totalTenants: 0,
    unreadMessages: 0
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "message",
      title: "New message from tenant",
      description: "John Doe reported a leaky faucet in Unit 101.",
      time: "1 hour ago",
      icon: MessageCircle,
      color: "text-blue-500"
    },
    {
      id: 2,
      type: "application",
      title: "New rental application",
      description: "Jane Smith applied for the 2-bedroom apartment.",
      time: "3 hours ago",
      icon: Users,
      color: "text-green-500"
    },
    {
      id: 3,
      type: "maintenance",
      title: "Maintenance request",
      description: "Unit 203: AC not working.",
      time: "1 day ago",
      icon: Clock,
      color: "text-yellow-500"
    }
  ]);

  const quickActions = [
    { icon: PlusCircle, label: "Add New Property", href: "/properties/new", description: "List a new property for rent" },
    { icon: Home, label: "My Properties", href: "/my-properties", description: "View and manage your properties" },
    { icon: MessageCircle, label: "Messages", href: "/messages", description: "Chat with tenants and applicants" },
    { icon: Users, label: "Tenants", href: "/tenants", description: "Manage your tenants" },
    { icon: BarChart, label: "Reports", href: "/reports", description: "View financial and occupancy reports" },
    { icon: Settings, label: "Settings", href: "/settings", description: "Manage your account settings" }
  ];

  const [myProperties, setMyProperties] = useState<any[]>([]);

  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalProperties: 5,
      occupiedProperties: 4,
      totalTenants: 12,
      unreadMessages: 3
    });

    const fetchMyProperties = async () => {
      try {
        const response = await fetch(`/api/v1/properties/my/properties`);
        const data = await response.json();
        setMyProperties(data || []);
      } catch (error) {
        console.error("Error fetching my properties:", error);
      }
    };

    fetchMyProperties();

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
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Landlord
              </Badge>
              <span className="text-muted-foreground">Manage your properties with ease</span>
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
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Home className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProperties}</div>
              <p className="text-xs text-muted-foreground">Properties you own</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupied Properties</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.occupiedProperties}</div>
              <p className="text-xs text-muted-foreground">Currently rented out</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
              <Users className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTenants}</div>
              <p className="text-xs text-muted-foreground">Across all properties</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unreadMessages}</div>
              <p className="text-xs text-muted-foreground">From tenants and applicants</p>
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
                Manage your properties efficiently
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
                Latest updates on your properties
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
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-[400px]">
              <TabsTrigger value="properties">My Properties</TabsTrigger>
              <TabsTrigger value="tenants">Tenants</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="h-5 w-5 mr-2 text-blue-500" />
                    My Properties
                  </CardTitle>
                  <CardDescription>
                    Overview of your rental properties
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myProperties.map((property) => (
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
                            <Badge variant={property.status === 'Occupied' ? 'default' : 'outline'}>
                              {property.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {myProperties.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No properties listed yet</p>
                      <p className="text-sm">Add your first property to get started</p>
                      <Button className="mt-4" asChild>
                        <Link to="/properties/new">Add Property</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tenants" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-green-500" />
                    My Tenants
                  </CardTitle>
                  <CardDescription>
                    List of your current tenants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No tenants yet</p>
                    <p className="text-sm">Your tenants will appear here once your properties are occupied</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-yellow-500" />
                    Financial Reports
                  </CardTitle>
                  <CardDescription>
                    Track your rental income and expenses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No financial data available</p>
                    <p className="text-sm">Reports will be generated as you receive payments</p>
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

export default LandlordDashboard;
