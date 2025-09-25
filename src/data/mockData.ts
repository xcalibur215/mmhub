// Comprehensive mock data for different user roles and scenarios

export interface MockUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'renter' | 'landlord' | 'agent' | 'admin';
  username: string;
  avatar?: string;
  joinedAt: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface MockProperty {
  id: string;
  title: string;
  description: string;
  monthly_rent: number;
  security_deposit?: number;
  bedrooms: number;
  bathrooms: number;
  square_feet?: number;
  location: string;
  property_type: string;
  created_at: string;
  image_url?: string;
  landlord_id: string;
  status: 'available' | 'rented' | 'pending' | 'maintenance';
  amenities: string[];
  pet_friendly: boolean;
  parking_available: boolean;
  utilities_included: boolean;
}

export interface MockStats {
  renter: {
    favoriteProperties: number;
    activeRentals: number;
    rentalApplications: number;
    messages: number;
    viewedProperties: number;
    savedSearches: number;
  };
  landlord: {
    activeListings: number;
    totalInquiries: number;
    activeLeases: number;
    monthlyRevenue: number;
    totalProperties: number;
    averageRating: number;
    occupancyRate: number;
  };
  agent: {
    managedProperties: number;
    activeClients: number;
    monthlyCommissions: number;
    responseRate: number;
    dealsThisMonth: number;
    totalPortfolio: number;
    clientSatisfaction: number;
  };
  admin: {
    totalUsers: number;
    totalProperties: number;
    totalMessages: number;
    totalRevenue: number;
    activeListings: number;
    pendingApprovals: number;
    newUsersToday: number;
    messagesUnread: number;
    monthlyGrowth: number;
    conversionRate: number;
  };
}

export const mockUsers: MockUser[] = [
  {
    id: 'user_renter_1',
    email: 'john.renter@example.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'renter',
    username: 'johnsmith',
    avatar: '/placeholder.svg',
    joinedAt: '2024-01-15T10:00:00Z',
    status: 'active'
  },
  {
    id: 'user_landlord_1',
    email: 'sarah.landlord@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'landlord',
    username: 'sarahjohnson',
    avatar: '/placeholder.svg',
    joinedAt: '2023-11-20T14:30:00Z',
    status: 'active'
  },
  {
    id: 'user_agent_1',
    email: 'mike.agent@example.com',
    firstName: 'Mike',
    lastName: 'Wilson',
    role: 'agent',
    username: 'mikewilson',
    avatar: '/placeholder.svg',
    joinedAt: '2023-08-05T09:15:00Z',
    status: 'active'
  },
  {
    id: 'user_admin_1',
    email: 'admin@mmhub.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    username: 'admin',
    avatar: '/placeholder.svg',
    joinedAt: '2023-01-01T00:00:00Z',
    status: 'active'
  }
];

export const mockProperties: MockProperty[] = [
  {
    id: 'prop_1',
    title: 'Luxury Downtown Condo',
    description: 'Beautiful 2-bedroom condo in the heart of downtown with stunning city views and modern amenities.',
    monthly_rent: 2500,
    security_deposit: 2500,
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1200,
    location: 'Downtown Bangkok, Thailand',
    property_type: 'Condo',
    created_at: '2024-01-15T10:00:00Z',
    image_url: '/placeholder.svg',
    landlord_id: 'user_landlord_1',
    status: 'available',
    amenities: ['Pool', 'Gym', 'Security', 'Parking', 'WiFi'],
    pet_friendly: false,
    parking_available: true,
    utilities_included: true
  },
  {
    id: 'prop_2',
    title: 'Cozy Studio Near BTS',
    description: 'Perfect studio apartment for young professionals, just 2 minutes walk from BTS station.',
    monthly_rent: 800,
    security_deposit: 800,
    bedrooms: 0,
    bathrooms: 1,
    square_feet: 500,
    location: 'Sukhumvit, Bangkok, Thailand',
    property_type: 'Studio',
    created_at: '2024-01-14T15:30:00Z',
    image_url: '/placeholder.svg',
    landlord_id: 'user_landlord_1',
    status: 'available',
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen'],
    pet_friendly: true,
    parking_available: false,
    utilities_included: true
  },
  {
    id: 'prop_3',
    title: 'Family House with Garden',
    description: 'Spacious 4-bedroom house perfect for families, featuring a large garden and quiet neighborhood.',
    monthly_rent: 1800,
    security_deposit: 3600,
    bedrooms: 4,
    bathrooms: 3,
    square_feet: 2200,
    location: 'Thonglor, Bangkok, Thailand',
    property_type: 'House',
    created_at: '2024-01-13T09:15:00Z',
    image_url: '/placeholder.svg',
    landlord_id: 'user_landlord_1',
    status: 'rented',
    amenities: ['Garden', 'Parking', 'Security', 'Pet Area'],
    pet_friendly: true,
    parking_available: true,
    utilities_included: false
  },
  {
    id: 'prop_4',
    title: 'Modern Apartment Complex',
    description: '1-bedroom apartment in a modern complex with excellent facilities and convenient location.',
    monthly_rent: 1200,
    security_deposit: 1200,
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 700,
    location: 'Chatuchak, Bangkok, Thailand',
    property_type: 'Apartment',
    created_at: '2024-01-12T14:20:00Z',
    image_url: '/placeholder.svg',
    landlord_id: 'user_landlord_1',
    status: 'available',
    amenities: ['Pool', 'Gym', 'Security', 'WiFi'],
    pet_friendly: false,
    parking_available: true,
    utilities_included: true
  },
  {
    id: 'prop_5',
    title: 'Penthouse with City View',
    description: 'Exclusive penthouse offering breathtaking city views and luxury living in prime location.',
    monthly_rent: 4500,
    security_deposit: 9000,
    bedrooms: 3,
    bathrooms: 3,
    square_feet: 2000,
    location: 'Sathorn, Bangkok, Thailand',
    property_type: 'Penthouse',
    created_at: '2024-01-11T11:45:00Z',
    image_url: '/placeholder.svg',
    landlord_id: 'user_landlord_1',
    status: 'available',
    amenities: ['Rooftop Terrace', 'Private Pool', 'Concierge', 'Valet Parking', 'Smart Home'],
    pet_friendly: false,
    parking_available: true,
    utilities_included: true
  },
  {
    id: 'prop_6',
    title: 'Budget-Friendly Shared Room',
    description: 'Affordable shared accommodation perfect for students and budget-conscious renters.',
    monthly_rent: 400,
    security_deposit: 400,
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 300,
    location: 'Ramkhamhaeng, Bangkok, Thailand',
    property_type: 'Shared Room',
    created_at: '2024-01-10T08:30:00Z',
    image_url: '/placeholder.svg',
    landlord_id: 'user_landlord_1',
    status: 'available',
    amenities: ['WiFi', 'Shared Kitchen', 'Laundry'],
    pet_friendly: false,
    parking_available: false,
    utilities_included: true
  },
  // Additional properties for different scenarios
  {
    id: 'prop_7',
    title: 'Executive Serviced Apartment',
    description: 'Fully furnished executive apartment with hotel-like services, perfect for business travelers.',
    monthly_rent: 3200,
    security_deposit: 3200,
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1000,
    location: 'Silom, Bangkok, Thailand',
    property_type: 'Serviced Apartment',
    created_at: '2024-01-09T16:00:00Z',
    image_url: '/placeholder.svg',
    landlord_id: 'user_landlord_1',
    status: 'available',
    amenities: ['Housekeeping', 'Concierge', 'Gym', 'Pool', 'Business Center'],
    pet_friendly: false,
    parking_available: true,
    utilities_included: true
  },
  {
    id: 'prop_8',
    title: 'Townhouse in Gated Community',
    description: '3-bedroom townhouse in secure gated community with club house and recreational facilities.',
    monthly_rent: 2200,
    security_deposit: 4400,
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1500,
    location: 'Lat Phrao, Bangkok, Thailand',
    property_type: 'Townhouse',
    created_at: '2024-01-08T12:30:00Z',
    image_url: '/placeholder.svg',
    landlord_id: 'user_landlord_1',
    status: 'pending',
    amenities: ['Clubhouse', 'Security', 'Swimming Pool', 'Children Playground', 'Jogging Track'],
    pet_friendly: true,
    parking_available: true,
    utilities_included: false
  }
];

export const mockStats: MockStats = {
  renter: {
    favoriteProperties: 15,
    activeRentals: 1,
    rentalApplications: 4,
    messages: 8,
    viewedProperties: 45,
    savedSearches: 3
  },
  landlord: {
    activeListings: 12,
    totalInquiries: 38,
    activeLeases: 18,
    monthlyRevenue: 68500,
    totalProperties: 25,
    averageRating: 4.7,
    occupancyRate: 92
  },
  agent: {
    managedProperties: 45,
    activeClients: 28,
    monthlyCommissions: 35800,
    responseRate: 96,
    dealsThisMonth: 8,
    totalPortfolio: 120,
    clientSatisfaction: 94
  },
  admin: {
    totalUsers: 2847,
    totalProperties: 1256,
    totalMessages: 8421,
    totalRevenue: 145678,
    activeListings: 834,
    pendingApprovals: 45,
    newUsersToday: 23,
    messagesUnread: 127,
    monthlyGrowth: 15,
    conversionRate: 23
  }
};

export const mockActivities = [
  {
    id: 1,
    type: "message",
    title: "New message from Sarah Johnson",
    description: "Regarding the downtown apartment listing",
    time: "2 hours ago",
    avatar: "/placeholder.svg"
  },
  {
    id: 2,
    type: "favorite",
    title: "Property saved to favorites",
    description: "Modern loft in Capitol Hill",
    time: "1 day ago",
    avatar: "/placeholder.svg"
  },
  {
    id: 3,
    type: "application",
    title: "Application submitted",
    description: "Luxury Downtown Condo",
    time: "2 days ago",
    avatar: "/placeholder.svg"
  },
  {
    id: 4,
    type: "view",
    title: "Property viewed",
    description: "Spacious family home in Bellevue",
    time: "3 days ago",
    avatar: "/placeholder.svg"
  },
  {
    id: 5,
    type: "inquiry",
    title: "Inquiry sent to landlord",
    description: "Executive Serviced Apartment",
    time: "5 days ago",
    avatar: "/placeholder.svg"
  }
];

export const mockMessages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    subject: "Re: Downtown Condo Inquiry",
    preview: "Thank you for your interest in the property. I'd be happy to schedule a viewing...",
    time: "2 hours ago",
    unread: true,
    avatar: "/placeholder.svg",
    propertyTitle: "Luxury Downtown Condo"
  },
  {
    id: 2,
    sender: "Mike Wilson",
    subject: "Property Viewing Confirmation",
    preview: "Your viewing for the Thonglor house has been confirmed for tomorrow at 2 PM...",
    time: "1 day ago",
    unread: true,
    avatar: "/placeholder.svg",
    propertyTitle: "Family House with Garden"
  },
  {
    id: 3,
    sender: "Property Manager",
    subject: "Application Status Update",
    preview: "Your rental application has been approved. Please proceed with the lease signing...",
    time: "2 days ago",
    unread: false,
    avatar: "/placeholder.svg",
    propertyTitle: "Modern Apartment Complex"
  }
];

// Role-specific quick actions
export const roleQuickActions = {
  renter: [
    { label: "Browse Properties", href: "/listings", icon: "Home", color: "blue" },
    { label: "My Favorites", href: "/favorites", icon: "Heart", color: "red" },
    { label: "Messages", href: "/messages", icon: "MessageCircle", color: "green" },
    { label: "Applications", href: "/applications", icon: "FileText", color: "purple" },
    { label: "Saved Searches", href: "/searches", icon: "Search", color: "orange" },
    { label: "Profile Settings", href: "/settings", icon: "Settings", color: "gray" }
  ],
  landlord: [
    { label: "Add Property", href: "/properties/new", icon: "Plus", color: "green" },
    { label: "My Properties", href: "/properties", icon: "Building", color: "blue" },
    { label: "Tenants", href: "/tenants", icon: "Users", color: "purple" },
    { label: "Analytics", href: "/analytics", icon: "BarChart3", color: "orange" },
    { label: "Maintenance", href: "/maintenance", icon: "Wrench", color: "red" },
    { label: "Financial Reports", href: "/reports", icon: "DollarSign", color: "green" }
  ],
  agent: [
    { label: "Client Portal", href: "/clients", icon: "Users", color: "blue" },
    { label: "Property Portfolio", href: "/portfolio", icon: "Building", color: "green" },
    { label: "Schedule", href: "/schedule", icon: "Calendar", color: "purple" },
    { label: "Communications", href: "/communications", icon: "MessageSquare", color: "orange" },
    { label: "Market Analysis", href: "/market", icon: "TrendingUp", color: "red" },
    { label: "Commission Tracker", href: "/commissions", icon: "DollarSign", color: "green" }
  ],
  admin: [
    { label: "User Management", href: "/admin/users", icon: "UserCheck", color: "blue" },
    { label: "Property Moderation", href: "/admin/properties", icon: "Shield", color: "red" },
    { label: "System Analytics", href: "/admin/analytics", icon: "BarChart3", color: "green" },
    { label: "Content Management", href: "/admin/content", icon: "FileText", color: "purple" },
    { label: "Security Logs", href: "/admin/security", icon: "Lock", color: "orange" },
    { label: "Platform Settings", href: "/admin/settings", icon: "Settings", color: "gray" }
  ]
};