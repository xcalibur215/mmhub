-- =====================================================
-- MMHub - Comprehensive Realistic Dummy Data
-- =====================================================
-- This file contains realistic test data for apartments, condos, villas, 
-- studios, and houses in various Bangkok locations
-- Run this after database-migration.sql and tour-migration.sql

-- =====================================================
-- 1. SAMPLE USERS & PROFILES
-- =====================================================

-- Insert sample users (if they don't exist)
-- Note: You may need to create these users through Supabase Auth UI first
-- These are example UUIDs - replace with actual user IDs from your auth.users table

-- Sample Owner IDs (replace with your actual user IDs)
-- Owner 1: alice_owner (Luxury properties)
-- Owner 2: bob_landlord (Mid-range properties)
-- Owner 3: charlie_estate (Budget-friendly options)
-- Owner 4: diana_properties (Premium villas)

-- Update profiles with realistic data
UPDATE profiles SET 
  first_name = 'Alice',
  last_name = 'Thompson',
  bio = 'Luxury property owner with 10+ years of experience in Bangkok real estate.',
  phone = '+66 82 123 4567',
  location = 'Sukhumvit, Bangkok'
WHERE username = 'alice_p';

UPDATE profiles SET 
  first_name = 'Bob',
  last_name = 'Stevens',
  bio = 'Professional landlord managing quality mid-range properties across Bangkok.',
  phone = '+66 81 234 5678',
  location = 'Thonglor, Bangkok'
WHERE username = 'bob_s';

-- =====================================================
-- 2. LUXURY CONDOS & APARTMENTS (50,000 - 150,000 THB)
-- =====================================================

INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, area_sqm, amenities, images, is_available, owner_id) VALUES

-- Sukhumvit Area
('Luxury Penthouse at The Diplomat', 
'Stunning 3-bedroom penthouse with panoramic city views. Located in the heart of Sukhumvit, this fully furnished unit features premium appliances, marble flooring, and floor-to-ceiling windows. Building amenities include 24/7 security, fitness center, infinity pool, and sky lounge.',
145000.00, '39 Sukhumvit Soi 11, Khlong Toei Nuea, Watthana, Bangkok 10110', 'condo', 3, 3, 220,
'["Fully Furnished", "City View", "Infinity Pool", "Gym", "24/7 Security", "Parking", "WiFi", "Air Conditioning", "Balcony", "Elevator", "CCTV", "Pet Friendly"]'::jsonb,
'["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", "https://images.unsplash.com/photo-1502672260066-6bc35f0b1e1e?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1)),

('Modern 2BR at Quattro by Sansiri', 
'Contemporary 2-bedroom condo with elegant design and premium finishes. Features include built-in kitchen, walk-in closet, and private balcony overlooking the pool. Perfect for professionals or small families. Near BTS Thong Lo.',
85000.00, '11 Sukhumvit 55 (Thonglor), Khlong Tan Nuea, Watthana, Bangkok 10110', 'condo', 2, 2, 95,
'["Furnished", "Pool View", "Swimming Pool", "Gym", "Security", "Parking", "WiFi", "Air Conditioning", "Near BTS", "Modern Kitchen", "Balcony"]'::jsonb,
'["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1)),

('Spacious 3BR at Circle Condominium',
'Large family-friendly unit with 3 bedrooms and modern amenities. Open-plan living and dining area, fully equipped kitchen, and 2 parking spaces included. Excellent facilities including tennis court, library, and children''s playground.',
95000.00, '909 Petchburi Road, Phayathai, Ratchathewi, Bangkok 10400', 'condo', 3, 2, 145,
'["Partially Furnished", "Garden View", "Swimming Pool", "Gym", "Tennis Court", "24/7 Security", "2 Parking Spaces", "WiFi", "Air Conditioning", "Near BTS", "Playground", "Library"]'::jsonb,
'["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800", "https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1)),

-- Sathorn Area
('Ultra-Luxury 4BR at The Met',
'Exclusive 4-bedroom residence on high floor with breathtaking river views. This sophisticated unit features Italian marble, Miele appliances, wine cellar, and private elevator access. Resort-style facilities include spa, infinity pool, and concierge service.',
150000.00, '3199 Riverside, Sathorn, Bangkok 10120', 'condo', 4, 4, 280,
'["Fully Furnished", "River View", "Wine Cellar", "Private Elevator", "Infinity Pool", "Spa", "Gym", "Concierge", "Security", "2 Parking Spaces", "WiFi", "Smart Home", "Jacuzzi"]'::jsonb,
'["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800", "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1)),

('Elegant 2BR at Saladaeng Residences',
'Refined 2-bedroom unit in prime Silom location. Features contemporary design with high-quality fixtures, floor-to-ceiling windows, and premium appliances. Walking distance to BTS Saladaeng and MRT Silom.',
78000.00, '60 Saladaeng Road, Silom, Bangrak, Bangkok 10500', 'condo', 2, 2, 88,
'["Fully Furnished", "City View", "Swimming Pool", "Gym", "Security", "Parking", "WiFi", "Air Conditioning", "Near BTS", "Near MRT", "Balcony"]'::jsonb,
'["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1)),

-- =====================================================
-- 3. MID-RANGE CONDOS & APARTMENTS (25,000 - 50,000 THB)
-- =====================================================

('Cozy 1BR at Aspire Rama 9',
'Modern 1-bedroom unit perfect for young professionals. Fully furnished with contemporary decor, efficient layout, and excellent transport links. Close to Central Rama 9 shopping mall and MRT station.',
32000.00, '202 Ratchadapisek Road, Huai Khwang, Bangkok 10310', 'condo', 1, 1, 42,
'["Fully Furnished", "Swimming Pool", "Gym", "Security", "WiFi", "Air Conditioning", "Near MRT", "Shopping Mall Nearby", "Convenience Store"]'::jsonb,
'["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1)),

('Bright 2BR at The Parkland Ratchada',
'Comfortable 2-bedroom apartment with balcony and nice views. Well-maintained building with friendly community. Great value for families or working professionals.',
38000.00, '111 Ratchadaphisek Road, Din Daeng, Bangkok 10400', 'apartment', 2, 1, 68,
'["Partially Furnished", "Swimming Pool", "Parking", "Security", "Playground", "WiFi Ready", "Air Conditioning", "Balcony"]'::jsonb,
'["https://images.unsplash.com/photo-1502672260066-6bc35f0b1e1e?w=800", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1)),

('Spacious 2BR at Lumpini Park View',
'Excellent location with direct park views. This 2-bedroom unit offers tranquil living in the city center. Renovated kitchen and bathroom, good natural light throughout.',
45000.00, '991 Rama IV Road, Lumpini, Pathumwan, Bangkok 10330', 'condo', 2, 2, 75,
'["Furnished", "Park View", "Swimming Pool", "Gym", "Security", "Parking", "WiFi", "Air Conditioning", "Near MRT", "Balcony", "Renovated"]'::jsonb,
'["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1)),

('Modern 1BR at Ideo Mobi Rama 9',
'Contemporary 1-bedroom condo with smart layout and modern design. Features Murphy bed, work station, and full kitchen. Perfect for digital nomads and young professionals.',
29000.00, '242 Ratchadaphisek Road, Huai Khwang, Bangkok 10310', 'condo', 1, 1, 38,
'["Fully Furnished", "Modern Design", "Swimming Pool", "Co-working Space", "Gym", "Security", "WiFi", "Air Conditioning", "Near MRT", "Convenience Store"]'::jsonb,
'["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1)),

('Family 3BR at The President Park',
'Large 3-bedroom apartment perfect for families. Quiet neighborhood, safe environment for children. Building has playground, swimming pool, and shuttle service to BTS.',
48000.00, '95 Sukhumvit Soi 24, Khlong Toei, Bangkok 10110', 'apartment', 3, 2, 110,
'["Partially Furnished", "Quiet Area", "Swimming Pool", "Playground", "Shuttle Service", "Security", "Parking", "Pet Friendly", "Garden", "Near BTS"]'::jsonb,
'["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1)),

-- =====================================================
-- 4. BUDGET-FRIENDLY OPTIONS (10,000 - 25,000 THB)
-- =====================================================

('Affordable Studio at My Condo',
'Clean and efficient studio apartment perfect for students or budget-conscious professionals. Basic furnishing included, close to universities and public transport.',
12500.00, '456 Lat Phrao Road, Chatuchak, Bangkok 10900', 'studio', 1, 1, 28,
'["Basic Furniture", "Air Conditioning", "WiFi Ready", "Security", "Convenience Store", "Near BTS", "Laundry Service"]'::jsonb,
'["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1)),

('Comfortable 1BR at Centric Scene',
'Well-maintained 1-bedroom unit with good value. Fully furnished with essential appliances. Convenient location near markets and food stalls.',
18000.00, '88 Ratchada-Rama 3 Road, Chong Nonsi, Bangkok 10120', 'condo', 1, 1, 35,
'["Fully Furnished", "Swimming Pool", "Gym", "Security", "WiFi", "Air Conditioning", "Near MRT", "Market Nearby"]'::jsonb,
'["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1)),

('Compact 1BR at Supalai Park',
'Simple and practical 1-bedroom apartment. Good for single occupants or couples. Peaceful environment with green spaces.',
16000.00, '234 Ngam Wong Wan Road, Chatuchak, Bangkok 10900', 'apartment', 1, 1, 38,
'["Partially Furnished", "Garden", "Parking", "Security", "Market Nearby", "Quiet Area"]'::jsonb,
'["https://images.unsplash.com/photo-1502672260066-6bc35f0b1e1e?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1)),

('Budget 2BR at Nonthaburi Residence',
'Spacious 2-bedroom apartment outside city center. Great value for families on a budget. Easy access to Purple Line MRT.',
22000.00, '567 Tiwanon Road, Mueang Nonthaburi, Nonthaburi 11000', 'apartment', 2, 1, 65,
'["Partially Furnished", "Parking", "Security", "Playground", "Market Nearby", "Near MRT", "Quiet Area"]'::jsonb,
'["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1)),

('Simple Studio at Saphan Mai',
'Basic studio for students or interns. Very affordable and close to universities. Shared building facilities available.',
9500.00, '789 Phahonyothin Road, Saphan Mai, Bangkok 10210', 'studio', 1, 1, 24,
'["Basic Furniture", "Shared Laundry", "Security", "Convenience Store", "Near University", "WiFi Ready"]'::jsonb,
'["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1)),

-- =====================================================
-- 5. PREMIUM VILLAS & HOUSES (60,000 - 200,000 THB)
-- =====================================================

('Luxurious 4BR Villa with Pool',
'Stunning modern villa with private pool and tropical garden. Features include high ceilings, designer kitchen, home theater, and covered parking for 3 cars. Gated community with 24/7 security.',
180000.00, '123 Nichada Thani, Nonthaburi 11120', 'villa', 4, 4, 400,
'["Private Pool", "Garden", "Fully Furnished", "3 Parking Spaces", "Home Theater", "Maid Room", "Security", "WiFi", "Air Conditioning", "Gated Community", "Modern Kitchen", "BBQ Area"]'::jsonb,
'["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1)),

('Elegant 3BR House in Ekkamai',
'Beautiful townhouse in prime Ekkamai location. Renovated with modern touches while maintaining charm. Private parking, rooftop terrace, and small garden.',
95000.00, '45 Ekkamai Soi 12, Phra Khanong, Bangkok 10110', 'house', 3, 3, 220,
'["Furnished", "Parking", "Rooftop Terrace", "Garden", "Renovated", "Security", "WiFi", "Air Conditioning", "Near BTS", "Trendy Area", "Pet Friendly"]'::jsonb,
'["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1)),

('Modern 5BR Villa in Srinakarin',
'Spacious family villa with 5 bedrooms and large garden. Perfect for big families or those who enjoy entertaining. Features pool, outdoor sala, and modern amenities.',
125000.00, '88 Srinakarin Road, Nong Bon, Prawet, Bangkok 10250', 'villa', 5, 4, 450,
'["Private Pool", "Large Garden", "Partially Furnished", "Outdoor Sala", "BBQ Area", "2 Parking Spaces", "Maid Room", "Security", "WiFi", "Air Conditioning", "Storage Room"]'::jsonb,
'["https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1)),

('Contemporary 3BR House near Airport',
'Convenient location near Suvarnabhumi Airport. Ideal for frequent travelers or airline staff. Modern design with efficient layout and smart home features.',
75000.00, '234 Lat Krabang Road, Lat Krabang, Bangkok 10520', 'house', 3, 2, 180,
'["Furnished", "Smart Home", "2 Parking Spaces", "Security", "WiFi", "Air Conditioning", "Near Airport", "Garden", "Modern Kitchen"]'::jsonb,
'["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1)),

('Charming 2BR House in Ari',
'Cozy house in trendy Ari neighborhood. Walking distance to cafes, restaurants, and BTS Ari. Perfect for creative professionals or small families.',
68000.00, '67 Ari Soi 4, Phaya Thai, Bangkok 10400', 'house', 2, 2, 140,
'["Partially Furnished", "Parking", "Garden", "Renovated", "Trendy Area", "Near BTS", "Cafes Nearby", "Pet Friendly", "WiFi", "Air Conditioning"]'::jsonb,
'["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1)),

-- =====================================================
-- 6. UNIQUE/SPECIAL PROPERTIES
-- =====================================================

('Artistic Loft in Chinatown',
'Unique industrial loft space in historic Chinatown. High ceilings with exposed brick, perfect for artists or creative professionals. Walking distance to MRT Hua Lamphong.',
42000.00, '345 Yaowarat Road, Samphanthawong, Bangkok 10100', 'apartment', 1, 1, 85,
'["Loft Style", "High Ceilings", "Exposed Brick", "Partially Furnished", "Historic Area", "Near MRT", "Unique Design", "Natural Light", "WiFi", "Air Conditioning"]'::jsonb,
'["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1)),

('Riverside Studio with Terrace',
'Charming studio with private terrace overlooking Chao Phraya River. Watch sunset views daily. Small but perfectly designed space.',
35000.00, '789 Charoen Nakhon Road, Khlong San, Bangkok 10600', 'studio', 1, 1, 45,
'["River View", "Private Terrace", "Fully Furnished", "Swimming Pool", "Gym", "Security", "Ferry Nearby", "Sunset View", "WiFi", "Air Conditioning"]'::jsonb,
'["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1)),

('Penthouse with Rooftop Garden',
'Rare penthouse unit with exclusive rooftop garden access. Perfect for entertaining or peaceful morning coffee with city views.',
128000.00, '456 Wireless Road, Lumpini, Pathumwan, Bangkok 10330', 'condo', 3, 3, 195,
'["Rooftop Garden", "Fully Furnished", "City View", "Private Access", "Swimming Pool", "Gym", "Security", "2 Parking Spaces", "Near BTS", "Premium Finishes", "WiFi", "Smart Home"]'::jsonb,
'["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1)),

('Garden House in Bangna',
'Peaceful single house surrounded by greenery. Large garden perfect for gardening enthusiasts or families with children. Quiet community.',
52000.00, '123 Bangna-Trad Road, Bang Na, Bangkok 10260', 'house', 3, 2, 200,
'["Large Garden", "Partially Furnished", "Parking", "Quiet Area", "Pet Friendly", "Outdoor Space", "Security", "Near Mega Bangna", "Family Friendly"]'::jsonb,
'["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1)),

('Smart Home Condo in Ratchada',
'Tech-enabled 2-bedroom condo with full smart home system. Control lighting, AC, and security from your phone. Ideal for tech enthusiasts.',
58000.00, '789 Ratchadaphisek Road, Chatuchak, Bangkok 10900', 'condo', 2, 2, 78,
'["Smart Home System", "Fully Furnished", "Voice Control", "Security", "Swimming Pool", "Gym", "Parking", "WiFi", "Air Conditioning", "Near MRT", "Modern Design"]'::jsonb,
'["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]'::jsonb,
true, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1));

-- =====================================================
-- 7. PROPERTY REVIEWS
-- =====================================================

INSERT INTO property_reviews (property_id, reviewer_id, rating, review_text, reviewer_name, is_verified, created_at) VALUES
(1, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1), 5, 'Absolutely stunning property! The views are breathtaking and the amenities are top-notch. Worth every baht.', 'Michael Chen', true, NOW() - INTERVAL '15 days'),
(1, (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1), 5, 'Best penthouse in Bangkok. The owner is very responsive and the building management is excellent.', 'Sarah Johnson', true, NOW() - INTERVAL '30 days'),
(2, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1), 4, 'Great location near BTS. The unit is well-maintained and furnished nicely. Highly recommend!', 'John Smith', true, NOW() - INTERVAL '20 days'),
(3, (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1), 5, 'Perfect for our family! The kids love the playground and the swimming pool. Safe and quiet neighborhood.', 'Emily Wong', true, NOW() - INTERVAL '45 days'),
(5, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1), 4, 'Excellent location in Silom. Easy walking to MRT and BTS. The building is modern and well-maintained.', 'David Park', true, NOW() - INTERVAL '10 days'),
(6, (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1), 5, 'Great value for money! Perfect for young professionals. Close to everything you need.', 'Lisa Anderson', true, NOW() - INTERVAL '25 days'),
(8, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1), 4, 'Beautiful park views and peaceful environment. The apartment is spacious and well-lit.', 'Thomas Lee', true, NOW() - INTERVAL '35 days'),
(11, (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1), 4, 'Good budget option for families. The shuttle service to BTS is very convenient.', 'Maria Garcia', true, NOW() - INTERVAL '50 days'),
(16, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1), 5, 'Dream house! The pool and garden are amazing. Perfect for entertaining guests.', 'Robert Taylor', true, NOW() - INTERVAL '60 days'),
(17, (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1), 5, 'Love the trendy Ekkamai location! Walkable to great restaurants and cafes. House is beautiful.', 'Jennifer Kim', true, NOW() - INTERVAL '40 days');

-- =====================================================
-- 8. FAVORITES (Sample user favorites)
-- =====================================================

INSERT INTO favorites (user_id, property_id, created_at) VALUES
((SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1), 1, NOW() - INTERVAL '5 days'),
((SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1), 4, NOW() - INTERVAL '8 days'),
((SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1), 16, NOW() - INTERVAL '12 days'),
((SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1), 2, NOW() - INTERVAL '3 days'),
((SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1), 6, NOW() - INTERVAL '7 days'),
((SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1), 17, NOW() - INTERVAL '10 days')
ON CONFLICT (user_id, property_id) DO NOTHING;

-- =====================================================
-- 9. TOUR REQUESTS (Sample tour bookings)
-- =====================================================

INSERT INTO tour_requests (
  property_id, 
  requester_id, 
  owner_id, 
  requested_date, 
  requested_time, 
  message, 
  status, 
  contact_method, 
  requester_name, 
  requester_phone, 
  requester_email,
  created_at
) VALUES
(1, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1), (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1), 
 CURRENT_DATE + INTERVAL '3 days', '14:00', 'Very interested in viewing this penthouse. Please confirm availability.', 
 'pending', 'phone', 'Michael Chen', '+66 81 234 5678', 'michael.chen@email.com', NOW() - INTERVAL '2 hours'),

(2, (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1), (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1),
 CURRENT_DATE + INTERVAL '5 days', '10:00', 'Would like to see the unit this weekend if possible.',
 'confirmed', 'email', 'Sarah Johnson', '+66 82 345 6789', 'sarah.j@email.com', NOW() - INTERVAL '1 day'),

(4, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1), (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1),
 CURRENT_DATE + INTERVAL '2 days', '15:30', 'Interested in the riverside view. Can we schedule afternoon viewing?',
 'confirmed', 'phone', 'David Park', '+66 89 123 4567', 'david.park@email.com', NOW() - INTERVAL '3 days'),

(6, (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1), (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1),
 CURRENT_DATE + INTERVAL '4 days', '16:00', 'Looking for affordable option near MRT. This looks perfect!',
 'pending', 'message', 'Lisa Anderson', '+66 83 456 7890', 'lisa.a@email.com', NOW() - INTERVAL '6 hours'),

(16, (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1), (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1),
 CURRENT_DATE + INTERVAL '7 days', '11:00', 'Family of 4 looking for villa with pool. Very interested!',
 'pending', 'phone', 'Robert Taylor', '+66 84 567 8901', 'robert.t@email.com', NOW() - INTERVAL '12 hours');

-- =====================================================
-- 10. MESSAGES (Sample conversations)
-- =====================================================

INSERT INTO messages (sender_id, recipient_id, property_id, subject, content, is_read, created_at) VALUES
((SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1), (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1), 1,
 'Inquiry about Luxury Penthouse', 'Hi! I''m very interested in your penthouse at The Diplomat. Is it still available for October?', 
 true, NOW() - INTERVAL '2 days'),

((SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1), (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1), 1,
 'Re: Inquiry about Luxury Penthouse', 'Yes, it''s available! Would you like to schedule a viewing? I can show you the unit this weekend.',
 true, NOW() - INTERVAL '1 day'),

((SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1), (SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1), 6,
 'Question about Aspire Rama 9 condo', 'Hello! Does the rent include utilities? Also, is there parking available?',
 false, NOW() - INTERVAL '5 hours'),

((SELECT id FROM profiles WHERE username = 'bob_s' LIMIT 1), (SELECT id FROM profiles WHERE username = 'alice_p' LIMIT 1), 17,
 'Interest in Ekkamai House', 'I love the location! Can you tell me more about the neighborhood and nearby amenities?',
 false, NOW() - INTERVAL '3 hours');

-- =====================================================
-- 11. UPDATE STATISTICS
-- =====================================================

-- Update stats with more realistic numbers based on inserted data
UPDATE stats SET value = '25' WHERE label = 'Favorite Properties' AND role = 'renter';
UPDATE stats SET value = '20' WHERE label = 'Active Listings' AND role = 'landlord';
UPDATE stats SET value = '45' WHERE label = 'New Inquiries' AND role = 'landlord';

-- =====================================================
-- END OF DUMMY DATA
-- =====================================================

-- Verify data insertion
SELECT 'Data insertion complete!' AS status;
SELECT COUNT(*) AS total_properties FROM properties;
SELECT COUNT(*) AS total_reviews FROM property_reviews;
SELECT COUNT(*) AS total_tour_requests FROM tour_requests;
SELECT COUNT(*) AS total_favorites FROM favorites;
SELECT COUNT(*) AS total_messages FROM messages;
