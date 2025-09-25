import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface TourRequest {
  id: number;
  property_id: number;
  requester_id: string;
  owner_id: string;
  requested_date: string;
  requested_time: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
  contact_method: 'phone' | 'email' | 'message';
  requester_name: string;
  requester_phone?: string;
  requester_email: string;
  created_at: string;
  property?: {
    title: string;
    location: string;
    property_type: string;
  };
}

const TourManagement: React.FC = () => {
  const [tourRequests, setTourRequests] = useState<TourRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTourRequests();
  }, []);

  const fetchTourRequests = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tour_requests')
        .select(`
          *,
          property:properties(
            title,
            location,
            property_type
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTourRequests(data || []);
      
      // Calculate stats
      const newStats = (data || []).reduce((acc, tour) => {
        acc.total++;
        acc[tour.status as keyof typeof acc]++;
        return acc;
      }, { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, rejected: 0 });

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching tour requests:', error);
      toast({
        title: "Error",
        description: "Failed to load tour requests.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTourStatus = async (tourId: number, status: string) => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('tour_requests')
        .update({ status })
        .eq('id', tourId);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Tour request has been ${status}.`,
      });

      fetchTourRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating tour status:', error);
      toast({
        title: "Error",
        description: "Failed to update tour status.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hour), parseInt(minute));
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const StatCard = ({ title, value, color = "default" }) => (
    <Card>
      <CardContent className="p-4">
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            color === 'yellow' ? 'text-yellow-600' : 
            color === 'blue' ? 'text-blue-600' :
            color === 'green' ? 'text-green-600' :
            color === 'red' ? 'text-red-600' :
            'text-gray-600'
          }`}>
            {value}
          </div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
      </CardContent>
    </Card>
  );

  const TourRequestCard = ({ tour }: { tour: TourRequest }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-lg">
                {tour.property?.title || `Property #${tour.property_id}`}
              </h4>
              <Badge className={`${getStatusColor(tour.status)} border-0`}>
                {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              {tour.property?.location} • {tour.property?.property_type}
            </p>
            <p className="text-sm text-gray-500">
              Requested {formatDate(tour.created_at)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Requester Info */}
          <div className="space-y-2">
            <h5 className="font-medium text-sm text-gray-700">Requester Details</h5>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>{tour.requester_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{tour.requester_email}</span>
              </div>
              {tour.requester_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{tour.requester_phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span className="capitalize">{tour.contact_method}</span>
              </div>
            </div>
          </div>

          {/* Tour Details */}
          <div className="space-y-2">
            <h5 className="font-medium text-sm text-gray-700">Tour Details</h5>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{formatDate(tour.requested_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>{formatTime(tour.requested_time)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {tour.message && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-sm text-gray-700 mb-1">Message</h5>
            <p className="text-sm text-gray-600">{tour.message}</p>
          </div>
        )}

        {/* Actions */}
        {tour.status === 'pending' && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => updateTourStatus(tour.id, 'confirmed')}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Confirm
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => updateTourStatus(tour.id, 'rejected')}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        )}

        {tour.status === 'confirmed' && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => updateTourStatus(tour.id, 'completed')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark Complete
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => updateTourStatus(tour.id, 'cancelled')}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-20 rounded-lg"></div>
            </div>
          ))}
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const pendingTours = tourRequests.filter(tour => tour.status === 'pending');
  const confirmedTours = tourRequests.filter(tour => tour.status === 'confirmed');
  const completedTours = tourRequests.filter(tour => tour.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Total Requests" value={stats.total} />
        <StatCard title="Pending" value={stats.pending} color="yellow" />
        <StatCard title="Confirmed" value={stats.confirmed} color="blue" />
        <StatCard title="Completed" value={stats.completed} color="green" />
        <StatCard title="Cancelled" value={stats.cancelled + (stats as any).rejected} color="red" />
      </div>

      {/* Tour Requests Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pending ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed ({stats.confirmed})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({stats.completed})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({stats.total})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="space-y-4">
            {pendingTours.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>No pending tour requests</p>
                </CardContent>
              </Card>
            ) : (
              pendingTours.map(tour => (
                <TourRequestCard key={tour.id} tour={tour} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="confirmed" className="mt-6">
          <div className="space-y-4">
            {confirmedTours.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>No confirmed tour requests</p>
                </CardContent>
              </Card>
            ) : (
              confirmedTours.map(tour => (
                <TourRequestCard key={tour.id} tour={tour} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="space-y-4">
            {completedTours.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  <Eye className="h-8 w-8 mx-auto mb-2" />
                  <p>No completed tours</p>
                </CardContent>
              </Card>
            ) : (
              completedTours.map(tour => (
                <TourRequestCard key={tour.id} tour={tour} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {tourRequests.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2" />
                  <p>No tour requests yet</p>
                </CardContent>
              </Card>
            ) : (
              tourRequests.map(tour => (
                <TourRequestCard key={tour.id} tour={tour} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TourManagement;