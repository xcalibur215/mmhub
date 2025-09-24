import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Home, 
  MessageSquare, 
  TrendingUp,
  Activity,
  UserCheck,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

const AdminStatsOverview = () => {
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

  const StatCard = ({ title, value, description, icon: Icon, trend, color = "default" }: {
    title: string;
    value: string | number;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    trend?: number;
    color?: string;
  }) => (
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
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description="All registered users"
          icon={Users}
          trend={8.2}
          color="blue"
        />
        <StatCard
          title="Active Properties"
          value={stats.activeListings}
          description="Currently listed properties"
          icon={Home}
          trend={12.5}
          color="green"
        />
        <StatCard
          title="Total Messages"
          value={stats.totalMessages}
          description="All platform messages"
          icon={MessageSquare}
          trend={-2.1}
          color="default"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          description="Properties awaiting approval"
          icon={AlertTriangle}
          trend={-5.4}
          color="red"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="New Users Today"
          value={stats.newUsersToday}
          description="User registrations today"
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Unread Messages"
          value={stats.messagesUnread}
          description="Messages requiring attention"
          icon={MessageSquare}
          color="default"
        />
        <StatCard
          title="Revenue (Monthly)"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          description="Platform revenue this month"
          icon={TrendingUp}
          trend={15.3}
          color="green"
        />
        <StatCard
          title="System Activity"
          value="94%"
          description="Platform uptime"
          icon={Activity}
          color="green"
        />
      </div>

      {/* Activity Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Platform Activity Overview
          </CardTitle>
          <CardDescription>Key metrics and system health at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">98.5%</div>
              <div className="text-sm text-muted-foreground">System Uptime</div>
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">4.8s</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">156</div>
              <div className="text-sm text-muted-foreground">Active Sessions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatsOverview;