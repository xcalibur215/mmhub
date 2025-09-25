# Database Schema Updates for MMHub

## Overview
This document outlines the database schema analysis and required updates for the MMHub rental platform.

## Current Database Status

### Existing Tables ✅
- **profiles** - User profile information (working)
- **properties** - Rental property listings (working) 
- **reviews** - Property reviews (working)
- **bookings** - Rental bookings (exists, may need structure updates)
- **favorites** - User favorite properties (exists, empty)
- **messages** - User messaging system (exists, empty)

### Issues Found & Fixed 🔧

1. **TypeScript Type Mismatches**
   - ✅ Fixed: User ID types (string vs number)
   - ✅ Fixed: Property field name mismatches
   - ✅ Added: Missing interfaces for all database tables

2. **Database Schema**
   - ✅ Created: Migration script for proper table structures
   - ✅ Created: Row Level Security (RLS) policies
   - ✅ Added: Performance indexes
   - ✅ Added: Data validation constraints

## Files Updated

### TypeScript Types (`src/types/index.ts`)
```typescript
// New interfaces added:
- UserProfile (matches database schema)
- Property (matches database schema) 
- Booking
- Review
- Favorite
- Message

// Legacy interfaces maintained for backward compatibility
- User
- PropertySummary
```

### AuthContext (`src/context/AuthContext.tsx`)
- Updated to use new UserProfile type
- Fixed admin detection logic
- Added better error handling

## Database Migration Instructions

### 1. Run Migration Script
Execute the following script in your Supabase SQL editor:
```bash
# Copy and paste content from:
database-migration.sql
```

This script will:
- Ensure all tables have correct structure
- Add missing columns and constraints
- Set up Row Level Security (RLS) policies
- Create performance indexes
- Add data validation triggers

### 2. Add Sample Data (Optional)
Execute the following script for test data:
```bash
# Copy and paste content from:
sample-data.sql
```

### 3. Verify Schema
You can test the database schema by:
1. Opening your app at `http://localhost:8080`
2. Opening browser developer tools (F12)
3. Running the test script from `test-database-schema.js`

## Database Schema Details

### Profiles Table
```sql
- id: UUID (primary key, references auth.users)
- username: TEXT
- role: TEXT 
- first_name: TEXT
- last_name: TEXT
- bio: TEXT
- avatar_url: TEXT
- phone: TEXT
- location: TEXT
- user_type: TEXT ('admin', 'owner', 'renter', 'guest')
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### Properties Table
```sql
- id: SERIAL (primary key)
- title: TEXT (not null)
- description: TEXT
- price: DECIMAL(10,2) (monthly rent in THB)
- location: TEXT (full address)
- property_type: TEXT ('apartment', 'studio', 'house', 'condo', 'villa')
- bedrooms: INTEGER
- bathrooms: INTEGER  
- area_sqm: DECIMAL(10,2) (area in square meters)
- amenities: JSONB (array of amenities)
- images: JSONB (array of image URLs)
- is_available: BOOLEAN
- owner_id: UUID (references auth.users)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### Bookings Table
```sql
- id: SERIAL (primary key)
- property_id: INTEGER (references properties)
- tenant_id: UUID (references auth.users)
- start_date: DATE
- end_date: DATE
- total_amount: DECIMAL(10,2)
- status: TEXT ('pending', 'confirmed', 'cancelled', 'completed')
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### Other Tables
- **reviews**: Property reviews with ratings (1-5 stars)
- **favorites**: User favorite properties (many-to-many)
- **messages**: User messaging system

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies:
- Users can only access their own data
- Public data (properties, reviews) is readable by all
- Admin users have additional permissions

### Data Validation
- Date range validation for bookings
- Rating constraints (1-5 stars) for reviews
- Enum constraints for status fields
- Unique constraints to prevent duplicates

## Performance Optimizations

### Indexes Added
- Properties: owner_id, availability, type, price
- Bookings: property_id, tenant_id, status
- Reviews: property_id, rating
- Favorites: user_id, property_id
- Messages: sender_id, recipient_id, unread status

## Next Steps

1. **Run Migration**: Execute `database-migration.sql` in Supabase
2. **Add Sample Data**: Execute `sample-data.sql` for testing
3. **Test Schema**: Use `test-database-schema.js` to validate
4. **Create Auth Users**: Use registration form or Supabase dashboard
5. **Test Application**: Full end-to-end testing

## Troubleshooting

### Common Issues

**"Row-level security policy violation"**
- Ensure you're authenticated when testing
- Check RLS policies are correctly applied
- Admin users may need special policy updates

**"Column not found" errors**
- Run the migration script to add missing columns
- Clear browser cache and reload app

**Type errors in frontend**
- Build should work with new types
- Legacy interfaces maintained for compatibility
- Update imports to use new types where needed