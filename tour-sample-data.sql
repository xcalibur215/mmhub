-- Sample tour requests data
-- Run this after tour-migration.sql to populate sample data

-- Sample tour requests
INSERT INTO tour_requests (property_id, requester_id, owner_id, requested_date, requested_time, message, status, contact_method, requester_name, requester_phone, requester_email) VALUES
(1, 'a24119ff-a9ae-45eb-8ba2-78c6b0ed44ad', '4a226a98-3b6c-47b6-9922-9920b7e3229a', '2024-02-01', '14:00', 'Hi, I would like to schedule a tour for this beautiful condo. I am available on weekends as well.', 'pending', 'phone', 'John Smith', '+66-89-123-4567', 'john.smith@example.com'),
(2, 'a24119ff-a9ae-45eb-8ba2-78c6b0ed44ad', '4a226a98-3b6c-47b6-9922-9920b7e3229a', '2024-01-28', '10:30', 'Looking for a family home. Can we schedule a tour this week?', 'confirmed', 'email', 'Sarah Johnson', '+66-82-987-6543', 'sarah.j@example.com'),
(3, 'a24119ff-a9ae-45eb-8ba2-78c6b0ed44ad', '4a226a98-3b6c-47b6-9922-9920b7e3229a', '2024-01-30', '16:00', 'Interested in this modern apartment for young professionals.', 'completed', 'message', 'Mike Chen', NULL, 'mike.chen@example.com'),
(1, 'a24119ff-a9ae-45eb-8ba2-78c6b0ed44ad', '4a226a98-3b6c-47b6-9922-9920b7e3229a', '2024-02-03', '11:00', 'I work nearby and this location looks perfect. Available for weekend tours too.', 'pending', 'phone', 'Lisa Wong', '+66-88-555-0123', 'lisa.wong@example.com'),
(4, 'a24119ff-a9ae-45eb-8ba2-78c6b0ed44ad', '4a226a98-3b6c-47b6-9922-9920b7e3229a', '2024-01-25', '13:30', NULL, 'cancelled', 'email', 'David Park', NULL, 'david.park@example.com');

-- Sample property reviews (not tied to bookings anymore)
INSERT INTO property_reviews (property_id, reviewer_id, rating, review_text, reviewer_name, is_verified) VALUES
(1, 'a24119ff-a9ae-45eb-8ba2-78c6b0ed44ad', 5, 'Amazing condo with great city views! The owner was very responsive and the tour was well organized. Highly recommend for anyone looking for luxury living in downtown Bangkok.', 'John Smith', true),
(2, 'a24119ff-a9ae-45eb-8ba2-78c6b0ed44ad', 4, 'Nice family house with a good-sized garden. Kids love the space. Only minor issue was parking could be better, but overall very satisfied with our tour experience.', 'Sarah Johnson', true),
(3, 'a24119ff-a9ae-45eb-8ba2-78c6b0ed44ad', 4, 'Perfect for young professionals. Modern amenities and close to BTS station. Property owner was punctual and answered all our questions during the tour.', 'Mike Chen', false),
(1, 'a24119ff-a9ae-45eb-8ba2-78c6b0ed44ad', 5, 'Excellent property! The tour was comprehensive and the owner provided all the details we needed. Would definitely recommend scheduling a visit.', 'Lisa Wong', true);

-- Sample tour notifications
INSERT INTO tour_notifications (tour_request_id, recipient_id, message, notification_type, is_read) VALUES
(1, '4a226a98-3b6c-47b6-9922-9920b7e3229a', 'New tour request for "Luxury Downtown Condo" from John Smith', 'tour_request', false),
(2, '4a226a98-3b6c-47b6-9922-9920b7e3229a', 'New tour request for "Family House with Garden" from Sarah Johnson', 'tour_request', true),
(3, '4a226a98-3b6c-47b6-9922-9920b7e3229a', 'New tour request for "Modern Apartment Complex" from Mike Chen', 'tour_request', true),
(4, '4a226a98-3b6c-47b6-9922-9920b7e3229a', 'New tour request for "Luxury Downtown Condo" from Lisa Wong', 'tour_request', false),
(2, 'a24119ff-a9ae-45eb-8ba2-78c6b0ed44ad', 'Your tour request for "Family House with Garden" has been confirmed', 'tour_confirmed', false),
(3, 'a24119ff-a9ae-45eb-8ba2-78c6b0ed44ad', 'Your tour for "Modern Apartment Complex" has been completed', 'tour_completed', true);