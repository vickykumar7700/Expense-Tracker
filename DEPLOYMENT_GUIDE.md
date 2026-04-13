# Vercel Deployment Guide - Expense Tracker

## Overview
This project consists of a React (Vite) frontend and Node.js (Express) backend. Both will be deployed to Vercel.

## Prerequisites
1. GitHub account with your repository pushed
2. Vercel account (https://vercel.com)
3. MongoDB Atlas account for database (https://www.mongodb.com/cloud/atlas)

## Step 1: Prepare Environment Variables

### MongoDB Setup (If not already done)
1. Go to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Replace `<username>` and `<password>` in your connection string

### Get Your JWT Secret
Create a secure JWT secret. You can generate one using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select "Frontend" as the project type
4. In the "Root Directory" section, set it to `frontend`
5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.vercel.app` (you'll get this after deploying backend)
   - Or initially use: `http://localhost:5000` for testing
6. Click "Deploy"
7. After deployment, copy your frontend URL (e.g., https://expense-tracker.vercel.app)

## Step 3: Deploy Backend to Vercel

### Option A: Deploy as Separate Vercel Project (Recommended)

1. Create a new GitHub repository for just the backend (or use a branch)
2. Go to https://vercel.com/new
3. Import the backend repository
4. In the "Root Directory" section, leave blank (or set to `backend`)
5. Add Environment Variables:
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://username:password@cluster.mongodb.net/expensedb`
   - Key: `JWT_SECRET`
   - Value: Your generated JWT secret
   - Key: `NODE_ENV`
   - Value: `production`
6. Click "Deploy"
7. Copy your backend URL (e.g., https://expense-tracker-backend.vercel.app)

### Option B: Deploy as Monorepo (In Same Vercel Project)

If deploying both from same repo:
1. In Vercel dashboard, create two separate Vercel projects:
   - One for `frontend/` directory
   - One for `backend/` directory
2. Each gets its own URL

## Step 4: Update Frontend with Correct Backend URL

1. Go to your frontend Vercel project settings
2. Find "Environment Variables"
3. Update `VITE_API_URL` to your actual backend URL
4. Redeploy the frontend to apply changes

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Try to register a new user
3. Try to login
4. Verify all API calls work correctly

## Environment Variables Summary

### Backend (.env on Vercel)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expensedb
JWT_SECRET=your_secret_key_here
NODE_ENV=production
PORT=5000
```

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-url.vercel.app
```

## Troubleshooting

### 404 on API calls
- Check that your `VITE_API_URL` in frontend doesn't have trailing slash
- Verify backend URL is correct and accessible
- Check CORS is enabled on backend

### MongoDB Connection Error
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas includes Vercel IPs (0.0.0.0/0)
- Test connection string locally first

### Build Failures
- Check that all dependencies are in `package.json`
- Ensure `build` script works locally: `npm run build`
- Check for any hardcoded environment variables

### CORS Errors
- Backend already has CORS enabled for all origins
- Verify API_URL in frontend matches your backend URL exactly

## Vercel-Specific Notes

1. **Build Output**: Frontend builds to `dist/` directory ✓
2. **Production Environment**: Uses .env.production file ✓
3. **API Routing**: No serverless functions needed for this setup ✓
4. **Cold Starts**: MongoDB connection will have slight delay on first request ✓

## Local Development

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Security Best Practices

1. Never commit `.env` files to GitHub
2. Always use environment variables for secrets
3. Use strong JWT secret (minimum 32 characters)
4. Keep MongoDB URL private
5. Enable IP whitelist in MongoDB Atlas for production

## Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] VITE_API_URL updated in frontend
- [ ] Can register new users
- [ ] Can login successfully
- [ ] Can add expenses/income
- [ ] Admin panel works
- [ ] All CRUD operations functional

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for frontend errors
3. Test API endpoints directly using Postman or curl
4. Verify all environment variables are set correctly
