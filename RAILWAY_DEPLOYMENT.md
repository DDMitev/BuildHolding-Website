# BuildHolding Website: Railway Deployment Guide

This guide walks you through deploying the BuildHolding Website backend API on Railway, which will work with your existing Netlify frontend deployment.

## Step 1: Sign Up for Railway

1. Go to [Railway](https://railway.app/) and create an account
   - You can sign up with GitHub for easier repository access
   - No credit card is required for the free tier (5 hours of build time per month)

## Step 2: Create a MongoDB Database

1. From your Railway dashboard, click "New Project"
2. Select "Provision MongoDB"
3. Once created, you'll see your new MongoDB project
4. Click on "MongoDB" in your project dashboard
5. Go to the "Connect" tab
6. Note down the MongoDB connection string (we'll need this later)

## Step 3: Deploy Your Backend API

1. From your Railway dashboard, click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your "BuildHolding-Website" repository
4. In the setup screen:
   - Railway will detect your project's structure using the railway.json file
   - Set the root directory to `/` (the root of your repository)

5. Add environment variables by clicking on "Variables":
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: (generate a random string or use the default)
   - `MONGODB_URI`: (paste the MongoDB connection string from Step 2)

6. Click "Deploy" to start the deployment process
   - Railway will automatically build and deploy your API

## Step 4: Set Up URL and Check Deployment

1. After deployment, go to the "Settings" tab
2. Under "Domains", click "Generate Domain"
3. You'll get a public URL like: `https://buildholding-api.up.railway.app`
4. Visit `https://buildholding-api.up.railway.app/api/healthcheck` to verify your API is running

## Step 5: Update Netlify Environment Variables

1. Go to your Netlify dashboard
2. Select your BuildHolding Website project
3. Go to "Site settings" → "Build & deploy" → "Environment variables"
4. Add or update the following variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://buildholding-api.up.railway.app/api` (use your actual Railway URL)
5. Trigger a new deployment in Netlify

## Step 6: Create Admin User

1. Visit `https://buildholding-api.up.railway.app/api/create-admin` in your browser
   - This will create the default admin user account
   - You should see a success message in JSON format

## Step 7: Test Login

1. Go to your Netlify-deployed website
2. Navigate to `/admin/login`
3. Log in with:
   - Email: `admin@buildholding.com`
   - Password: `admin123`

## Maintenance

- Railway's free tier gives you 5 project hours per month (enough for testing)
- Your API will sleep when not in use and wake up when requested
- For production use, consider upgrading to a paid plan ($5-10/month)

## Troubleshooting

- If login fails, check your browser console for API connection errors
- Verify that your API is running by visiting the healthcheck endpoint
- Ensure CORS settings in your API allow requests from your Netlify domain
