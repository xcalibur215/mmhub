import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { UserProfile } from '@/types';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ 
    ok: boolean; 
    error?: Error; 
    user?: User; 
    session?: Session;
  }>;
  signup: (email: string, password: string, userData?: { 
    first_name?: string; 
    last_name?: string; 
    role?: string;
  }) => Promise<{ 
    ok: boolean; 
    error?: Error; 
    user?: User; 
    session?: Session | null;
    needsVerification?: boolean;
  }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getSession = async () => {
      if (!supabase) {
        console.log('Supabase client not initialized');
        setIsLoading(false);
        return;
      }
      console.log('Supabase client initialized');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('session', session);
      console.log('user', session?.user);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user);
      }
      setIsLoading(false);
    };

    getSession();

    if (!supabase) return;
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (user: User) => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist, try to create one
        if (error.code === 'PGRST116') { // No rows returned
          console.log('Profile not found, creating new profile...');
          
          // Special handling for admin user
          const isAdminUser = user.email === 'admin@mmhub.com';
          
          const newProfile = {
            id: user.id,
            username: user.email?.split('@')[0] || 'user',
            first_name: isAdminUser ? 'Admin' : (user.user_metadata?.first_name || ''),
            last_name: isAdminUser ? 'User' : (user.user_metadata?.last_name || ''),
            role: isAdminUser ? 'admin' : (user.user_metadata?.role || 'renter'),
            user_type: isAdminUser ? 'admin' : 'renter',
            bio: isAdminUser ? 'Platform administrator managing MMHub operations across Thailand' : null,
            avatar_url: isAdminUser ? 'https://i.pravatar.cc/150?img=1' : null,
            phone: isAdminUser ? '+66-2-123-4567' : null,
            location: isAdminUser ? 'Bangkok, Thailand' : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating profile:', createError);
            // Set a fallback profile so user can still use the app
            const isAdminUser = user.email === 'admin@mmhub.com';
            const fallbackProfile: UserProfile = {
              id: user.id,
              username: user.email?.split('@')[0] || 'user',
              role: isAdminUser ? 'admin' : 'renter',
              first_name: isAdminUser ? 'Admin' : (user.user_metadata?.first_name || ''),
              last_name: isAdminUser ? 'User' : (user.user_metadata?.last_name || ''),
              user_type: isAdminUser ? 'admin' : 'renter',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setProfile(fallbackProfile);
          } else {
            console.log('Profile created successfully:', createdProfile);
            setProfile(createdProfile as UserProfile);
          }
        }
      } else {
        setProfile(data as UserProfile);
      }
    } catch (err) {
      console.error('Unexpected error in fetchProfile:', err);
    }
  };

  const login = async (email: string, password: string) => {
    if (!supabase) {
      return { ok: false, error: new Error('Supabase client not initialized') };
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Login error:', error);
        
        // Provide more user-friendly error messages
        let userMessage = error.message;
        if (error.message?.includes('Invalid login credentials')) {
          userMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message?.includes('Email not confirmed')) {
          userMessage = 'Please check your email and click the confirmation link to verify your account before logging in.';
        } else if (error.message?.includes('email_not_confirmed')) {
          userMessage = 'Please check your email and click the confirmation link to verify your account before logging in.';
        } else if (error.message?.includes('Too many requests')) {
          userMessage = 'Too many login attempts. Please wait a moment before trying again.';
        } else if (error.message?.includes('signup_disabled')) {
          userMessage = 'New user registration is currently disabled. Please contact support.';
        }
        
        return { ok: false, error: { ...error, message: userMessage } };
      }
      
      // Ensure we have a user and session
      if (!data.user || !data.session) {
        return { ok: false, error: new Error('Login succeeded but no session was created') };
      }
      
      console.log('Login successful:', data);
      
      // Fetch or create profile immediately after login
      await fetchProfile(data.user);
      
      return { ok: true, user: data.user, session: data.session };
    } catch (error) {
      console.error('Unexpected login error:', error);
      return { ok: false, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, userData?: { first_name?: string; last_name?: string; role?: string }) => {
    if (!supabase) {
      return { ok: false, error: new Error('Supabase client not initialized') };
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData?.first_name || '',
            last_name: userData?.last_name || '',
            role: userData?.role || 'renter'
          }
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        
        // Provide more user-friendly error messages
        let userMessage = error.message;
        if (error.message?.includes('User already registered')) {
          userMessage = 'An account with this email already exists. Please try logging in instead.';
        } else if (error.message?.includes('Password should be at least')) {
          userMessage = 'Password must be at least 6 characters long.';
        } else if (error.message?.includes('Unable to validate email address')) {
          userMessage = 'Please enter a valid email address.';
        } else if (error.message?.includes('email_address_invalid')) {
          userMessage = 'Please enter a valid email address. Some email domains may not be supported.';
        } else if (error.message?.includes('signup_disabled')) {
          userMessage = 'New user registration is currently disabled. Please contact support.';
        }
        
        return { ok: false, error: { ...error, message: userMessage } };
      }
      
      // Check if user was created
      if (!data.user) {
        return { ok: false, error: new Error('Signup failed - no user created') };
      }
      
      console.log('Signup successful:', data);
      
      // If we have a session (no email verification required), fetch/create profile
      if (data.session) {
        await fetchProfile(data.user);
        return { ok: true, user: data.user, session: data.session, needsVerification: false };
      }
      
      // If no session, email verification is required
      return { ok: true, user: data.user, session: null, needsVerification: true };
      
    } catch (error) {
      console.error('Unexpected signup error:', error);
      return { ok: false, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!supabase) {
      console.error('Cannot logout: Supabase client not initialized');
      return;
    }
    
    console.log('Starting logout process...');
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error);
        throw error;
      }
      
      console.log('Supabase signOut successful, clearing local state...');
      
      // Clear all local state
      setUser(null);
      setProfile(null);
      setSession(null);
      
      // Clear any potential cached data
      try {
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
      } catch (storageError) {
        console.warn('Error clearing storage:', storageError);
      }
      
      console.log('Logout completed successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear local state
      setUser(null);
      setProfile(null);
      setSession(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh profile data
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error refreshing profile:', error);
        return;
      }

      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const value: AuthContextValue = {
    user,
    profile,
    session,
    isLoading,
    login,
    signup,
    logout,
    refreshProfile,
    isAdmin: !!profile && (profile.role === 'admin' || profile.user_type === 'admin'),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};