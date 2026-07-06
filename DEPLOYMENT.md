# Smart Asset Management — Deployment Guide

## Overview
- Frontend → Vercel (free)
- Backend → Render (free)
- Database → MongoDB Atlas (free)

---

## Step 1 — MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com → Sign up free
2. Create a FREE cluster (M0 tier)
3. Click Connect → Drivers → Node.js
4. Copy connection string:
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/smart_asset_db
5. Network Access → Add IP → Allow from Anywhere (0.0.0.0/0)

---

## Step 2 — Push to GitHub

1. Create a new repo at https://github.com/new
   Name: smart-asset-management

2. In your project folder (smart-asset-v2), open terminal:

   git init
   git add .
   git commit -m "Initial commit - Smart Asset Management System"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/smart-asset-management.git
   git push -u origin main

---

## Step 3 — Deploy Backend on Render

1. Go to https://render.com → Sign up with GitHub
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - Name: smart-asset-backend
   - Root Directory: server
   - Environment: Node
   - Build Command: npm install
   - Start Command: node server.js
   - Plan: Free

5. Add Environment Variables (click "Environment"):
   NODE_ENV          = production
   MONGODB_URI       = mongodb+srv://... (your Atlas URL)
   JWT_SECRET        = smartasset_jwt_secret_2024_very_long_string
   JWT_EXPIRE        = 15m
   JWT_REFRESH_SECRET= smartasset_refresh_secret_2024_very_long_string
   JWT_REFRESH_EXPIRE= 7d
   CLIENT_URL        = https://your-app.vercel.app (add after Step 4)
   COOKIE_SECRET     = smartasset_cookie_secret_2024_long_string

6. Click "Create Web Service"
7. Wait 3-5 minutes for deploy
8. Copy your backend URL: https://smart-asset-backend.onrender.com

---

## Step 4 — Deploy Frontend on Vercel

1. Go to https://vercel.com → Sign up with GitHub
2. Click "New Project"
3. Import your GitHub repo
4. Configure:
   - Framework: Vite
   - Root Directory: client
   - Build Command: npm run build
   - Output Directory: dist

5. Add Environment Variable:
   VITE_API_URL = https://smart-asset-backend.onrender.com/api/v1

6. Click "Deploy"
7. Copy your frontend URL: https://smart-asset.vercel.app

---

## Step 5 — Update Backend CORS

1. Go to Render dashboard → Your service → Environment
2. Update CLIENT_URL to your Vercel URL:
   CLIENT_URL = https://smart-asset.vercel.app
3. Render will auto-redeploy

---

## Step 6 — Seed Admin User on Production

After backend deploys, open Render Shell or run locally with Atlas URI:

   MONGODB_URI=your_atlas_uri node scripts/seedAdmin.js

Or use your local terminal:
   cd server
   (temporarily change .env MONGODB_URI to Atlas URL)
   npm run seed
   (change .env back to localhost)

---

## Step 7 — Test Production

1. Open your Vercel URL
2. Login with: admin@smartasset.com / Admin@123
3. Test all features

---

## Important Notes

- Render free tier SPINS DOWN after 15 min of inactivity
  First request after sleep takes 30-60 seconds
  This is normal on free tier

- MongoDB Atlas free tier has 512MB storage limit
  More than enough for college project

- Vercel has unlimited bandwidth on free tier

---

## Your URLs after deployment

Frontend:  https://smart-asset-management.vercel.app
Backend:   https://smart-asset-backend.onrender.com
API Health: https://smart-asset-backend.onrender.com/api/health
