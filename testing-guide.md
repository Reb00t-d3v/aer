# Testing Vercel API Functions

## Method 1: Using Vercel CLI (Recommended)

The Vercel CLI allows you to run your serverless functions locally, exactly as they would run in the Vercel environment.

1. **Install Vercel CLI (already done):**
   ```
   npm install -g vercel
   ```

2. **Link your project with Vercel:**
   ```
   vercel login
   vercel link
   ```

3. **Run the Vercel development server:**
   ```
   vercel dev
   ```
   This will start a local server (usually on port 3000) that processes API requests through your Vercel functions.

4. **Test the endpoints:**
   - Register: `curl -X POST http://localhost:3000/api/register -H "Content-Type: application/json" -d '{"username":"testuser","email":"test@example.com","password":"password123"}'`
   - Login: `curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"username":"testuser","password":"password123"}' -c cookies.txt`
   - Get user: `curl http://localhost:3000/api/user -b cookies.txt`
   - Get images: `curl http://localhost:3000/api/images -b cookies.txt`
   - Logout: `curl -X POST http://localhost:3000/api/logout -b cookies.txt`

## Method 2: Use the Test Scripts

We've created a few test scripts to help you verify the API functionality:

1. **Basic API Tests:**
   ```
   chmod +x test-api.sh
   ./test-api.sh
   ```
   This script tests basic functionality like registration, login, and getting user data.

2. **Background Removal Test:**
   ```
   node test-background-removal.js
   ```
   This script specifically tests the image background removal functionality.

3. **Vercel API Tests:**
   ```
   node test-vercel-api.js
   ```
   This script starts a Vercel dev server and runs tests against the Vercel functions.

## Method 3: Manual Testing with Postman

You can also use Postman or similar API testing tools:

1. Start your server: `npm run dev` or `vercel dev`
2. Import the endpoints into Postman or Insomnia
3. Set the base URL to `http://localhost:5000` or `http://localhost:3000` (Vercel dev)
4. Start with the registration endpoint and progress through the user flow

## Testing Image Processing

To test image processing functionality:

1. Login first to get a valid session
2. Send a POST request to `/api/remove-background` with:
   - Content-Type: application/json
   - Body: `{"image": "data:image/jpeg;base64,BASE64_IMAGE_DATA"}`
   - Use the cookies from your login request

## Before Deploying to Vercel

Make sure all these tests pass before deploying to Vercel:

- User authentication (register, login, logout)
- Image processing with remove.bg API
- Session management
- Database operations