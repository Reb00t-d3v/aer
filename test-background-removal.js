const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Constants
const API_URL = 'http://localhost:5000/api';
const TEST_IMAGE_PATH = path.join(__dirname, 'tmp/original_RUwfqYFHCEIfluXmVzY6Q.jpg');
const COOKIE_JAR = path.join(__dirname, 'cookies.txt');

// Helper to extract cookies from curl format
function parseCookieFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');
    const cookies = {};
    
    for (const line of lines) {
      if (line.startsWith('#') || line.trim() === '') continue;
      const parts = line.split('\t');
      if (parts.length >= 7) {
        cookies[parts[5]] = parts[6];
      }
    }
    
    // Format cookies for fetch
    return Object.entries(cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  } catch (error) {
    console.error('Error parsing cookie file:', error.message);
    return '';
  }
}

// Login function
async function login() {
  console.log('🔑 Logging in...');
  
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }
    
    // Save cookies
    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      // This is simplified - in a real app you'd parse and save the cookies properly
      console.log('✅ Login successful, session established');
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Login error:', error.message);
    return null;
  }
}

// Function to test background removal
async function testBackgroundRemoval() {
  console.log('🖼️  Testing background removal API...');
  
  try {
    // Check if test image exists
    if (!fs.existsSync(TEST_IMAGE_PATH)) {
      console.error(`❌ Test image not found at: ${TEST_IMAGE_PATH}`);
      return;
    }
    
    // Read the image
    const imageBuffer = fs.readFileSync(TEST_IMAGE_PATH);
    const base64Image = imageBuffer.toString('base64');
    
    // Read cookies from file
    const cookies = parseCookieFile(COOKIE_JAR);
    
    // Call the API
    const response = await fetch(`${API_URL}/remove-background`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      body: JSON.stringify({
        image: `data:image/jpeg;base64,${base64Image}`
      })
    });
    
    console.log(`📡 Status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error:', errorText);
      return;
    }
    
    const result = await response.json();
    console.log('✅ Background removal successful');
    console.log('📄 Result:', result);
    
    // If there's a processed image URL, you could download it to verify
    if (result.processedUrl) {
      console.log(`🔗 Processed image: ${result.processedUrl}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Main function
async function main() {
  console.log('🚀 Starting background removal API test\n');
  
  // First step: login
  const user = await login();
  
  if (!user) {
    console.error('❌ Cannot proceed with test as login failed');
    return;
  }
  
  console.log(`👤 Logged in as: ${user.username}\n`);
  
  // Test the background removal API
  await testBackgroundRemoval();
  
  console.log('\n✅ Test completed');
}

// Run the test
main();