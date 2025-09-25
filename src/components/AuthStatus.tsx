import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Shield, Clock, Database } from 'lucide-react';

const AuthStatus: React.FC = () => {
  const { user, profile, session, isLoading, isAdmin, logout } = useAuth();

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Clock className="animate-spin h-4 w-4" />
            <span>Loading authentication status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Authentication Status</span>
        </CardTitle>
        <CardDescription>
          Current authentication and profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Status */}
        <div className="flex items-center justify-between">
          <span className="font-medium">User Status:</span>
          <Badge variant={user ? "default" : "secondary"}>
            {user ? "Authenticated" : "Not Authenticated"}
          </Badge>
        </div>

        {/* Session Status */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Session Status:</span>
          <Badge variant={session ? "default" : "secondary"}>
            {session ? "Active" : "No Session"}
          </Badge>
        </div>

        {/* Profile Status */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Profile Status:</span>
          <Badge variant={profile ? "default" : "destructive"}>
            {profile ? "Profile Loaded" : "No Profile"}
          </Badge>
        </div>

        {/* Admin Status */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Admin Status:</span>
          <Badge variant={isAdmin ? "default" : "secondary"}>
            {isAdmin ? "Admin User" : "Regular User"}
          </Badge>
        </div>

        {/* User Details */}
        {user && (
          <div className="space-y-2 p-3 bg-muted rounded-lg">
            <h4 className="font-medium flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>User Details</span>
            </h4>
            <div className="text-sm space-y-1">
              <div><strong>ID:</strong> {user.id}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Email Confirmed:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</div>
              <div><strong>Last Sign In:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}</div>
            </div>
          </div>
        )}

        {/* Profile Details */}
        {profile && (
          <div className="space-y-2 p-3 bg-muted rounded-lg">
            <h4 className="font-medium flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Profile Details</span>
            </h4>
            <div className="text-sm space-y-1">
              <div><strong>Username:</strong> {profile.username}</div>
              <div><strong>Name:</strong> {profile.first_name} {profile.last_name}</div>
              <div><strong>Role:</strong> {profile.role}</div>
              <div><strong>User Type:</strong> {profile.user_type}</div>
              {profile.phone && <div><strong>Phone:</strong> {profile.phone}</div>}
              {profile.location && <div><strong>Location:</strong> {profile.location}</div>}
            </div>
          </div>
        )}

        {/* Session Details */}
        {session && (
          <div className="space-y-2 p-3 bg-muted rounded-lg">
            <h4 className="font-medium">Session Details</h4>
            <div className="text-sm space-y-1">
              <div><strong>Expires:</strong> {new Date(session.expires_at * 1000).toLocaleString()}</div>
              <div><strong>Token Type:</strong> {session.token_type}</div>
              <div><strong>Access Token:</strong> {session.access_token.substring(0, 20)}...</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          {user && (
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthStatus;