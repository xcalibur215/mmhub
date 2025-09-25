# MMHub Authentication System

This document describes the authentication system implementation for the MMHub rental platform.

## Overview

The authentication system provides:
- User registration and login
- Automatic profile creation
- Session management
- Role-based access control
- Password reset functionality
- Email verification (configurable)

## Architecture

### Components

1. **AuthContext** (`src/context/AuthContext.tsx`)
   - Central authentication state management
   - Provides login, signup, and logout functions
   - Handles automatic profile creation
   - Manages session persistence

2. **Login Component** (`src/pages/auth/Login.tsx`)
   - User login form
   - Enhanced error handling
   - Auto-redirect after successful login

3. **Register Component** (`src/pages/auth/Register.tsx`)
   - User registration form
   - Role selection (renter, landlord, agent)
   - Terms and conditions acceptance
   - Handles immediate login or email verification

4. **ProtectedRoute** (`src/components/routing/ProtectedRoute.tsx`)
   - Route protection based on authentication status
   - Loading states to prevent UI flickering
   - Admin route protection

5. **AuthStatus Component** (`src/components/AuthStatus.tsx`)
   - Debug component for authentication status
   - Displays user, profile, and session information

## Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'renter',
  first_name TEXT,
  last_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  user_type TEXT NOT NULL DEFAULT 'renter',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Configuration

### Environment Variables
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Settings

#### Email Verification (Optional)
To disable email verification for seamless registration:

1. Go to Supabase Dashboard → Authentication → Settings
2. Under "User Signups", turn OFF "Enable email confirmations"
3. This allows users to login immediately after registration

#### Row Level Security (RLS)
Profiles table should have RLS enabled with policies:

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile  
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## Authentication Flow

### Registration Flow

1. User fills registration form
2. `AuthContext.signup()` is called
3. Supabase creates user account
4. If email verification disabled:
   - User is immediately logged in
   - Profile is auto-created
   - Redirect to dashboard
5. If email verification enabled:
   - User receives verification email
   - Must verify before login
   - Redirect to login page

### Login Flow

1. User submits login form
2. `AuthContext.login()` validates credentials
3. If successful:
   - Session is established
   - Profile is fetched/created automatically
   - User is redirected to dashboard
4. If failed:
   - User-friendly error message displayed

### Profile Creation

Profiles are automatically created when:
- User first logs in after registration
- Profile doesn't exist in database
- Contains user metadata from registration

Auto-created profile includes:
- Username (from email)
- First/last name (from registration)
- Role (from registration)
- Default user_type: 'renter'

## Usage

### AuthContext Hook

```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, profile, isLoading, login, signup, logout, isAdmin } = useAuth();
  
  // Use authentication state and functions
}
```

### Protected Routes

```tsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />

<Route path="/admin" element={
  <AdminRoute>
    <AdminDashboard />
  </AdminRoute>
} />
```

## Testing

### Manual Testing
1. Visit `/auth/test` for comprehensive authentication testing page
2. Test registration, login, logout flows
3. Monitor authentication status in real-time

### Console Testing
Load the integration tests in browser console:
```javascript
// In browser console at localhost:8080
const script = document.createElement('script');
script.src = '/auth-integration-tests.js';
document.head.appendChild(script);

// Then run tests
runAuthTests();
```

### Test Scenarios

1. **New User Registration**
   - Register with unique email
   - Verify auto-login (if email verification disabled)
   - Check profile creation
   - Test dashboard access

2. **Existing User Login**
   - Login with registered credentials
   - Verify session persistence
   - Test route protection

3. **Error Handling**
   - Invalid credentials
   - Duplicate email registration
   - Network errors
   - Missing form fields

## Error Handling

The system provides user-friendly error messages for:

- **Invalid credentials**: "Invalid email or password. Please check your credentials and try again."
- **Email not confirmed**: "Please check your email and click the confirmation link before logging in."
- **Rate limiting**: "Too many login attempts. Please wait a moment before trying again."
- **Duplicate registration**: "An account with this email already exists. Please try logging in instead."
- **Weak password**: "Password must be at least 6 characters long."
- **Invalid email**: "Please enter a valid email address."

## Security Features

1. **Session Management**: Automatic session handling with Supabase
2. **Route Protection**: Protected routes require authentication
3. **Role-based Access**: Admin routes for admin users only
4. **Password Security**: Handled by Supabase Auth
5. **CSRF Protection**: Built into Supabase Auth
6. **Rate Limiting**: Supabase provides built-in rate limiting

## Debugging

### Debug Information
- Use AuthStatus component to view current auth state
- Check browser console for detailed error logs
- Use auth test page for comprehensive testing

### Common Issues

1. **Profile not created**: Check if auto-profile creation is working
2. **Session not persisting**: Verify Supabase configuration
3. **Email verification loop**: Check Supabase email settings
4. **Route protection not working**: Verify ProtectedRoute implementation

## Future Enhancements

Potential improvements:
- Social media login (Google, Facebook)
- Two-factor authentication
- Password strength requirements
- Profile picture upload
- Account verification levels
- OAuth integration
- Session timeout warnings

## Support

For issues with the authentication system:
1. Check the test page at `/auth/test`
2. Review browser console for errors
3. Verify Supabase configuration
4. Run integration tests
5. Check database table permissions

## Changelog

- **v1.0**: Basic login/register with Supabase
- **v1.1**: Added auto-profile creation
- **v1.2**: Enhanced error handling
- **v1.3**: Added comprehensive testing tools
- **v1.4**: Improved session management
- **v1.5**: Added AuthStatus debug component