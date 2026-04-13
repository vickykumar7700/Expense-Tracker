# Quick Deployment Commands

## 1. Prepare Your Repository

```bash
# Initialize git if not done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Deployment ready"

# Push to GitHub (create repo on GitHub first)
git remote add origin https://github.com/yourusername/expense-tracker.git
git branch -M main
git push -u origin main
```

## 2. Quick Environment Setup

### Create MongoDB Database
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Format: `mongodb+srv://username:password@cluster.mongodb.net/expensedb`

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Deploy Frontend First

```bash
# Visit https://vercel.com/new
# 1. Import your GitHub repo
# 2. Set Root Directory to: frontend
# 3. Add Env Var:
#    - VITE_API_URL = http://localhost:5000 (temporary)
# 4. Deploy
# 5. Copy the frontend URL
```

## 4. Deploy Backend

```bash
# Create a separate Vercel project for backend
# Visit https://vercel.com/new
# 1. Import same GitHub repo
# 2. Set Root Directory to: backend
# 3. Add Env Vars:
#    - MONGODB_URI = your_mongodb_connection_string
#    - JWT_SECRET = your_generated_secret
#    - NODE_ENV = production
# 4. Deploy
# 5. Copy the backend URL
```

## 5. Update Frontend with Backend URL

```bash
# Go to Frontend Vercel Project > Settings > Environment Variables
# Update VITE_API_URL to your backend URL
# Redeploy frontend (git push triggers auto-deploy)
```

## 6. Verify Everything Works

Visit your frontend URL and test:
- Register new user
- Login
- Add expense/income
- View dashboard
- Admin login

## Automated Deployment

After initial setup, every push to `main` branch auto-deploys:

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Vercel automatically builds and deploys!
```

## Environment Files

### Local Development
- Backend: Create `.env` with MONGODB_URI and JWT_SECRET
- Frontend: Uses default `http://localhost:5000`

### Production
- Backend: Set in Vercel Environment Variables
- Frontend: `.env.production` with correct API_URL (auto-used in build)

## Troubleshooting Commands

```bash
# Build frontend locally to test
cd frontend && npm run build

# Test API locally
curl http://localhost:5000/api/auth/users -H "Authorization: Bearer YOUR_TOKEN"

# Check backend logs in Vercel dashboard
# Navigate to: Project > Deployment > View Logs
```

## Next Steps

1. Monitor Vercel deployments
2. Check MongoDB for data
3. Setup monitoring/alerts
4. Configure custom domain (optional)
5. Set up HTTPS (auto by Vercel)
