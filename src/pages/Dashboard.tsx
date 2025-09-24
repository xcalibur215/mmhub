import { useAuth } from "@/context/AuthContext";
import RenterDashboard from "@/components/dashboard/RenterDashboard";
import LandlordDashboard from "@/components/dashboard/LandlordDashboard";
import AgentDashboard from "@/components/dashboard/AgentDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You must be logged in to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please log in to continue.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  switch (profile.role) {
    case 'renter':
      return <RenterDashboard user={user} profile={profile} />;
    case 'landlord':
      return <LandlordDashboard user={user} profile={profile} />;
    case 'agent':
      return <AgentDashboard user={user} profile={profile} />;
    default:
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Unknown Role</CardTitle>
            <CardDescription>
                Your account role is not recognized.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <span>Current role:</span>
                <Badge variant="outline">{profile.role}</Badge>
              </div>
              <p className="text-muted-foreground">
                Please contact support for assistance.
              </p>
            </CardContent>
          </Card>
        </div>
      );
  }
};

export default Dashboard;
