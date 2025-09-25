import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminStatsOverview from '@/components/dashboard/AdminStatsOverview';
import UserManagement from '@/components/dashboard/UserManagement';
import TourManagement from '@/components/dashboard/TourManagement';
import FlagsList from '@/components/moderation/FlagsList';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Home, 
  MessageSquare, 
  TrendingUp,
  Activity,
  UserCheck,
  UserX,
  Eye,
  Settings,
  BarChart3,
  PieChart,
  Calendar,
  AlertTriangle,
  DollarSign,
  Clock,
  MapPin
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalProfiles: 0,
    activeListings: 0,
    adminUsers: 0,
    guestUsers: 0,
    ownerUsers: 0,
    averagePrice: 0,
    totalRevenue: 0,
    tourRequests: 0,
    pendingTours: 0
  });
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      // Fetch profiles count and breakdown
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_type, role');

      // Fetch properties data
      const { data: properties } = await supabase
        .from('properties')
        .select('*');

      // Fetch tour requests data
      const { data: tourRequests } = await supabase
        .from('tour_requests')
        .select('*');

      if (profiles) {
        const userTypeBreakdown: Record<string, number> = profiles.reduce((acc, profile) => {
          acc[profile.user_type] = (acc[profile.user_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const avgPrice = properties?.length > 0 
          ? properties.reduce((sum, p) => sum + (p.price || 0), 0) / properties.length 
          : 0;

        const pendingToursCount = tourRequests?.filter(tour => tour.status === 'pending').length || 0;

        setStats({
          totalUsers: profiles.length,
          totalProperties: properties?.length || 0,
          totalProfiles: profiles.length,
          activeListings: properties?.length || 0,
          adminUsers: userTypeBreakdown.admin || 0,
          guestUsers: userTypeBreakdown.guest || 0,
          ownerUsers: userTypeBreakdown.owner || 0,
          averagePrice: Math.round(avgPrice),
          totalRevenue: Math.round(avgPrice * (properties?.length || 0)),
          tourRequests: tourRequests?.length || 0,
          pendingTours: pendingToursCount
        });

        setProperties(properties || []);
        setUsers(profiles || []);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentActivities = [
    { id: 1, action: "New property listed", user: "John Doe", time: "2 minutes ago", type: "property" },
    { id: 2, action: "User registration", user: "Jane Smith", time: "5 minutes ago", type: "user" },
    { id: 3, action: "Property approved", user: "Admin", time: "10 minutes ago", type: "approval" },
    { id: 4, action: "Message sent", user: "Mike Johnson", time: "15 minutes ago", type: "message" },
    { id: 5, action: "Property flagged", user: "System", time: "20 minutes ago", type: "flag" }
  ];

  const pendingApprovals = properties.slice(0, 3).map(property => ({
    id: property.id,
    title: property.title,
    owner: `Property ${property.id}`,
    submitted: new Date(property.created_at).toLocaleDateString(),
    status: "pending"
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4 w-48"></div>
              <div className="h-4 bg-gray-300 rounded mb-2 w-64"></div>
              <div className="h-4 bg-gray-300 rounded w-56"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, description, icon: Icon, trend, color = "default" }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${
          color === 'green' ? 'text-green-600' : 
          color === 'red' ? 'text-red-600' : 
          color === 'blue' ? 'text-blue-600' : 
          color === 'yellow' ? 'text-yellow-600' :
          'text-muted-foreground'
        }`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">
          {description}
          {trend && (
            <span className={`ml-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with MM Hub today.</p>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="tours">Tours</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Key Statistics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                description="Active platform users"
                icon={Users}
                color="blue"
                trend={8}
              />
              <StatCard
                title="Total Properties"
                value={stats.totalProperties}
                description="Listed properties"
                icon={Home}
                color="green"
                trend={12}
              />
              <StatCard
                title="Tour Requests"
                value={stats.tourRequests}
                description="Total tour requests"
                icon={Calendar}
                color="blue"
                trend={25}
              />
              <StatCard
                title="Pending Tours"
                value={stats.pendingTours}
                description="Awaiting approval"
                icon={Clock}
                color="yellow"
                trend={0}
              />
              <StatCard
                title="Average Price"
                value={stats.averagePrice}
                description="฿ per month"
                icon={DollarSign}
                color="default"
                trend={-2}
              />
            </div>

            {/* User Breakdown */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Type Distribution
                  </CardTitle>
                  <CardDescription>Breakdown of user types on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Admin Users</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">{stats.adminUsers}</Badge>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full" 
                            style={{ width: `${stats.totalUsers > 0 ? (stats.adminUsers / stats.totalUsers) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Property Owners</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{stats.ownerUsers}</Badge>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${stats.totalUsers > 0 ? (stats.ownerUsers / stats.totalUsers) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Guest Users</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{stats.guestUsers}</Badge>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gray-600 h-2 rounded-full" 
                            style={{ width: `${stats.totalUsers > 0 ? (stats.guestUsers / stats.totalUsers) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Platform Activity
                  </CardTitle>
                  <CardDescription>Latest actions across the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'property' ? 'bg-green-500' :
                            activity.type === 'user' ? 'bg-blue-500' :
                            activity.type === 'approval' ? 'bg-yellow-500' :
                            activity.type === 'message' ? 'bg-purple-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-gray-500">by {activity.user}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Properties Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Properties Overview
                </CardTitle>
                <CardDescription>Current property listings and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border border-green-200 rounded-lg bg-green-50">
                    <div className="text-2xl font-bold text-green-600">{stats.activeListings}</div>
                    <div className="text-sm text-green-700">Active Listings</div>
                  </div>
                  <div className="text-center p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <div className="text-2xl font-bold text-yellow-600">{pendingApprovals.length}</div>
                    <div className="text-sm text-yellow-700">Pending Approval</div>
                  </div>
                  <div className="text-center p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="text-2xl font-bold text-blue-600">฿{stats.averagePrice.toLocaleString()}</div>
                    <div className="text-sm text-blue-700">Average Monthly Rent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Property Management
                </CardTitle>
                <CardDescription>Manage property listings and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.activeListings}</div>
                    <div className="text-sm text-gray-600">Active Listings</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{pendingApprovals.length}</div>
                    <div className="text-sm text-gray-600">Pending Approval</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600">12</div>
                    <div className="text-sm text-gray-600">Flagged Properties</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Property Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      View All Properties
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Bulk Property Actions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tours Tab */}
          <TabsContent value="tours" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Tour Management
                </CardTitle>
                <CardDescription>Manage property tour requests and scheduling</CardDescription>
              </CardHeader>
              <CardContent>
                <TourManagement />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Growth Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border border-dashed rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Analytics chart will be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    User Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border border-dashed rounded-lg">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Pie chart will be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation" className="space-y-4">
            <FlagsList />
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Pending Approvals
                </CardTitle>
                <CardDescription>Review and approve property listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-600">by {item.owner}</p>
                        <p className="text-xs text-gray-400">Submitted: {item.submitted}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Review</Button>
                        <Button variant="default" size="sm">Approve</Button>
                        <Button variant="destructive" size="sm">Reject</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription>Configure platform settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Button variant="outline" className="h-20 flex-col">
                      <Users className="h-6 w-6 mb-2" />
                      User Settings
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Home className="h-6 w-6 mb-2" />
                      Property Settings
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <MessageSquare className="h-6 w-6 mb-2" />
                      Communication Settings
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      Payment Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;