import { Card, CardContent } from "@/components/ui/card";
import { 
  Building, 
  FileCheck, 
  Key, 
  TrendingUp,
  Heart,
  MessageCircle 
} from "lucide-react";

interface StatCard {
  label: string;
  value: string | number;
  icon: any;
}

interface StatsOverviewProps {
  userRole: 'renter' | 'landlord' | 'agent';
}

const StatsOverview = ({ userRole }: StatsOverviewProps) => {
  // Mock data - in real app this would come from API
  const getMockStats = (): StatCard[] => {
    switch (userRole) {
      case 'renter':
        return [
          { label: "Favorite Properties", value: 12, icon: Heart },
          { label: "Active Rentals", value: 1, icon: Key },
          { label: "Rental Applications", value: 3, icon: FileCheck },
          { label: "Messages", value: 8, icon: MessageCircle },
        ];
      case 'landlord':
        return [
          { label: "Active Listings", value: 18, icon: Building },
          { label: "Successful Leases", value: 12, icon: FileCheck },
          { label: "Active Tenancies", value: 5, icon: Key },
          { label: "Monthly Revenue", value: "฿45,000", icon: TrendingUp },
        ];
      case 'agent':
        return [
          { label: "Managed Properties", value: 32, icon: Building },
          { label: "Active Clients", value: 18, icon: MessageCircle },
          { label: "Completed Deals", value: 24, icon: FileCheck },
          { label: "Monthly Commissions", value: "฿28,500", icon: TrendingUp },
        ];
      default:
        return [];
    }
  };

  const stats = getMockStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-card transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;