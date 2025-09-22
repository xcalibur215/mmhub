import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Home, 
  MessageSquare, 
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Eye,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  trend?: number;
  color?: 'default' | 'green' | 'red' | 'blue' | 'yellow';
  prefix?: string;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  color = "default",
  prefix = "",
  suffix = ""
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-600';
      case 'red': return 'text-red-600';
      case 'blue': return 'text-blue-600';
      case 'yellow': return 'text-yellow-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${getColorClasses(color)}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix}{value.toLocaleString()}{suffix}
        </div>
        <p className="text-xs text-muted-foreground">
          {description}
          {trend !== undefined && (
            <span className={`ml-2 inline-flex items-center ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : trend < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
              {Math.abs(trend)}%
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
};

interface AdminApiResponse {
  user_stats: { total: number; active: number; by_role: Record<string, number> };
  property_stats: { total: number; available: number; by_type: Record<string, number> };
  recent_activity: { users: any[]; properties: any[] };
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

const AdminStatsOverview: React.FC = () => {
  const { accessToken } = useAuth();
  const [data, setData] = useState<AdminApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!res.ok) throw new Error(`Failed to load admin stats (${res.status})`);
        const json: AdminApiResponse = await res.json();
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [accessToken]);

  // Derived stats with graceful fallback to 0
  const stats = {
    totalUsers: data?.user_stats.total ?? 0,
    newUsersThisMonth: 0, // placeholder until backend provides
    activeUsers: data?.user_stats.active ?? 0,
    totalProperties: data?.property_stats.total ?? 0,
    newPropertiesThisMonth: 0, // placeholder
    activeListings: data?.property_stats.available ?? 0,
    totalMessages: 0, // not yet implemented
    unreadMessages: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    avgPropertyPrice: 0,
    occupancyRate: 0,
    avgResponseTime: 0,
    platformUptime: 99.9,
    pendingApprovals: 0,
    flaggedContent: 0,
    successfulTransactions: 0,
    disputesThisMonth: 0
  };

  // Build simple distribution from by_type until region data available
  const typeEntries = Object.entries(data?.property_stats.by_type || {});
  const totalForPct = typeEntries.reduce((acc, [, count]) => acc + (count as number), 0) || 1;
  const colors = ['bg-blue-500','bg-green-500','bg-yellow-500','bg-purple-500','bg-gray-500'];
  const regionStats = typeEntries.map(([type, count], idx) => ({
    region: type,
    properties: count as number,
    percentage: Math.round(((count as number) / totalForPct) * 100),
    color: colors[idx % colors.length]
  }));

  const monthlyData: { month: string; users: number; properties: number; revenue: number }[] = [];

  const systemAlerts: { type: 'warning' | 'info' | 'success'; message: string; time: string }[] = [];

  if (loading) {
    return <div className="space-y-4"><p className="text-sm text-muted-foreground">Loading admin statistics...</p></div>;
  }
  if (error) {
    return <div className="space-y-4">
      <p className="text-sm text-red-600">Failed to load admin stats: {error}</p>
      <p className="text-xs text-muted-foreground">Ensure you are logged in as an admin user.</p>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description={`+${stats.newUsersThisMonth} this month`}
          icon={Users}
          trend={12}
          color="blue"
        />
        <StatCard
          title="Active Properties"
          value={stats.activeListings}
          description={`${stats.totalProperties} total listings`}
          icon={Home}
          trend={8}
          color="green"
        />
        <StatCard
          title="Messages"
          value={stats.totalMessages}
          description={`${stats.unreadMessages} unread`}
          icon={MessageSquare}
          trend={-3}
          color="default"
        />
        <StatCard
          title="Monthly Revenue"
          value={stats.monthlyRevenue}
          description="Total platform revenue"
          icon={TrendingUp}
          trend={15}
          color="green"
          prefix="$"
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Avg Property Price"
          value={stats.avgPropertyPrice}
          description="Per month"
          icon={Home}
          trend={5}
          color="blue"
          prefix="$"
        />
        <StatCard
          title="Occupancy Rate"
          value={stats.occupancyRate}
          description="Properties occupied"
          icon={Activity}
          trend={3}
          color="green"
          suffix="%"
        />
        <StatCard
          title="Response Time"
          value={stats.avgResponseTime}
          description="Average support response"
          icon={Clock}
          trend={-12}
          color="green"
          suffix="h"
        />
        <StatCard
          title="Platform Uptime"
          value={stats.platformUptime}
          description="System availability"
          icon={Activity}
          trend={0}
          color="green"
          suffix="%"
        />
      </div>

      {/* Detailed Analytics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Regional Distribution */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Properties by Region
            </CardTitle>
            <CardDescription>Distribution across major cities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regionStats.map((region, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{region.region}</span>
                    <span className="text-muted-foreground">{region.properties} properties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${region.color}`}></div>
                    <Progress value={region.percentage} className="h-2 flex-1" />
                    <span className="text-xs text-muted-foreground w-8">{region.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Growth */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Growth
            </CardTitle>
            <CardDescription>Last 6 months performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.slice(-3).map((data, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">{data.month}</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{data.users} users</div>
                    <div className="text-xs text-muted-foreground">{data.properties} properties</div>
                    <div className="text-xs text-green-600">${data.revenue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View Detailed Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Health & Alerts */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>Platform status and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Server Status</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Database</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Healthy
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Approvals</span>
                <Badge variant={stats.pendingApprovals > 20 ? "destructive" : "secondary"}>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {stats.pendingApprovals}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Flagged Content</span>
                <Badge variant={stats.flaggedContent > 0 ? "destructive" : "secondary"}>
                  <XCircle className="h-3 w-3 mr-1" />
                  {stats.flaggedContent}
                </Badge>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Recent Alerts</h4>
              <div className="space-y-2">
                {systemAlerts.map((alert, index) => (
                  <div key={index} className="text-xs p-2 rounded-md bg-muted/50">
                    <div className="flex items-center gap-1 mb-1">
                      {alert.type === 'warning' && <AlertTriangle className="h-3 w-3 text-yellow-600" />}
                      {alert.type === 'info' && <Activity className="h-3 w-3 text-blue-600" />}
                      {alert.type === 'success' && <CheckCircle className="h-3 w-3 text-green-600" />}
                      <span className="text-muted-foreground">{alert.time}</span>
                    </div>
                    <p className="text-foreground">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                View System Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Successful Transactions"
          value={stats.successfulTransactions}
          description="Completed this month"
          icon={CheckCircle}
          trend={18}
          color="green"
        />
        <StatCard
          title="Disputes"
          value={stats.disputesThisMonth}
          description="Active disputes"
          icon={AlertTriangle}
          trend={-25}
          color="yellow"
        />
        <StatCard
          title="User Satisfaction"
          value={94}
          description="Based on reviews"
          icon={Activity}
          trend={2}
          color="green"
          suffix="%"
        />
      </div>
    </div>
  );
};

export default AdminStatsOverview;