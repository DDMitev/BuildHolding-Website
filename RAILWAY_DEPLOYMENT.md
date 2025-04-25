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
6. Copy the MongoDB connection string (we'll need this for Step 3)

## Step 3: Deploy Your Backend API

1. From your Railway dashboard, click "New Project" again
2. Select "Deploy from GitHub repo"
3. Choose your "BuildHolding-Website" repository
4. In the setup screen:
   - Railway will detect your project's structure using the railway.json file
   - Set the root directory to `/` (the root of your repository)

5. **First, deploy without environment variables:**
   - Complete the initial deployment without adding variables
   - This will likely fail with connection errors (this is expected)
   
6. **After initial deployment, add environment variables:**
   - Click on your project, then go to "Variables" tab
   - Add the following variables:
     - `NODE_ENV`: `production`
     - `JWT_SECRET`: (generate a random string or use `buildholdingsecret123`)
     - `MONGODB_URI`: (paste the complete MongoDB connection string from Step 2)
   - Click "Deploy" to redeploy with the environment variables

7. **Check the deployment logs:**
   - Go to the "Deployments" tab and click on the latest deployment
   - Review the logs to ensure everything is working correctly
   - You should see "MongoDB Connected" in the logs

## Step 4: Set Up URL and Check Deployment

1. After successful deployment, go to the "Settings" tab
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

1. Visit `https://buildholding-api.up.railway.app/api/debug/create-admin` in your browser
   - This will create the default admin user account
   - You should see a success message in JSON format

## Step 7: Test Login

1. Go to your Netlify-deployed website
2. Navigate to `/admin/login`
3. Log in with:
   - Email: `admin@buildholding.com`
   - Password: `admin123`
4. You should now be able to access the admin dashboard

## Troubleshooting

### MongoDB Connection Issues
- Double-check that your `MONGODB_URI` is correctly copied from Railway's MongoDB connection tab
- Make sure there are no extra spaces or characters in the connection string
- The connection string should look like: `mongodb://user:password@host:port/database`

### Railway Build Failures
- Check the deployment logs for specific error messages
- If you see "Error: MONGODB_URI environment variable not set", go to the Variables tab and add it
- Remember that each new deployment will rerun the setup scripts

### Frontend API Connection Issues
- Open your browser developer tools (F12) and check the Console and Network tabs
- Verify the API requests are going to your Railway backend URL, not localhost
- If needed, clear your browser cache or use incognito mode to test

## Maintenance

- Railway's free tier gives you 5 project hours per month (enough for testing)
- For production use, consider upgrading to a paid plan ($5-10/month)
- Your application's data is stored in the MongoDB database on Railway
