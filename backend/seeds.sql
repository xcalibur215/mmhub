INSERT INTO stats (role, label, value, icon) VALUES
  ('renter', 'Favorite Properties', '15', 'Heart'),
  ('renter', 'Active Rentals', '1', 'Home'),
  ('renter', 'Rental Applications', '4', 'FileText'),
  ('renter', 'Unread Messages', '8', 'MessageCircle'),
  ('landlord', 'Active Listings', '12', 'Building'),
  ('landlord', 'New Inquiries', '38', 'MessageCircle'),
  ('landlord', 'Active Leases', '18', 'FileText'),
  ('landlord', 'Monthly Revenue', '68500', 'BarChart3'),
  ('agent', 'Managed Properties', '45', 'Building'),
  ('agent', 'Active Clients', '28', 'Users'),
  ('agent', 'Monthly Commissions', '35800', 'BarChart3'),
  ('agent', 'Response Rate', '96%', 'MessageCircle');

INSERT INTO activities (type, title, description, time, avatar) VALUES
  ('message', 'New message from Sarah Johnson', 'Regarding the downtown apartment listing', '2 hours ago', '/placeholder.svg'),
  ('favorite', 'Property saved to favorites', 'Modern loft in Capitol Hill', '1 day ago', '/placeholder.svg'),
  ('application', 'Application submitted', 'Luxury Downtown Condo', '2 days ago', '/placeholder.svg'),
  ('view', 'Property viewed', 'Spacious family home in Bellevue', '3 days ago', '/placeholder.svg'),
  ('inquiry', 'Inquiry sent to landlord', 'Executive Serviced Apartment', '5 days ago', '/placeholder.svg');

INSERT INTO quick_actions (role, label, href, icon, color) VALUES
  ('renter', 'Browse Properties', '/listings', 'Home', 'blue'),
  ('renter', 'My Favorites', '/favorites', 'Heart', 'red'),
  ('renter', 'Messages', '/messages', 'MessageCircle', 'green'),
  ('renter', 'Applications', '/applications', 'FileText', 'purple'),
  ('renter', 'Saved Searches', '/searches', 'Search', 'orange'),
  ('renter', 'Profile Settings', '/settings', 'Settings', 'gray'),
  ('landlord', 'Add Property', '/properties/new', 'Plus', 'green'),
  ('landlord', 'My Properties', '/properties', 'Building', 'blue'),
  ('landlord', 'Tenants', '/tenants', 'Users', 'purple'),
  ('landlord', 'Analytics', '/analytics', 'BarChart3', 'orange'),
  ('landlord', 'Maintenance', '/maintenance', 'Wrench', 'red'),
  ('landlord', 'Financial Reports', '/reports', 'DollarSign', 'green'),
  ('agent', 'Client Portal', '/clients', 'Users', 'blue'),
  ('agent', 'Property Portfolio', '/portfolio', 'Building', 'green'),
  ('agent', 'Schedule', '/schedule', 'Calendar', 'purple'),
  ('agent', 'Communications', '/communications', 'MessageSquare', 'orange'),
  ('agent', 'Market Analysis', '/market', 'TrendingUp', 'red'),
  ('agent', 'Commission Tracker', '/commissions', 'DollarSign', 'green'),
  ('admin', 'User Management', '/admin/users', 'UserCheck', 'blue'),
  ('admin', 'Property Moderation', '/admin/properties', 'Shield', 'red'),
  ('admin', 'System Analytics', '/admin/analytics', 'BarChart3', 'green'),
  ('admin', 'Content Management', '/admin/content', 'FileText', 'purple'),
  ('admin', 'Security Logs', '/admin/security', 'Lock', 'orange'),
  ('admin', 'Platform Settings', '/admin/settings', 'Settings', 'gray');

-- Seed users
INSERT INTO auth.users (id, email, encrypted_password, role) VALUES
  (gen_random_uuid(), 'admin@example.com', crypt('adminpassword', gen_salt('bf')), 'authenticated');

-- Seed profiles
INSERT INTO profiles (id, username, role)
  SELECT id, 'admin', 'admin' FROM auth.users WHERE email = 'admin@example.com';
INSERT INTO profiles (id, username, role)
  SELECT id, 'renter', 'renter' FROM auth.users WHERE email = 'renter@example.com';
INSERT INTO profiles (id, username, role)
  SELECT id, 'landlord', 'landlord' FROM auth.users WHERE email = 'landlord@example.com';
INSERT INTO profiles (id, username, role)
  SELECT id, 'agent', 'agent' FROM auth.users WHERE email = 'agent@example.com';
