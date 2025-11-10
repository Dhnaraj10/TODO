# Deployment Guide for TODO Application

This guide explains how to deploy the TODO application to production environments.

## Architecture Overview

The application consists of three main components:
1. **Frontend**: React application
2. **Backend**: Node.js/Express API server
3. **Database**: MongoDB instance

These components can be hosted separately or together depending on your hosting solution.

## Deployment Options

### Option 1: Vercel + Render + MongoDB Atlas (Recommended)

This is a cost-effective solution using free tiers of popular services.

#### Step 1: Database Setup (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a free cluster
3. Create a database user and whitelist your IP addresses
4. Get your connection string (similar to):
   ```
   mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/todoapp
   ```

#### Step 2: Backend Deployment (Render)
1. Fork your repository to GitHub
2. Go to [Render](https://render.com/)
3. Create a new Web Service
4. Connect your GitHub repository
5. Set the following configuration:
   - Build command: `npm install`
   - Start command: `node app.js`
   - Environment variables:
     - PORT: `1000`
     - MONGO_URI: `[Your MongoDB connection string]`
     - FRONTEND_URL: `[Your frontend URL]`

#### Step 3: Frontend Deployment (Vercel)
1. Go to [Vercel](https://vercel.com/)
2. Create a new project
3. Connect your GitHub repository
4. Set the following configuration:
   - Build command: `npm run build`
   - Output directory: `build`
   - Install command: `npm install`
   - Environment variables:
     - REACT_APP_BASE_URL: `[Your backend URL from Render]`

### Option 2: Single Provider (Heroku, Railway, etc.)

You can also deploy both frontend and backend to providers like:
- Heroku
- Railway
- DigitalOcean App Platform

With these providers, you would typically:
1. Modify the build process to build the React app during backend deployment
2. Serve the React app as static files from your Express server

To do this, add this to your backend [app.js](file:///D:/project/TODO/backend/app.js) before your routes:
```javascript
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}
```

And add this to your backend [package.json](file:///D:/project/TODO/backend/package.json):
```json
"scripts": {
  "start": "node app.js",
  "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix ../frontend && npm run build --prefix ../frontend"
}
```

## Environment Variables

### Backend (.env)
```
PORT=1000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
FRONTEND_URL=https://yourfrontenddomain.com
```

### Frontend (.env)
```
REACT_APP_BASE_URL=https://yourbackenddomain.com
```

## CORS Configuration

The application uses a flexible CORS configuration that allows:
1. Local development URLs (http://localhost:3000)
2. Specific production domains
3. Any Vercel deployment (*.vercel.app)

This approach eliminates the need to update CORS settings every time a new frontend deployment is created.

If you need to restrict access to specific domains, you can:
1. Update the `allowedOrigins` array in `backend/app.js`
2. Set the `FRONTEND_URL` environment variable in your Render deployment

## Troubleshooting

### CORS Issues
If you encounter CORS issues:
1. Check that your frontend domain is either in the allowedOrigins array or ends with .vercel.app
2. Ensure the FRONTEND_URL environment variable is correctly set in your Render deployment
3. Check Render logs for "CORS blocked origin" messages

### Manifest.json 401 Errors
The application now includes a custom route for manifest.json to prevent 401 errors in browser consoles. This is a cosmetic fix and does not affect application functionality.

## Scaling Considerations

For production use:
1. Add input validation and sanitization
2. Implement rate limiting
3. Add logging and monitoring
4. Set up automated backups for your database
5. Consider using a CDN for static assets