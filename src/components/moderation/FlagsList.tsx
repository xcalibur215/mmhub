import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Flag,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Home,
  User
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const FlagsList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock flagged content data - in real app, this would come from API
  const flags = [
    {
      id: 1,
      type: 'property',
      contentId: 'prop_123',
      title: 'Luxury Downtown Apartment',
      reason: 'inappropriate_content',
      description: 'Property contains misleading information about amenities',
      reporter: 'user_456',
      reporterName: 'John Smith',
      reportDate: '2024-01-20',
      status: 'pending',
      priority: 'high',
      moderatorNotes: null
    },
    {
      id: 2,
      type: 'message',
      contentId: 'msg_789',
      title: 'Conversation thread with Mike Davis',
      reason: 'harassment',
      description: 'User sending inappropriate messages to landlord',
      reporter: 'user_101',
      reporterName: 'Sarah Johnson',
      reportDate: '2024-01-19',
      status: 'under_review',
      priority: 'high',
      moderatorNotes: 'Investigating conversation history'
    },
    {
      id: 3,
      type: 'user',
      contentId: 'user_333',
      title: 'User Profile: Tom Wilson',
      reason: 'fake_profile',
      description: 'Suspected fake profile with stolen photos',
      reporter: 'user_777',
      reporterName: 'Emma Davis',
      reportDate: '2024-01-18',
      status: 'resolved',
      priority: 'medium',
      moderatorNotes: 'Profile verified, false report'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under_review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'property':
        return Home;
      case 'message':
        return MessageSquare;
      case 'user':
        return User;
      default:
        return Flag;
    }
  };

  const filteredFlags = flags.filter(flag =>
    flag.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flag.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flag.reporterName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statCounts = {
    total: flags.length,
    pending: flags.filter(f => f.status === 'pending').length,
    underReview: flags.filter(f => f.status === 'under_review').length,
    critical: flags.filter(f => f.priority === 'critical').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Content Moderation
          </CardTitle>
          <CardDescription>Review flagged content and moderate platform violations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search flags..."
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flag Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Flags</p>
                <p className="text-2xl font-bold">{statCounts.total}</p>
              </div>
              <Flag className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{statCounts.pending}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                <p className="text-2xl font-bold">{statCounts.underReview}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Priority</p>
                <p className="text-2xl font-bold">{statCounts.critical}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flags List */}
      <Card>
        <CardHeader>
          <CardTitle>Flagged Content</CardTitle>
          <CardDescription>Review and take action on reported content violations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredFlags.map((flag) => {
              const TypeIcon = getTypeIcon(flag.type);
              return (
                <div key={flag.id} className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Type Icon */}
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <TypeIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    
                    {/* Flag Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-foreground">{flag.title}</h4>
                        <Badge variant="outline" className={getStatusColor(flag.status)}>
                          {flag.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(flag.priority)}>
                          {flag.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{flag.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Reason: {flag.reason.replace('_', ' ')}</span>
                        <span>Reporter: {flag.reporterName}</span>
                        <span>Date: {flag.reportDate}</span>
                      </div>
                      
                      {flag.moderatorNotes && (
                        <div className="mt-2 p-2 bg-accent/30 rounded text-xs">
                          <strong>Moderator Notes:</strong> {flag.moderatorNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {flag.status === 'pending' && (
                      <>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                        <Button variant="default" size="sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm">
                          <XCircle className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Reporter
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Flag className="h-4 w-4 mr-2" />
                          Mark as Resolved
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlagsList;