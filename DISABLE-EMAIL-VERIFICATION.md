# Supabase Email Verification Disable Instructions

## Problem
Users cannot login immediately after registration because email verification is required by default in Supabase.

## Solution
You need to disable email confirmation in your Supabase dashboard settings.

### Step 1: Access Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: `wkjshlcwstzxvxnvowby`

### Step 2: Disable Email Confirmation
1. Navigate to **Authentication** → **Settings**
2. Find the **User Signups** section
3. **Turn OFF** "Enable email confirmations"
4. Click **Save**

### Alternative: Enable Auto-confirm for Development
If you want to keep email confirmation for production but disable for development:

1. Go to **Authentication** → **Settings**
2. In **Advanced Settings**, find "Email Confirm"
3. Toggle **OFF** "Enable email confirmations"

### Step 3: Optional - Set Site URL
1. In **Authentication** → **Settings**
2. Set **Site URL** to: `http://localhost:8080`
3. Add **Redirect URLs**:
   - `http://localhost:8080/auth/callback`
   - `http://localhost:8080/dashboard`

## Testing Steps After Configuration

### Method 1: Use the test page
1. Open: `http://localhost:8080/../test-auth.html`
2. Click "Test Sign Up" with a new email
3. Check if user is immediately signed in (should see session data)
4. Try "Test Sign In" with the same credentials

### Method 2: Use the actual app
1. Go to: `http://localhost:8080/auth/register`
2. Fill out the form with valid data
3. Submit - should redirect to dashboard immediately
4. If it doesn't work, try logging in at: `http://localhost:8080/auth/login`

## Expected Behavior After Fix
- ✅ User registers → Immediately signed in → Redirected to dashboard
- ✅ User can login with email/password without verification
- ✅ Profile is automatically created in the profiles table

## If You Can't Access Supabase Dashboard
Let me know and I can provide alternative solutions using Supabase CLI or API calls.