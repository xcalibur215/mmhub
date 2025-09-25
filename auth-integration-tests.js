// Authentication System Integration Tests
// Run this in the browser console to test auth functionality

console.log('🧪 Starting MMHub Authentication Tests...\n');

// Test configuration
const TEST_USER = {
  email: `test${Date.now()}@mmhub.com`,
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User'
};

// Utility functions
const logTest = (testName, result, details = '') => {
  const status = result ? '✅' : '❌';
  console.log(`${status} ${testName}${details ? ': ' + details : ''}`);
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test 1: Supabase Connection
async function testSupabaseConnection() {
  console.log('\n📡 Testing Supabase Connection...');
  
  try {
    // Import Supabase client
    const { supabase } = await import('/src/lib/supabase.ts');
    
    if (!supabase) {
      logTest('Supabase Client', false, 'Client not initialized');
      return false;
    }
    
    // Test basic connection by querying profiles table
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      logTest('Supabase Connection', false, error.message);
      return false;
    }
    
    logTest('Supabase Connection', true);
    return true;
  } catch (error) {
    logTest('Supabase Connection', false, error.message);
    return false;
  }
}

// Test 2: User Registration
async function testUserRegistration() {
  console.log('\n👤 Testing User Registration...');
  
  try {
    const { supabase } = await import('/src/lib/supabase.ts');
    
    const { data, error } = await supabase.auth.signUp({
      email: TEST_USER.email,
      password: TEST_USER.password,
      options: {
        data: {
          first_name: TEST_USER.firstName,
          last_name: TEST_USER.lastName,
          role: 'renter'
        }
      }
    });
    
    if (error) {
      logTest('User Registration', false, error.message);
      return { success: false, data: null };
    }
    
    const hasUser = !!data.user;
    const hasSession = !!data.session;
    
    logTest('User Registration', hasUser, `User created: ${hasUser}, Session: ${hasSession}`);
    
    return { 
      success: hasUser, 
      data: data,
      needsVerification: !hasSession 
    };
    
  } catch (error) {
    logTest('User Registration', false, error.message);
    return { success: false, data: null };
  }
}

// Test 3: User Login
async function testUserLogin(email = TEST_USER.email, password = TEST_USER.password) {
  console.log('\n🔑 Testing User Login...');
  
  try {
    const { supabase } = await import('/src/lib/supabase.ts');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      logTest('User Login', false, error.message);
      return { success: false, data: null };
    }
    
    const hasUser = !!data.user;
    const hasSession = !!data.session;
    
    logTest('User Login', hasUser && hasSession, `User: ${hasUser}, Session: ${hasSession}`);
    
    return { success: hasUser && hasSession, data };
    
  } catch (error) {
    logTest('User Login', false, error.message);
    return { success: false, data: null };
  }
}

// Test 4: Profile Creation
async function testProfileCreation(userId) {
  console.log('\n👨‍💼 Testing Profile Creation...');
  
  try {
    const { supabase } = await import('/src/lib/supabase.ts');
    
    // First check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (existingProfile) {
      logTest('Profile Creation', true, 'Profile already exists');
      return { success: true, data: existingProfile };
    }
    
    // Create new profile
    const profileData = {
      id: userId,
      username: TEST_USER.email.split('@')[0],
      first_name: TEST_USER.firstName,
      last_name: TEST_USER.lastName,
      role: 'renter',
      user_type: 'renter'
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single();
    
    if (error) {
      logTest('Profile Creation', false, error.message);
      return { success: false, data: null };
    }
    
    logTest('Profile Creation', true, `Profile created for ${data.username}`);
    return { success: true, data };
    
  } catch (error) {
    logTest('Profile Creation', false, error.message);
    return { success: false, data: null };
  }
}

// Test 5: Session Persistence
async function testSessionPersistence() {
  console.log('\n🔒 Testing Session Persistence...');
  
  try {
    const { supabase } = await import('/src/lib/supabase.ts');
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      logTest('Session Persistence', false, error.message);
      return false;
    }
    
    const hasValidSession = !!session && new Date(session.expires_at * 1000) > new Date();
    logTest('Session Persistence', hasValidSession, hasValidSession ? 'Valid session found' : 'No valid session');
    
    return hasValidSession;
    
  } catch (error) {
    logTest('Session Persistence', false, error.message);
    return false;
  }
}

// Test 6: Logout
async function testLogout() {
  console.log('\n👋 Testing Logout...');
  
  try {
    const { supabase } = await import('/src/lib/supabase.ts');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      logTest('Logout', false, error.message);
      return false;
    }
    
    // Verify session is cleared
    await delay(1000);
    const { data: { session } } = await supabase.auth.getSession();
    const sessionCleared = !session;
    
    logTest('Logout', sessionCleared, sessionCleared ? 'Session cleared' : 'Session still active');
    return sessionCleared;
    
  } catch (error) {
    logTest('Logout', false, error.message);
    return false;
  }
}

// Main test runner
async function runAuthTests() {
  console.log('🚀 MMHub Authentication System Tests');
  console.log('=====================================\n');
  
  const results = {
    connection: false,
    registration: false,
    login: false,
    profile: false,
    session: false,
    logout: false
  };
  
  // Test 1: Connection
  results.connection = await testSupabaseConnection();
  if (!results.connection) {
    console.log('\n❌ Connection failed - stopping tests');
    return results;
  }
  
  // Test 2: Registration
  const regResult = await testUserRegistration();
  results.registration = regResult.success;
  
  let loginResult = null;
  
  // Test 3: Login (only if registration succeeded or if we need to verify email)
  if (results.registration) {
    if (regResult.needsVerification) {
      console.log('\n⚠️  Email verification required - trying to login anyway...');
    }
    loginResult = await testUserLogin();
    results.login = loginResult.success;
  }
  
  // Test 4: Profile (only if login succeeded)
  if (results.login && loginResult?.data?.user) {
    const profileResult = await testProfileCreation(loginResult.data.user.id);
    results.profile = profileResult.success;
  }
  
  // Test 5: Session persistence
  if (results.login) {
    results.session = await testSessionPersistence();
  }
  
  // Test 6: Logout
  if (results.session) {
    results.logout = await testLogout();
  }
  
  // Summary
  console.log('\n📊 Test Results Summary');
  console.log('========================');
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    logTest(test.charAt(0).toUpperCase() + test.slice(1), passed);
  });
  
  console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All authentication tests passed! The system is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the details above for issues to fix.');
  }
  
  return results;
}

// Export for manual testing
window.runAuthTests = runAuthTests;
window.testAuthSystem = {
  connection: testSupabaseConnection,
  registration: testUserRegistration,
  login: testUserLogin,
  profile: testProfileCreation,
  session: testSessionPersistence,
  logout: testLogout
};

console.log('✨ Authentication tests loaded! Run: runAuthTests()');