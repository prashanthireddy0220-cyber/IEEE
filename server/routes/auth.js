import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/security.js';
import { verifyFirebaseIdToken } from '../utils/firebaseAdmin.js';

const router = express.Router();

const sessionLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.AUTH_SESSION_RATE_LIMIT_MAX || 60),
  message: 'Too many requests. Please try again later.'
});

const publicUser = (user) => ({
  id: user._id,
  firebaseUid: user.firebaseUid,
  name: user.name,
  email: user.email,
  role: user.role,
  emailVerified: user.emailVerified
});

const getClientIp = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  const ip = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0];
  return (ip || req.ip || req.socket?.remoteAddress || '').trim();
};

const getBearerToken = (req) => {
  const authHeader = req.headers.authorization || '';
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
};

router.post('/session', sessionLimiter, async (req, res) => {
  try {
    const token = getBearerToken(req);
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const decoded = await verifyFirebaseIdToken(token);
    const email = decoded.email?.trim().toLowerCase();
    const name = (req.body?.name || decoded.name || email?.split('@')[0] || 'IEEE Member').trim();

    if (!email) return res.status(400).json({ message: 'Firebase account email is required' });

    let user = await User.findOne({ $or: [{ firebaseUid: decoded.uid }, { email }] });
    if (user) {
      user.firebaseUid = decoded.uid;
      user.email = email;
      user.emailVerified = Boolean(decoded.email_verified);
      user.lastLoginAt = new Date();
      user.lastLoginIp = getClientIp(req);
      user.lastLoginUserAgent = req.headers['user-agent'] || '';
      if (!user.name && name) user.name = name;
      await user.save();
    } else {
      user = await User.create({
        firebaseUid: decoded.uid,
        name,
        email,
        role: 'student',
        emailVerified: Boolean(decoded.email_verified),
        isActive: true,
        lastLoginAt: new Date(),
        lastLoginIp: getClientIp(req),
        lastLoginUserAgent: req.headers['user-agent'] || ''
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    res.json({ user: publicUser(user) });
  } catch (error) {
    console.error('Firebase session failed:', error.message);
    res.status(401).json({ message: 'Authentication required' });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    if (!user) return res.status(401).json({ message: 'Authentication required' });

    res.json({ user: publicUser(user) });
  } catch (error) {
    console.error('Session lookup failed:', error.message);
    res.status(401).json({ message: 'Authentication required' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
