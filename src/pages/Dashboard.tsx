import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsOverview from "@/components/dashboard/StatsOverview";
import { 
  Home, 
  Plus, 
  MessageCircle, 
  Heart, 
  FileText, 
  Settings,
  BarChart3,
  Calendar,
  Users,
  Building
} from "lucide-react";

const Dashboard = () => {
  // Mock user data - in real app this would come from auth context
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "renter", // renter, landlord, agent
  });

  const stats = {
    renter: {
      favoriteProperties: 12,
      activeRentals: 1,
      rentalApplications: 3,
      messages: 5,
    },
    landlord: {
      activeListings: 8,
      totalInquiries: 23,
      activeLeases: 15,
      monthlyRevenue: 45000,
    },
    agent: {
      managedProperties: 32,
      activeClients: 18,
      monthlyCommissions: 28500,
      responseRate: 94,
    }
  };

  const quickActions = {
    renter: [
      { icon: Home, label: "Browse Properties", href: "/listings" },
      { icon: Heart, label: "My Favorites", href: "/favorites" },
      { icon: MessageCircle, label: "Messages", href: "/messages" },
      { icon: FileText, label: "Rental Applications", href: "/applications" },
    ],
    landlord: [
      { icon: Plus, label: "Add Property", href: "/properties/new" },
      { icon: Building, label: "My Properties", href: "/properties" },
      { icon: Users, label: "Tenants", href: "/tenants" },
      { icon: BarChart3, label: "Analytics", href: "/analytics" },
    ],
    agent: [
      { icon: Building, label: "Managed Properties", href: "/properties" },
      { icon: Users, label: "Clients", href: "/clients" },
      { icon: MessageCircle, label: "Communications", href: "/messages" },
      { icon: Calendar, label: "Schedule", href: "/schedule" },
    ]
  };

  const recentActivity = [
    {
      id: 1,
      type: "message",
      title: "New message from Sarah Johnson",
      description: "Regarding the downtown apartment listing",
      time: "2 hours ago",
      icon: MessageCircle,
    },
    {
      id: 2,
      type: "favorite",
      title: "Property saved to favorites",
      description: "Modern loft in Capitol Hill",
      time: "1 day ago",
      icon: Heart,
    },
    {
      id: 3,
      type: "view",
      title: "Property viewed",
      description: "Spacious family home in Bellevue",
      time: "2 days ago",
      icon: Home,
    },
  ];

  const getRoleSpecificStats = () => {    
    switch (user.role) {
      case 'renter': {
        const roleStats = stats.renter;
        return [
          { label: "Favorite Properties", value: roleStats.favoriteProperties, icon: Heart },
          { label: "Active Rentals", value: roleStats.activeRentals, icon: Home },
          { label: "Rental Applications", value: roleStats.rentalApplications, icon: FileText },
          { label: "Unread Messages", value: roleStats.messages, icon: MessageCircle },
        ];
      }
      case 'landlord': {
        const roleStats = stats.landlord;
        return [
          { label: "Active Listings", value: roleStats.activeListings, icon: Building },
          { label: "New Inquiries", value: roleStats.totalInquiries, icon: MessageCircle },
          { label: "Active Leases", value: roleStats.activeLeases, icon: FileText },
          { label: "Monthly Revenue", value: `฿${roleStats.monthlyRevenue.toLocaleString()}`, icon: BarChart3 },
        ];
      }
      case 'agent': {
        const roleStats = stats.agent;
        return [
          { label: "Managed Properties", value: roleStats.managedProperties, icon: Building },
          { label: "Active Clients", value: roleStats.activeClients, icon: Users },
          { label: "Monthly Commissions", value: `฿${roleStats.monthlyCommissions.toLocaleString()}`, icon: BarChart3 },
          { label: "Response Rate", value: `${roleStats.responseRate}%`, icon: MessageCircle },
        ];
      }
      default:
        return [];
    }
  };

  const capitalizeRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user.name}
            </h1>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {capitalizeRole(user.role)}
              </Badge>
              <span className="text-muted-foreground">{user.email}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/settings">
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </a>
          </Button>
        </div>

        {/* Stats Overview */}
        <StatsOverview userRole={user.role as 'renter' | 'landlord' | 'agent'} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks for {user.role}s
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions[user.role as keyof typeof quickActions].map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto py-3"
                  asChild
                >
                  <a href={action.href}>
                    <action.icon className="w-5 h-5 mr-3" />
                    <span>{action.label}</span>
                  </a>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest interactions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <activity.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {activity.description}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs for Different Roles */}
        <div className="mt-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Overview</CardTitle>
                  <CardDescription>
                    Your complete rental management overview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Welcome to Your Dashboard
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      This is your central hub for managing all rental activities. 
                      Use the quick actions on the left to get started.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Properties</CardTitle>
                  <CardDescription>
                    Manage your property listings and favorites
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Property Management
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      View and manage your properties here.
                    </p>
                    <Button variant="hero" asChild>
                      <a href="/listings">Browse Properties</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>
                    Communication with landlords, tenants, and agents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Message Center
                    </h3>
                    <p className="text-muted-foreground">
                      All your conversations will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Lease agreements, applications, and important documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Document Management
                    </h3>
                    <p className="text-muted-foreground">
                      Upload and manage important rental documents.
                    </p>
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

export default Dashboard;