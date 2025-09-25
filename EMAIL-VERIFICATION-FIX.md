# 🔧 How to Fix Login Issues - Email Verification Settings

## The Problem

If you're getting "Invalid credentials" errors when trying to login with a newly created account, it's likely because **email verification is enabled** in your Supabase project. This means users must verify their email address before they can login.

## Quick Test

You can test if this is the issue by trying to create an account with a Gmail address (e.g., `testuser@gmail.com`) and then attempting to login. You should see an error like "Email not confirmed" instead of "Invalid credentials".

## Solution 1: Disable Email Verification (Recommended for Development)

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Login to your account
3. Select your MMHub project

### Step 2: Navigate to Authentication Settings
1. In the left sidebar, click on **"Authentication"**
2. Click on **"Settings"** tab
3. Look for **"User Signups"** section

### Step 3: Disable Email Confirmation
1. Find the setting **"Enable email confirmations"**
2. **Turn OFF** this toggle switch
3. Click **"Save"** to apply changes

### Step 4: Test Registration
1. Try registering a new account
2. You should be immediately logged in without email verification
3. The account should work right away

## Solution 2: Handle Email Verification in Your App

If you want to keep email verification enabled, the updated code now includes:

1. **Better Error Messages**: Shows "Please verify your email" instead of "Invalid credentials"
2. **Email Verification Component**: Guides users through the verification process
3. **Resend Email Feature**: Users can request a new verification email

## Email Domain Restrictions

Note that some email domains are blocked by Supabase:
- ❌ `@example.com` - Blocked by Supabase
- ❌ `@test.com` - Usually blocked
- ✅ `@gmail.com` - Works fine
- ✅ `@outlook.com` - Works fine
- ✅ `@yahoo.com` - Works fine

## Testing the Fix

### Test with Email Verification Disabled:
1. Register: `testuser@gmail.com` / `password123`
2. Should immediately login and redirect to dashboard
3. Profile should be auto-created

### Test with Email Verification Enabled:
1. Register: `testuser@gmail.com` / `password123`
2. Should show email verification screen
3. Check email for verification link
4. Click link, then return to login

## Implementation Status

✅ **Fixed Login Error Messages** - Now shows proper verification messages  
✅ **Added Email Verification Component** - Guides users through verification  
✅ **Enhanced Registration Flow** - Handles both verification modes  
✅ **Better User Experience** - Clear instructions and feedback  

## Recommended Settings for Development

For the best development experience:
1. **Disable email verification** in Supabase dashboard
2. This allows immediate testing without email setup
3. Re-enable for production if needed

## Production Considerations

For production, you may want to:
1. Keep email verification enabled for security
2. Set up custom email templates
3. Configure proper email delivery settings
4. Add email domain whitelist if needed

---

**Quick Fix**: Go to Supabase Dashboard → Authentication → Settings → Turn OFF "Enable email confirmations" → Save