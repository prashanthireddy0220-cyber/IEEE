import User from '../models/User.js';
import { verifyFirebaseIdToken } from '../utils/firebaseAdmin.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const decoded = await verifyFirebaseIdToken(token);
    const user = await User.findOne({ firebaseUid: decoded.uid }).select('email role isActive emailVerified');

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (decoded.email_verified !== user.emailVerified) {
      user.emailVerified = Boolean(decoded.email_verified);
      await user.save();
    }

    if (!decoded.email_verified) {
      return res.status(403).json({ message: 'Please verify your email before continuing.' });
    }

    req.user = {
      id: user._id.toString(),
      firebaseUid: decoded.uid,
      email: user.email,
      role: user.role
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication required' });
  }
};

export const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
