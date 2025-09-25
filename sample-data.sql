-- Sample data for MMHub database
-- Run this after the migration script to add test data

-- Insert sample bookings (assuming the referenced data exists)
INSERT INTO bookings (property_id, tenant_id, start_date, end_date, total_amount, status) VALUES
(1, 'a24119ff-a9ae-45eb-8ba2-78c6b0ed44ad', '2025-10-01', '2025-10-31', 45000.00, 'confirmed'),
(2, '08c80dd2-faf1-498e-bade-7b46737ab8c4', '2025-09-15', '2025-12-15', 54000.00, 'confirmed'),
(3, 'a24119ff-a9ae-45eb-8ba2-78c6b0ed44ad', '2025-11-01', '2025-11-30', 25000.00, 'pending')
ON CONFLICT DO NOTHING;

-- Insert sample favorites
INSERT INTO favorites (user_id, property_id) VALUES
('a24119ff-a9ae-45eb-8ba2-78c6b0ed44ad', 2),
('a24119ff-a9ae-45eb-8ba2-78c6b0ed44ad', 3),
('08c80dd2-faf1-498e-bade-7b46737ab8c4', 1)
ON CONFLICT (user_id, property_id) DO NOTHING;

-- Insert sample messages
INSERT INTO messages (sender_id, recipient_id, property_id, subject, content, is_read) VALUES
('a24119ff-a9ae-45eb-8ba2-78c6b0ed44ad', '4a226a98-3b6c-47b6-9922-9920b7e3229a', 1, 'Inquiry about Asoke Condo', 'Hi! I''m interested in your luxury condo in Asoke. Is it still available for October?', false),
('4a226a98-3b6c-47b6-9922-9920b7e3229a', 'a24119ff-a9ae-45eb-8ba2-78c6b0ed44ad', 1, 'Re: Inquiry about Asoke Condo', 'Yes, it''s available! Would you like to schedule a viewing?', true),
('08c80dd2-faf1-498e-bade-7b46737ab8c4', '4a226a98-3b6c-47b6-9922-9920b7e3229a', 2, 'Question about Studio', 'Is parking included with the studio near Chatuchak?', false)
ON CONFLICT DO NOTHING;

-- Update profiles to ensure user_type is set correctly
UPDATE profiles SET user_type = 'admin' WHERE username = 'admin';
UPDATE profiles SET user_type = 'owner' WHERE username IN ('alice_p', 'bob_s');
UPDATE profiles SET user_type = 'guest' WHERE user_type IS NULL OR user_type = '';

-- Insert additional properties if needed
INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, area_sqm, amenities, images, owner_id) VALUES
('Beachfront Villa in Phuket', 'Stunning 3-bedroom villa with private beach access in Patong. Perfect for vacation rentals with panoramic ocean views and modern amenities.', 95000.00, '456 Beach Road, Patong, Phuket 83150', 'villa', 3, 3, 180, 
'["Beach Access", "Ocean View", "Private Pool", "Air Conditioning", "WiFi", "Kitchen", "Parking"]'::jsonb,
'["https://images.unsplash.com/photo-1571896349842-33c89424de2d", "https://images.unsplash.com/photo-1578662996442-48f60103fc96"]'::jsonb,
'08c80dd2-faf1-498e-bade-7b46737ab8c4'),

('Modern Loft in Thonglor', 'Spacious 1-bedroom loft in trendy Thonglor district. Features high ceilings, modern design, and easy access to nightlife and restaurants.', 35000.00, '789 Thonglor Road, Watthana, Bangkok 10110', 'apartment', 1, 1, 55,
'["High Ceilings", "Modern Design", "Air Conditioning", "WiFi", "Near BTS", "Restaurants Nearby"]'::jsonb,
'["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"]'::jsonb,
'4a226a98-3b6c-47b6-9922-9920b7e3229a')
ON CONFLICT DO NOTHING;