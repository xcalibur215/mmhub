import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Phone, Mail, MessageSquare, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface TourSchedulingProps {
  propertyId: number;
  propertyTitle: string;
  ownerId: string;
  onClose?: () => void;
}

const TourScheduling: React.FC<TourSchedulingProps> = ({ 
  propertyId, 
  propertyTitle, 
  ownerId, 
  onClose 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    requestedDate: '',
    requestedTime: '',
    message: '',
    contactMethod: 'phone',
    requesterName: user?.email?.split('@')[0] || '',
    requesterPhone: '',
    requesterEmail: user?.email || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to schedule a tour.",
        variant: "destructive"
      });
      return;
    }

    if (!supabase) {
      toast({
        title: "Error",
        description: "Unable to connect to the database.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('tour_requests')
        .insert([{
          property_id: propertyId,
          requester_id: user.id,
          owner_id: ownerId,
          requested_date: formData.requestedDate,
          requested_time: formData.requestedTime,
          message: formData.message,
          contact_method: formData.contactMethod,
          requester_name: formData.requesterName,
          requester_phone: formData.requesterPhone,
          requester_email: formData.requesterEmail
        }]);

      if (error) throw error;

      // Create notification for property owner
      await supabase
        .from('tour_notifications')
        .insert([{
          tour_request_id: null, // Will be updated after tour request is created
          recipient_id: ownerId,
          message: `New tour request for "${propertyTitle}" from ${formData.requesterName}`,
          notification_type: 'tour_request'
        }]);

      toast({
        title: "Tour request sent!",
        description: "The property owner will be notified and will contact you soon.",
      });

      if (onClose) onClose();
    } catch (error) {
      console.error('Error submitting tour request:', error);
      toast({
        title: "Error",
        description: "Failed to submit tour request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate time options (9 AM to 6 PM)
  const timeOptions = [];
  for (let hour = 9; hour <= 18; hour++) {
    const time12 = hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`;
    const time24 = `${hour.toString().padStart(2, '0')}:00`;
    timeOptions.push({ value: time24, label: time12 });
    
    if (hour < 18) {
      const halfTime12 = hour > 12 ? `${hour - 12}:30 PM` : hour === 12 ? '12:30 PM' : `${hour}:30 AM`;
      const halfTime24 = `${hour.toString().padStart(2, '0')}:30`;
      timeOptions.push({ value: halfTime24, label: halfTime12 });
    }
  }

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Schedule a Tour
        </CardTitle>
        <CardDescription>
          Request a viewing for "{propertyTitle}"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="requesterName">Your Name</Label>
              <Input
                id="requesterName"
                type="text"
                value={formData.requesterName}
                onChange={(e) => setFormData(prev => ({ ...prev, requesterName: e.target.value }))}
                required
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="requesterEmail">Email Address</Label>
              <Input
                id="requesterEmail"
                type="email"
                value={formData.requesterEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, requesterEmail: e.target.value }))}
                required
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="requesterPhone">Phone Number (Optional)</Label>
              <Input
                id="requesterPhone"
                type="tel"
                value={formData.requesterPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, requesterPhone: e.target.value }))}
                placeholder="+66 XX XXX XXXX"
                className="mt-1"
              />
            </div>
          </div>

          {/* Preferred Date */}
          <div>
            <Label htmlFor="requestedDate">Preferred Date</Label>
            <Input
              id="requestedDate"
              type="date"
              value={formData.requestedDate}
              onChange={(e) => setFormData(prev => ({ ...prev, requestedDate: e.target.value }))}
              min={minDate}
              required
              className="mt-1"
            />
          </div>

          {/* Preferred Time */}
          <div>
            <Label>Preferred Time</Label>
            <Select 
              value={formData.requestedTime} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, requestedTime: value }))}
              required
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preferred Contact Method */}
          <div>
            <Label>How should we contact you?</Label>
            <Select 
              value={formData.contactMethod} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, contactMethod: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Call
                  </div>
                </SelectItem>
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </SelectItem>
                <SelectItem value="message">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    In-app Message
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Additional Message (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Any specific requirements or questions about the property..."
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Submitting...' : 'Request Tour'}
            </Button>
            {onClose && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TourScheduling;