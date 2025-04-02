const { execSync } = require('child_process');
const fetch = require('node-fetch');
const path = require('path');

// Set environment variables needed for testing
process.env.VERCEL = '1';
process.env.VERCEL_URL = 'localhost:3000';

async function testEndpoint(endpoint, method = 'GET', body = null) {
  console.log(`\n🧪 Testing ${method} ${endpoint}`);
  
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const url = `http://localhost:3000/api${endpoint}`;
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type');
    
    console.log(`📡 Status: ${response.status}`);
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('📄 Response:', JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log(`📄 Response: ${text.length > 100 ? text.substring(0, 100) + '...' : text}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting API tests...');
  
  // Health check
  await testEndpoint('/');
  
  // Register a test user
  await testEndpoint('/register', 'POST', {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  });
  
  // Login with the test user
  await testEndpoint('/login', 'POST', {
    username: 'testuser',
    password: 'password123'
  });
  
  // Get user info
  await testEndpoint('/user');
  
  // Get images (should be empty at first)
  await testEndpoint('/images');
  
  console.log('\n✅ Tests completed');
}

// Main execution
console.log('📡 Starting Vercel development server...');
console.log('Press Ctrl+C when done testing');

// Use npx to run vercel dev in the background
const vercelProcess = execSync('npx vercel dev --listen 3000', { 
  stdio: 'inherit',
  detached: true 
});

// Run tests after a short delay to allow server to start
setTimeout(runTests, 5000);