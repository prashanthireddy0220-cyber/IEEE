import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getJwtSecret, SESSION_COOKIE_NAME } from '../utils/authTokens.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader && authHeader.split(' ')[1];
  const token = req.cookies?.[SESSION_COOKIE_NAME] || bearerToken;

  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.id).select('email role isActive tokenVersion emailVerified');

    if (!user || !user.isActive || (user.tokenVersion || 0) !== (decoded.tokenVersion || 0)) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    req.user = {
      id: user._id.toString(),
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
