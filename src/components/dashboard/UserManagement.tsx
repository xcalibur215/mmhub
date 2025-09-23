import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  Mail,
  Shield,
  Ban,
  CheckCircle
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock user data - in real app, this would come from API
  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'renter',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      properties: 0,
      avatar: null
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      role: 'landlord',
      status: 'active',
      joinDate: '2023-11-22',
      lastActive: '1 day ago',
      properties: 8,
      avatar: null
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.davis@example.com',
      role: 'agent',
      status: 'inactive',
      joinDate: '2023-08-10',
      lastActive: '1 week ago',
      properties: 15,
      avatar: null
    },
    {
      id: 4,
      name: 'Emily Wilson',
      email: 'emily.w@example.com',
      role: 'renter',
      status: 'suspended',
      joinDate: '2024-02-03',
      lastActive: '3 days ago',
      properties: 0,
      avatar: null
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@example.com',
      role: 'landlord',
      status: 'active',
      joinDate: '2023-12-05',
      lastActive: '5 minutes ago',
      properties: 12,
      avatar: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'landlord':
        return 'bg-blue-100 text-blue-800';
      case 'agent':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>Manage platform users, roles, and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="default" size="sm">
                <UserCheck className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">1,089</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New This Week</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Ban className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Complete list of platform users with management options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-4">
                  {/* Avatar placeholder */}
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-muted-foreground" />
                  </div>
                  
                  {/* User Info */}
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-foreground">{user.name}</h4>
                      <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                      <span>Joined: {user.joinDate}</span>
                      <span>Last active: {user.lastActive}</span>
                      <span>Properties: {user.properties}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Shield className="h-4 w-4 mr-2" />
                      Change Role
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserCheck className="h-4 w-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Ban className="h-4 w-4 mr-2" />
                      Suspend User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;