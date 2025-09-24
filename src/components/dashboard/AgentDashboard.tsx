
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
  PlusCircle,
  Briefcase
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

interface AgentDashboardProps {
  user: User;
}

const AgentDashboard = ({ user }: AgentDashboardProps) => {
  const [stats, setStats] = useState({
    totalListings: 0,
    activeClients: 0,
    closedDeals: 0,
    unreadMessages: 0
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "message",
      title: "New inquiry for Sukhumvit Condo",
      description: "A potential tenant asked about the pet policy.",
      time: "30 minutes ago",
      icon: MessageCircle,
      color: "text-blue-500"
    },
    {
      id: 2,
      type: "client",
      title: "New client added",
      description: "Mr. Smith has been added to your client list.",
      time: "2 hours ago",
      icon: Users,
      color: "text-green-500"
    },
    {
      id: 3,
      type: "deal",
      title: "Deal closed for Silom Apartment",
      description: "Rental agreement signed with a new tenant.",
      time: "5 hours ago",
      icon: Briefcase,
      color: "text-purple-500"
    }
  ]);

  const quickActions = [
    { icon: PlusCircle, label: "Add New Listing", href: "/listings/new", description: "Add a new property to your portfolio" },
    { icon: Home, label: "My Listings", href: "/my-listings", description: "View and manage your property listings" },
    { icon: Users, label: "My Clients", href: "/my-clients", description: "Manage your landlord clients" },
    { icon: MessageCircle, label: "Messages", href: "/messages", description: "Chat with clients and tenants" },
    { icon: BarChart, label: "Performance", href: "/performance", description: "Track your deals and commissions" },
    { icon: Settings, label: "Settings", href: "/settings", description: "Manage your account settings" }
  ];

  interface ListingSummary {
    id: number;
    title: string;
    location?: string;
    price?: number;
    status?: string;
  }
  const [myListings, setMyListings] = useState<ListingSummary[]>([]);

  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalListings: 25,
      activeClients: 10,
      closedDeals: 8,
      unreadMessages: 7
    });

    const fetchMyListings = async () => {
      try {
        const response = await fetch(`/api/v1/properties/my/properties`);
        const data: ListingSummary[] = await response.json();
        setMyListings(data || []);
      } catch (error) {
        console.error("Error fetching my listings:", error);
      }
    };

    fetchMyListings();

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
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Agent
              </Badge>
              <span className="text-muted-foreground">Manage your real estate portfolio</span>
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
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Home className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalListings}</div>
              <p className="text-xs text-muted-foreground">Properties you manage</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeClients}</div>
              <p className="text-xs text-muted-foreground">Landlords you represent</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closed Deals (YTD)</CardTitle>
              <Briefcase className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.closedDeals}</div>
              <p className="text-xs text-muted-foreground">Rental agreements signed</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unreadMessages}</div>
              <p className="text-xs text-muted-foreground">From clients and tenants</p>
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
                Streamline your workflow
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
                Latest updates on your listings and clients
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
          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-[400px]">
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="clients">My Clients</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="listings" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="h-5 w-5 mr-2 text-blue-500" />
                    My Listings
                  </CardTitle>
                  <CardDescription>
                    Properties you are currently managing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myListings.map((property) => (
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
                            <Badge variant={property.status === 'Available' ? 'default' : 'outline'}>
                              {property.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {myListings.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No listings yet</p>
                      <p className="text-sm">Add your first listing to get started</p>
                      <Button className="mt-4" asChild>
                        <Link to="/listings/new">Add Listing</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-green-500" />
                    My Clients
                  </CardTitle>
                  <CardDescription>
                    List of your landlord clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No clients yet</p>
                    <p className="text-sm">Your clients will appear here once you add them</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-yellow-500" />
                    My Performance
                  </CardTitle>
                  <CardDescription>
                    Track your deals, commissions, and other metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No performance data available</p>
                    <p className="text-sm">Your performance metrics will be shown here</p>
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

export default AgentDashboard;
