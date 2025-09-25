// Emergency logout utility
// Use this if the normal logout is stuck

export const emergencyLogout = () => {
  console.log('Emergency logout initiated');
  
  // Clear all possible storage
  try {
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear specific Supabase keys if they exist
    const keysToRemove = [
      'supabase.auth.token',
      'sb-wkjshlcwstzxvxnvowby-auth-token',
      'sb-auth-token',
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
  
  // Force page reload to home
  window.location.href = '/';
};

// For browser console access
(window as any).emergencyLogout = emergencyLogout;