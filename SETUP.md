# IEEE SBC Website - Setup Guide

## Quick Start

This is a comprehensive IEEE Education Society Student Branch Chapter website with a modern UI, animations, and a powerful admin dashboard.

## System Requirements
- Node.js 14+
- MongoDB (local or cloud)
- 2GB RAM minimum
- Modern web browser

## Installation Steps

### Step 1: Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### Step 2: Configure Environment
Create a `.env` file in the root directory:

```bash
# Copy template
cp .env.example .env

# Edit .env with your settings
# MONGODB_URI=mongodb://localhost:27017/ieee-sbc
# JWT_SECRET=your_secret_key_here
# PORT=5000
```

### Step 3: Start the Application

**Option 1: Run Both (Recommended)**
```bash
npm run dev
```

**Option 2: Run Separately**
```bash
# Terminal 1: Backend
npm run server:dev

# Terminal 2: Frontend
cd client && npm run dev
```

### Step 4: Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Admin Dashboard: http://localhost:5173/dashboard

## First Time Setup

### Create Admin Account
1. Go to http://localhost:5173/register
2. Create an account with your details
3. Use MongoDB Compass to update the role to "chairman"

### Or Use Demo Account
```
Email: user@ieee.edu
Password: password123
```

## Features Overview

### 🎨 Frontend
- Premium glassmorphism design
- Smooth animations and transitions
- Dark/Light mode toggle
- Full mobile responsiveness
- Real-time data updates

### 📱 Pages
- Landing page with hero section
- About page
- Events listing and details
- Photo gallery with lightbox
- Team member profiles
- Achievements timeline
- Contact form

### 🔐 Admin Dashboard
- Events management
- Gallery uploads
- Team management
- Achievements tracking
- User statistics

## Customization

### Update Colors
Edit `client/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#0066cc',
      secondary: '#00ccff',
    }
  }
}
```

### Update Branding
- Logo: `client/src/components/Navbar.jsx`
- Colors: `client/src/styles/globals.css`
- Fonts: `client/tailwind.config.js`

### Add Content
Use the Dashboard to add:
- Events
- Team members
- Gallery albums
- Achievements

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum),
  department: String,
  year: String,
  phone: String,
  bio: String,
  photo: String,
  socialMedia: Object
}
```

### Event
```javascript
{
  title: String,
  description: String,
  date: Date,
  time: String,
  venue: String,
  category: String,
  speakers: Array,
  poster: String,
  images: Array,
  registrationLink: String,
  status: String
}
```

## Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=5001
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- Verify username/password for MongoDB Atlas

### Frontend Not Loading
- Clear browser cache (Ctrl+Shift+Delete)
- Check console for errors (F12)
- Ensure backend is running

### API Errors
- Check network tab in DevTools
- Verify CORS settings
- Ensure authentication token is valid

## Deployment Checklist

- [ ] Update environment variables for production
- [ ] Set JWT_SECRET to a strong random value
- [ ] Use MongoDB Atlas for production database
- [ ] Set NODE_ENV=production
- [ ] Build frontend: `npm run client:build`
- [ ] Update API_URL in frontend config
- [ ] Test all features before deployment
- [ ] Set up SSL/HTTPS
- [ ] Configure domain name
- [ ] Set up email notifications (optional)

## Support & Help

For detailed documentation, see the main README.md file.

Questions? Check the API endpoints documentation or the code comments.

---

Happy coding! 🚀
