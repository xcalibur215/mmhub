-- Remove booking functionality and add tour scheduling
-- Run this after the main database-migration.sql

-- 1. Drop existing booking-related tables and triggers
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;

-- Remove booking-related triggers if they exist
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;

-- 2. Create tour_requests table for scheduling property tours
CREATE TABLE IF NOT EXISTS tour_requests (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_date DATE NOT NULL,
  requested_time TIME NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'rejected')),
  contact_method TEXT DEFAULT 'phone' CHECK (contact_method IN ('phone', 'email', 'message')),
  requester_name VARCHAR(255) NOT NULL,
  requester_phone VARCHAR(20),
  requester_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_future_date CHECK (requested_date >= CURRENT_DATE)
);

-- 3. Create property_reviews table (simplified, not tied to bookings)
CREATE TABLE IF NOT EXISTS property_reviews (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  reviewer_name VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create tour_notifications table for admin dashboard
CREATE TABLE IF NOT EXISTS tour_notifications (
  id SERIAL PRIMARY KEY,
  tour_request_id INTEGER REFERENCES tour_requests(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  notification_type TEXT DEFAULT 'tour_request' CHECK (notification_type IN ('tour_request', 'tour_confirmed', 'tour_cancelled', 'tour_completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tour_requests_property_id ON tour_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_tour_requests_requester_id ON tour_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_tour_requests_owner_id ON tour_requests(owner_id);
CREATE INDEX IF NOT EXISTS idx_tour_requests_status ON tour_requests(status);
CREATE INDEX IF NOT EXISTS idx_tour_requests_date ON tour_requests(requested_date);

CREATE INDEX IF NOT EXISTS idx_property_reviews_property_id ON property_reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_property_reviews_reviewer_id ON property_reviews(reviewer_id);

CREATE INDEX IF NOT EXISTS idx_tour_notifications_recipient_id ON tour_notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_tour_notifications_is_read ON tour_notifications(is_read);

-- 6. Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_tour_requests_updated_at ON tour_requests;
CREATE TRIGGER update_tour_requests_updated_at 
  BEFORE UPDATE ON tour_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_property_reviews_updated_at ON property_reviews;
CREATE TRIGGER update_property_reviews_updated_at 
  BEFORE UPDATE ON property_reviews 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Enable RLS on new tables
ALTER TABLE tour_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_notifications ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies

-- Tour requests policies
CREATE POLICY "Users can view their own tour requests" ON tour_requests FOR SELECT USING (requester_id = auth.uid());
CREATE POLICY "Property owners can view tour requests for their properties" ON tour_requests FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Admins can view all tour requests" ON tour_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.user_type = 'admin'))
);

CREATE POLICY "Users can create tour requests" ON tour_requests FOR INSERT WITH CHECK (requester_id = auth.uid());
CREATE POLICY "Property owners can update tour requests for their properties" ON tour_requests FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Admins can update all tour requests" ON tour_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.user_type = 'admin'))
);

-- Property reviews policies
CREATE POLICY "Anyone can view reviews" ON property_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON property_reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());
CREATE POLICY "Users can update their own reviews" ON property_reviews FOR UPDATE USING (reviewer_id = auth.uid());
CREATE POLICY "Admins can update all reviews" ON property_reviews FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.user_type = 'admin'))
);

-- Tour notifications policies
CREATE POLICY "Users can view their own notifications" ON tour_notifications FOR SELECT USING (recipient_id = auth.uid());
CREATE POLICY "System can create notifications" ON tour_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own notifications" ON tour_notifications FOR UPDATE USING (recipient_id = auth.uid());