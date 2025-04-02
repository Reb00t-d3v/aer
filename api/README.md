# Vercel API Routes

This folder contains serverless functions that will be deployed as API routes on Vercel.

Each file in this directory becomes a serverless function with the same name as the endpoint:

- `/api/index.ts` - Main API handler
- `/api/user.ts` - Get current user data
- `/api/login.ts` - User login endpoint
- `/api/register.ts` - User registration endpoint
- `/api/logout.ts` - User logout endpoint
- `/api/images.ts` - Get user's processed images
- `/api/image.ts` - Serve image files
- `/api/remove-background.ts` - Process images with remove.bg API

These endpoints use the same business logic as the Express server but are structured as serverless functions.

## Deployment

When deployed to Vercel, these files will be automatically processed and deployed as serverless functions.