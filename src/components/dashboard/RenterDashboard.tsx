import { FC } from 'react';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface RenterDashboardProps {
  user: User;
  profile: UserProfile;
}

const RenterDashboard: FC<RenterDashboardProps> = ({ user, profile }) => {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Renter Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Find a Property
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Welcome, {profile.first_name || profile.username}!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Your Rental Journey</div>
            <p className="text-xs text-muted-foreground">
              Explore properties, manage applications, and more.
            </p>
          </CardContent>
        </Card>
        {/* More cards/widgets for renter-specific info */}
      </div>
    </div>
  );
};

export default RenterDashboard;
