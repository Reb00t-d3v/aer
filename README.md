# Background Removal App

A modern, AI-powered background removal website that offers intuitive image editing with dynamic user interactions and progressive feature rollout.

## Features

- User authentication with secure password hashing
- Professional background removal using remove.bg API
- Tiered subscription model:
  - Free tier: Process up to 2 images
  - Premium tier: Process up to 100 images/month
  - Business tier: Unlimited image processing
- Dark-themed UI with interactive cursor effects
- Mobile-responsive design with glassmorphism effects
- Image history and user dashboard
- Cloud storage compatibility for serverless deployment

## Deploying to Vercel

This application is fully compatible with Vercel deployment. Follow these steps to deploy:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to Vercel and create a new project
3. Import your repository
4. Configure the build settings:
   - Framework preset: Other
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

5. Set the following environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `REMOVE_BG_API_KEY`: Your remove.bg API key
   - `SESSION_SECRET`: A random string for session encryption
   - `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`: PostgreSQL connection details
   - `VITE_STRIPE_PUBLIC_KEY` and `STRIPE_SECRET_KEY` (if using Stripe)

6. Deploy!

## Troubleshooting Deployment

If you encounter the issue where the application displays raw code instead of rendering properly, check the following:

1. Ensure your `vercel.json` file is correctly configured:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": null,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.js" }
  ]
}
```

2. Verify that all environment variables are set correctly
3. Check the Vercel deployment logs for any build or runtime errors
4. Ensure the catch-all route in `server/routes.ts` is properly serving the SPA for client-side routing

## Additional Configuration

### Database Setup

The application uses PostgreSQL for data storage. During Vercel deployment, you should:

1. Set up a PostgreSQL database (such as Supabase, Neon, or Vercel Postgres)
2. Add the connection string as the `DATABASE_URL` environment variable
3. Set the individual PostgreSQL connection variables (`PGHOST`, etc.)
4. The tables will be created automatically on first run via Drizzle ORM

### API Keys

Make sure to add your `REMOVE_BG_API_KEY` as an environment variable. You can get one from [remove.bg](https://www.remove.bg/api).

For payment processing, obtain your Stripe API keys:
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your "Publishable key" (starts with `pk_`) as `VITE_STRIPE_PUBLIC_KEY`
3. Copy your "Secret key" (starts with `sk_`) as `STRIPE_SECRET_KEY`

## Local Development

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables in `.env`:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   REMOVE_BG_API_KEY=your_api_key
   SESSION_SECRET=your_secret_string
   ```
4. Run the development server with `npm run dev`

## Architecture

The application is built with:

- React with Vite for the frontend
- shadcn/ui components with Tailwind CSS for styling
- Node.js/Express backend with authentication
- PostgreSQL database with Drizzle ORM
- remove.bg API for professional background removal
- Vercel for deployment

The codebase is optimized for serverless deployment and uses cloud storage for images to be fully compatible with Vercel's deployment environment.