import React from 'react';
import { Link } from 'react-router-dom';
import AuthStatus from '@/components/AuthStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, UserPlus, LogIn, Settings, Shield } from 'lucide-react';

const AuthTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold">
            <Home className="w-8 h-8 text-primary" />
            <span>RentHub</span>
          </Link>
          <h1 className="text-4xl font-bold">Authentication System Test</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This page helps test and debug the authentication system. Use the status panel below to monitor 
            authentication state and the action buttons to test different auth flows.
          </p>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Authentication Actions</span>
            </CardTitle>
            <CardDescription>
              Test different authentication flows and navigate to auth pages
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/auth/register">
              <Button className="w-full h-20 flex-col space-y-2" variant="outline">
                <UserPlus className="h-6 w-6" />
                <span>Register New Account</span>
              </Button>
            </Link>
            
            <Link to="/auth/login">
              <Button className="w-full h-20 flex-col space-y-2" variant="outline">
                <LogIn className="h-6 w-6" />
                <span>Login to Account</span>
              </Button>
            </Link>
            
            <Link to="/dashboard">
              <Button className="w-full h-20 flex-col space-y-2" variant="outline">
                <Settings className="h-6 w-6" />
                <span>Go to Dashboard</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Authentication Status */}
        <AuthStatus />

        {/* Testing Information */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Guide</CardTitle>
            <CardDescription>
              Follow these steps to thoroughly test the authentication system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium text-lg">Registration Flow</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Click "Register New Account" above</li>
                  <li>Fill in all required fields</li>
                  <li>Select a user role (renter/landlord/agent)</li>
                  <li>Accept terms and conditions</li>
                  <li>Submit the form</li>
                  <li>Check if you're immediately logged in or need email verification</li>
                </ol>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-lg">Login Flow</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Click "Login to Account" above</li>
                  <li>Enter your email and password</li>
                  <li>Submit the login form</li>
                  <li>Check if you're redirected to dashboard</li>
                  <li>Verify profile is created automatically</li>
                  <li>Test logout functionality</li>
                </ol>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium mb-2">Expected Behavior</h4>
              <ul className="text-sm space-y-1">
                <li>• <strong>Registration:</strong> Should create account and either immediately log in or require email verification</li>
                <li>• <strong>Login:</strong> Should authenticate and redirect to dashboard with profile created</li>
                <li>• <strong>Profile:</strong> Should auto-create profile with username, names, and role from registration</li>
                <li>• <strong>Session:</strong> Should persist across page refreshes until logout</li>
                <li>• <strong>Error Handling:</strong> Should show user-friendly messages for all error cases</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Debug Information */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
            <CardDescription>
              Current environment and configuration details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Frontend URLs</h4>
                <div className="space-y-1 font-mono text-xs">
                  <div>App: {window.location.origin}</div>
                  <div>Register: {window.location.origin}/auth/register</div>
                  <div>Login: {window.location.origin}/auth/login</div>
                  <div>Dashboard: {window.location.origin}/dashboard</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Supabase Configuration</h4>
                <div className="space-y-1 font-mono text-xs">
                  <div>URL: {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</div>
                  <div>Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthTestPage;