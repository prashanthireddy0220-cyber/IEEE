import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const SESSION_COOKIE_NAME = 'ieee_session';
const SESSION_MAX_AGE_MS = 2 * 60 * 60 * 1000;

export const getJwtSecret = () => process.env.JWT_SECRET || 'your_jwt_secret';

export const createSessionToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion || 0
    },
    getJwtSecret(),
    { expiresIn: '2h' }
  );
};

export const setSessionCookie = (res, token) => {
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: SESSION_MAX_AGE_MS,
    path: '/'
  });
};

export const clearSessionCookie = (res) => {
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
  });
};

export const createRawToken = () => crypto.randomBytes(32).toString('hex');

export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
