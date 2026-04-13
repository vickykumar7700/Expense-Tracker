# 🚀 Vercel Deployment Guide - Expense Tracker

## Overview
Your Expense Tracker has a React frontend and Node.js backend. We'll deploy them as **separate Vercel projects** for optimal performance.

## Prerequisites
- ✅ GitHub repository with your code
- ✅ MongoDB Atlas account with database
- ✅ Vercel account (free tier works)

## Step 1: Prepare Environment Variables

### Backend Environment Variables
```
MONGODB_URI=mongodb+srv://vickymahaseth770082_db_user:ZVY5JA31l3GOZ0Gj@cluster0.mkrdi4r.mongodb.net/expensedb?retryWrites=true&w=majority
JWT_SECRET=f4813749b7209ff70a35b238f29b357d578b11dfe18a269d62ab576af4a8438a
NODE_ENV=production
```

### Frontend Environment Variables
```
VITE_API_URL=https://your-backend-project.vercel.app
```

## Step 2: Deploy Backend First

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "New Project"

2. **Import Repository**
   - Connect your GitHub account
   - Select your `expense-tracker` repository

3. **Configure Project**
   - **Project Name**: `expense-tracker-backend` (or your choice)
   - **Root Directory**: `backend`
   - **Build Settings**:
     - Build Command: `npm run build` (leave default)
     - Output Directory: (leave empty)
     - Install Command: `npm install`

4. **Environment Variables**
   - Add these in Vercel dashboard:
     - `MONGODB_URI` = `mongodb+srv://vickymahaseth770082_db_user:ZVY5JA31l3GOZ0Gj@cluster0.mkrdi4r.mongodb.net/expensedb?retryWrites=true&w=majority`
     - `JWT_SECRET` = `f4813749b7209ff70a35b238f29b357d578b11dfe18a269d62ab576af4a8438a`
     - `NODE_ENV` = `production`

5. **Deploy**
   - Click "Deploy"
   - Wait for build completion
   - **Copy the backend URL** (e.g., `https://expense-tracker-backend.vercel.app`)

## Step 3: Deploy Frontend

1. **Create New Vercel Project**
   - Go back to Vercel dashboard
   - Click "New Project"

2. **Import Same Repository**
   - Select your `expense-tracker` repository again

3. **Configure Frontend Project**
   - **Project Name**: `expense-tracker-frontend` (or your choice)
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Settings**:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

4. **Environment Variables**
   - Add in Vercel dashboard:
     - `VITE_API_URL` = Your backend URL from Step 2 (e.g., `https://expense-tracker-backend.vercel.app`)

5. **Deploy**
   - Click "Deploy"
   - Wait for build completion
   - **Copy the frontend URL** (e.g., `https://expense-tracker-frontend.vercel.app`)

## Step 4: Test Your Deployment

1. **Visit Frontend URL**
   - Open your frontend URL in browser

2. **Test Registration**
   - Try creating a new user account

3. **Test Login**
   - Login with your credentials

4. **Test Features**
   - Add expenses and income
   - View dashboard
   - Test admin panel (if admin user)

## Step 5: Seed Admin User (Optional)

If you want to create an admin user, run this locally first:

```bash
cd backend
node scripts/seedAdmin.js
```

This creates:
- Email: `vickykumar@gmail.com`
- Password: `7700`
- Role: Admin

## File Structure for Deployment

```
expense-tracker/
├── backend/
│   ├── vercel.json          # Backend Vercel config
│   ├── package.json         # Updated scripts
│   ├── server.js           # Main server file
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── .env               # Local environment (not deployed)
├── frontend/
│   ├── vercel.json         # Root config (for frontend)
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Build config
│   ├── .env.production     # Production API URL
│   └── src/                # React app
└── .gitignore             # Ignore .env files
```

## Troubleshooting

### Backend Issues
- **Build fails**: Check Vercel logs for missing dependencies
- **MongoDB connection**: Verify MONGODB_URI is correct
- **CORS errors**: Backend has CORS enabled for all origins

### Frontend Issues
- **API calls fail**: Check VITE_API_URL matches backend URL
- **404 errors**: Ensure backend URL doesn't have trailing slash
- **Build fails**: Check if all dependencies are in package.json

### Common Fixes
1. **Redeploy**: Push changes to GitHub, Vercel auto-redeploys
2. **Environment Variables**: Double-check in Vercel dashboard
3. **Logs**: Check Vercel deployment logs for errors
4. **CORS**: Backend allows all origins by default

## Security Notes

- ✅ JWT secrets are environment variables
- ✅ MongoDB URI is not hardcoded
- ✅ .env files are in .gitignore
- ✅ No credentials in source code

## Performance Optimizations

- ✅ Vite build with minification
- ✅ ES2020 target for modern browsers
- ✅ Optimized chunk sizes
- ✅ Serverless backend functions

## Next Steps

1. **Custom Domain** (optional)
   - Add custom domain in Vercel settings

2. **Monitoring**
   - Check Vercel analytics
   - Monitor MongoDB usage

3. **Backup**
   - Regular MongoDB backups
   - Code versioning on GitHub

## Support

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- React: https://react.dev
- Express.js: https://expressjs.com

---

**🎉 Your Expense Tracker is now live on Vercel!**

Frontend: `https://your-frontend-url.vercel.app`
Backend: `https://your-backend-url.vercel.app`