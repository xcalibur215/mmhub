import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrency } from '@/utils/currency';
import { 
  Home, 
  Heart, 
  MessageCircle, 
  FileText, 
  Building, 
  Users, 
  BarChart3,
  TrendingUp
} from 'lucide-react';

interface StatsOverviewProps {
  userRole: 'renter' | 'landlord' | 'agent';
}

const StatsOverview = ({ userRole }: StatsOverviewProps) => {
  const { formatPrice } = useCurrency();

  // Mock data based on user role
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

  const getRoleSpecificStats = () => {    
    switch (userRole) {
      case 'renter': {
        const roleStats = stats.renter;
        return [
          { 
            label: "Favorite Properties", 
            value: roleStats.favoriteProperties, 
            icon: Heart,
            description: "Properties you've saved",
            color: "text-red-600"
          },
          { 
            label: "Active Rentals", 
            value: roleStats.activeRentals, 
            icon: Home,
            description: "Currently renting",
            color: "text-blue-600"
          },
          { 
            label: "Applications", 
            value: roleStats.rentalApplications, 
            icon: FileText,
            description: "Pending applications",
            color: "text-green-600"
          },
          { 
            label: "Messages", 
            value: roleStats.messages, 
            icon: MessageCircle,
            description: "Unread messages",
            color: "text-purple-600"
          },
        ];
      }
      case 'landlord': {
        const roleStats = stats.landlord;
        return [
          { 
            label: "Active Listings", 
            value: roleStats.activeListings, 
            icon: Building,
            description: "Properties currently listed",
            color: "text-blue-600"
          },
          { 
            label: "New Inquiries", 
            value: roleStats.totalInquiries, 
            icon: MessageCircle,
            description: "This month",
            color: "text-green-600"
          },
          { 
            label: "Active Leases", 
            value: roleStats.activeLeases, 
            icon: FileText,
            description: "Properties with tenants",
            color: "text-purple-600"
          },
          { 
            label: "Monthly Revenue", 
            value: formatPrice(roleStats.monthlyRevenue), 
            icon: BarChart3,
            description: "Total rental income",
            color: "text-emerald-600"
          },
        ];
      }
      case 'agent': {
        const roleStats = stats.agent;
        return [
          { 
            label: "Managed Properties", 
            value: roleStats.managedProperties, 
            icon: Building,
            description: "Properties under management",
            color: "text-blue-600"
          },
          { 
            label: "Active Clients", 
            value: roleStats.activeClients, 
            icon: Users,
            description: "Current client relationships",
            color: "text-green-600"
          },
          { 
            label: "Monthly Commissions", 
            value: formatPrice(roleStats.monthlyCommissions), 
            icon: BarChart3,
            description: "This month's earnings",
            color: "text-emerald-600"
          },
          { 
            label: "Response Rate", 
            value: `${roleStats.responseRate}%`, 
            icon: TrendingUp,
            description: "Client satisfaction metric",
            color: "text-purple-600"
          },
        ];
      }
      default:
        return [];
    }
  };

  const roleStats = getRoleSpecificStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {roleStats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;