import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import eventRoutes from './routes/events.js';
import galleryRoutes from './routes/gallery.js';
import teamRoutes from './routes/team.js';
import contentRoutes from './routes/content.js';
import { seedDemoUsers } from './utils/seedDemoUsers.js';
import { logBrevoEmailStartupStatus, verifySmtpTransporter } from './utils/email.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ieee-sbc')
  .then(async () => {
    console.log('MongoDB connected');
    await seedDemoUsers();
  })
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/content', contentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.get('/api/debug/email', async (req, res) => {
  const result = await verifySmtpTransporter({ reset: true });
  if (result.success) {
    return res.json({
      success: true,
      smtpConnected: true
    });
  }

  return res.status(500).json({
    success: false,
    smtpConnected: false,
    error: result.error
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  logBrevoEmailStartupStatus();
  verifySmtpTransporter({ reset: true })
    .then((result) => {
      if (result.success) {
        console.info('Brevo email API configuration valid:', result.config);
        return;
      }

      console.error('Brevo email API configuration failed:', {
        config: result.config,
        error: result.error
      });
    })
    .catch((error) => {
      console.error('Brevo email API configuration check crashed:', {
        message: error.message,
        code: error.code
      });
    });
});
