import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminStatsOverview from '@/components/dashboard/AdminStatsOverview';
import UserManagement from '@/components/dashboard/UserManagement';
import FlagsList from '@/components/moderation/FlagsList';
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
  AlertTriangle
} from 'lucide-react';

const AdminDashboard = () => {
  // Mock data - in real app, this would come from API
  const stats = {
    totalUsers: 1247,
    totalProperties: 856,
    totalMessages: 3421,
    totalRevenue: 45678,
    activeListings: 634,
    pendingApprovals: 23,
    newUsersToday: 12,
    messagesUnread: 67
  };

  const recentActivities = [
    { id: 1, action: "New property listed", user: "John Doe", time: "2 minutes ago", type: "property" },
    { id: 2, action: "User registration", user: "Jane Smith", time: "5 minutes ago", type: "user" },
    { id: 3, action: "Property approved", user: "Admin", time: "10 minutes ago", type: "approval" },
    { id: 4, action: "Message sent", user: "Mike Johnson", time: "15 minutes ago", type: "message" },
    { id: 5, action: "Property flagged", user: "System", time: "20 minutes ago", type: "flag" }
  ];

  const pendingApprovals = [
    { id: 1, title: "Luxury Downtown Apartment", owner: "Sarah Wilson", submitted: "2024-01-15", status: "pending" },
    { id: 2, title: "Cozy Studio Near Campus", owner: "Tom Brown", submitted: "2024-01-14", status: "pending" },
    { id: 3, title: "Family Home with Garden", owner: "Lisa Davis", submitted: "2024-01-13", status: "pending" }
  ];

  const StatCard = ({ title, value, description, icon: Icon, trend, color = "default" }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color === 'green' ? 'text-green-600' : color === 'red' ? 'text-red-600' : color === 'blue' ? 'text-blue-600' : 'text-muted-foreground'}`} />
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
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <AdminStatsOverview />
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
                    <div className="text-2xl font-bold text-yellow-600">{stats.pendingApprovals}</div>
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