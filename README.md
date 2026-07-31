# IEEE Education Society SBC Website

A premium, modern, and fully responsive website for IEEE Education Society Student Branch Chapter with a powerful role-based admin dashboard.

## Features

### 🌐 Frontend Features
- **Premium UI/UX Design** with glassmorphism and gradients
- **Smooth Animations** using Framer Motion
- **Dark Mode & Light Mode** with persistent preferences
- **Fully Responsive** - Mobile, Tablet, and Desktop optimized
- **Interactive Sections** with hover effects and transitions
- **Real-time Data** from backend API

### 📄 Pages
- **Home/Landing** - Hero section with animated background, statistics, and CTAs
- **About** - IEEE Education Society and SBC information
- **Events** - Upcoming and past events with filtering
- **Event Details** - Detailed event information with speakers
- **Gallery** - Masonry gallery with lightbox preview
- **Team** - Team member profiles with social links
- **Achievements** - Achievement timeline with categories
- **Contact** - Contact form and information

### 🔐 Authentication & Authorization
- **Role-Based Access Control** with 5 roles:
  - **Chairman**: Full control
  - **Faculty**: Manage activities and approvals
  - **Core Team**: Create and manage events/gallery
  - **Student Chairperson**: Manage announcements and featured content
  - **Student**: Basic member access

### 📊 Admin Dashboard
- **Dashboard Overview** - Real-time statistics
- **Events Manager** - Create, edit, delete events
- **Gallery Manager** - Manage photo albums and uploads
- **Team Manager** - Update team member information
- **Achievements Manager** - Record and manage achievements

### 🛠️ Technology Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Framer Motion (animations)
- Axios (API calls)
- React Router

**Backend:**
- Node.js
- Express
- MongoDB
- Firebase Admin SDK authentication

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone and Setup

```bash
# Navigate to project directory
cd IEEE

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Edit .env file with your MongoDB URI and Firebase Admin credentials
```

### 2. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running
# Default connection: mongodb://localhost:27017/ieee-sbc
```

**Option B: MongoDB Atlas**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ieee-sbc
```

### 3. Start the Application

```bash
# Start both frontend and backend (from root directory)
npm run dev

# Or start separately:
# Terminal 1 - Backend
npm run server:dev

# Terminal 2 - Frontend
cd client && npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## Demo Credentials

Use these credentials to login to the dashboard:

```
Email: user@ieee.edu
Password: password123

(Create your own account via registration page)
```

## Project Structure

```
IEEE/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Gallery.js
│   │   ├── Achievement.js
│   │   └── Content.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── events.js
│   │   ├── gallery.js
│   │   ├── team.js
│   │   ├── content.js
│   │   └── achievements.js
│   ├── middleware/
│   │   └── auth.js
│   └── index.js
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── EventDetails.jsx
│   │   │   ├── Gallery.jsx
│   │   │   ├── Team.jsx
│   │   │   ├── Achievements.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── BenefitsSection.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── TeamMemberCard.jsx
│   │   │   └── Dashboard/
│   │   │       ├── DashboardHome.jsx
│   │   │       ├── EventsManager.jsx
│   │   │       ├── GalleryManager.jsx
│   │   │       ├── TeamManager.jsx
│   │   │       └── AchievementsManager.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users (Chairman only)
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile/:id` - Update user profile

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Gallery
- `GET /api/gallery` - Get all galleries
- `GET /api/gallery/:id` - Get gallery details
- `POST /api/gallery` - Create gallery
- `PUT /api/gallery/:id` - Update gallery

### Team
- `GET /api/team` - Get all team members
- `PUT /api/team/:id` - Update team member (Chairman only)

### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/:id` - Get achievement details
- `POST /api/achievements` - Create achievement (Chairman only)
- `PUT /api/achievements/:id` - Update achievement (Chairman only)
- `DELETE /api/achievements/:id` - Delete achievement (Chairman only)

### Content
- `GET /api/content/:key` - Get content by key
- `PUT /api/content/:key` - Update content (Chairman only)

## Customization

### Add Your Organization Info
1. Update footer and navbar branding
2. Modify `About` page content
3. Update contact information in `Contact` page
4. Change color scheme in `tailwind.config.js`

### Add Team Members
Use the Dashboard → Team Manager to add team members with their profiles.

### Create Events
Use the Dashboard → Events Manager to create and manage events.

### Upload Gallery
Use the Dashboard → Gallery Manager to create albums and upload images.

### Record Achievements
Use the Dashboard → Achievements Manager to record achievements.

## Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/ieee-sbc

# Firebase Admin
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
# Or on Render, add this Secret File:
# /etc/secrets/firebase-service-account.json
# Or use split environment variables:
# FIREBASE_PROJECT_ID=
# FIREBASE_CLIENT_EMAIL=
# FIREBASE_PRIVATE_KEY=

# Server
PORT=5000
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the 'dist' folder
```

### Backend Deployment (Heroku/Railway)
```bash
npm run build
npm start
```

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance
- Optimized animations
- Lazy loading images
- Code splitting with React Router
- Efficient API calls
- Responsive images

## Security Features
- Firebase Authentication with Admin SDK token verification
- Role-based access control
- CORS enabled
- XSS protection
- Input validation

## Contributing
Feel free to submit issues and enhancement requests.

## License
This project is licensed under the MIT License.

## Support
For issues or questions, please contact:
- Email: support@ieee-sbc.edu
- Phone: +1 (234) 567-890

## Credits
Created with ❤️ for IEEE Education Society Student Branch Chapter

---

**Version**: 1.0.0
**Last Updated**: May 2026
