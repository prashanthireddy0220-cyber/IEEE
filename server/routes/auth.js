import express from 'express';
import User from '../models/User.js';
import {
  sendPasswordResetEmail,
  sendStudentLoginEmail,
  sendVerificationEmail
} from '../utils/email.js';
import {
  clearSessionCookie,
  createRawToken,
  createSessionToken,
  hashToken,
  setSessionCookie
} from '../utils/authTokens.js';
import {
  createRateLimiter,
  isStrongPassword,
  validateAuthPayload,
  validateRegistrationPayload
} from '../middleware/security.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const GENERIC_LOGIN_ERROR = 'Invalid credentials';
const GENERIC_SIGNUP_MESSAGE = 'Request received. If this account already exists, use Login to continue.';
const GENERIC_RESET_MESSAGE = 'If the email is registered, password reset instructions will be sent.';
const LOCK_ATTEMPTS = Number(process.env.LOGIN_LOCK_ATTEMPTS || 5);
const LOCK_MINUTES = Number(process.env.LOGIN_LOCK_MINUTES || 15);
const VERIFY_TOKEN_MINUTES = Number(process.env.VERIFY_TOKEN_MINUTES || 60);
const RESET_TOKEN_MINUTES = Number(process.env.RESET_TOKEN_MINUTES || 15);
const REQUIRE_EMAIL_VERIFICATION = process.env.REQUIRE_EMAIL_VERIFICATION === 'true';

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.LOGIN_RATE_LIMIT_MAX || 20),
  message: 'Too many attempts. Please try again later.'
});

const signupLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: Number(process.env.SIGNUP_RATE_LIMIT_MAX || 10),
  message: 'Too many requests. Please try again later.'
});

const resetLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: Number(process.env.RESET_RATE_LIMIT_MAX || 8),
  message: 'Too many requests. Please try again later.'
});

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

const getClientIp = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  const ip = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0];
  return (ip || req.ip || req.socket?.remoteAddress || '').trim();
};

const verifyCaptchaIfRequired = async (req, user) => {
  const captchaSecret = process.env.CAPTCHA_SECRET;
  const shouldRequireCaptcha = Boolean(captchaSecret && user && user.failedLoginAttempts >= 3);

  if (!shouldRequireCaptcha) return true;

  const captchaToken = req.body?.captchaToken;
  if (!captchaToken) return false;

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: captchaSecret,
        response: captchaToken,
        remoteip: getClientIp(req)
      })
    });
    const result = await response.json();
    return Boolean(result.success);
  } catch (error) {
    console.error('CAPTCHA verification failed:', error.message);
    return false;
  }
};

const recordFailedLogin = async (user, req) => {
  if (!user) {
    console.warn('Failed login for unknown account', { ip: getClientIp(req), email: req.body?.email });
    return;
  }

  user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
  if (user.failedLoginAttempts >= LOCK_ATTEMPTS) {
    user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
    console.warn('Account temporarily locked after failed logins', {
      userId: user._id.toString(),
      ip: getClientIp(req)
    });
  }
  await user.save();
};

const finishLogin = async (user, req, res) => {
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLoginAt = new Date();
  user.lastLoginIp = getClientIp(req);
  user.lastLoginUserAgent = req.headers['user-agent'] || '';
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  await user.save();

  const token = createSessionToken(user);
  setSessionCookie(res, token);
  return res.json({ user: publicUser(user) });
};

// Register
router.post('/register', signupLimiter, validateRegistrationPayload, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(202).json({ message: GENERIC_SIGNUP_MESSAGE });
    }

    const verificationToken = REQUIRE_EMAIL_VERIFICATION ? createRawToken() : '';
    const user = new User({
      name,
      email,
      password,
      role: 'student',
      emailVerified: !REQUIRE_EMAIL_VERIFICATION,
      emailVerificationToken: REQUIRE_EMAIL_VERIFICATION ? hashToken(verificationToken) : undefined,
      emailVerificationExpires: REQUIRE_EMAIL_VERIFICATION ? new Date(Date.now() + VERIFY_TOKEN_MINUTES * 60 * 1000) : undefined
    });
    await user.save();

    if (!REQUIRE_EMAIL_VERIFICATION) {
      return finishLogin(user, req, res);
    }

    const emailSent = await sendVerificationEmail({ name: user.name, email: user.email, token: verificationToken });
    if (!emailSent) {
      console.warn('Email verification is required, but SMTP is not configured.');
    }

    res.status(202).json({ message: GENERIC_SIGNUP_MESSAGE });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(202).json({ message: GENERIC_SIGNUP_MESSAGE });
    }
    console.error('Registration failed:', error.message);
    res.status(500).json({ message: 'Unable to process request' });
  }
});

// Login
router.post('/login', loginLimiter, validateAuthPayload, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.isActive || user.isLocked()) {
      await recordFailedLogin(user, req);
      return res.status(401).json({ message: GENERIC_LOGIN_ERROR });
    }

    const captchaOk = await verifyCaptchaIfRequired(req, user);
    if (!captchaOk) {
      await recordFailedLogin(user, req);
      return res.status(401).json({ message: GENERIC_LOGIN_ERROR });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await recordFailedLogin(user, req);
      return res.status(401).json({ message: GENERIC_LOGIN_ERROR });
    }

    if (user.emailVerified === false && !REQUIRE_EMAIL_VERIFICATION) {
      user.emailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();
    }

    if (user.emailVerified === false) {
      return res.status(401).json({ message: GENERIC_LOGIN_ERROR });
    }

    await finishLogin(user, req, res);

    if (user.role === 'student') {
      sendStudentLoginEmail({ name: user.name, email: user.email }).catch((error) => {
        console.error('Student login email failed:', error.message);
      });
    }
  } catch (error) {
    console.error('Login failed:', error.message);
    res.status(500).json({ message: 'Unable to process request' });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Authentication required' });

    res.json({ user: publicUser(user) });
  } catch (error) {
    console.error('Session lookup failed:', error.message);
    res.status(401).json({ message: 'Authentication required' });
  }
});

router.post('/verify-email', async (req, res) => {
  try {
    const token = typeof req.body?.token === 'string' ? req.body.token : '';
    if (!token) return res.status(400).json({ message: 'Invalid request' });

    const user = await User.findOne({
      emailVerificationToken: hashToken(token),
      emailVerificationExpires: { $gt: new Date() }
    });

    if (user) {
      user.emailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();
    }

    res.json({ message: 'If the verification link is valid, the account has been verified.' });
  } catch (error) {
    console.error('Email verification failed:', error.message);
    res.status(500).json({ message: 'Unable to process request' });
  }
});

router.post('/forgot-password', resetLimiter, async (req, res) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!email) return res.json({ message: GENERIC_RESET_MESSAGE });

    const user = await User.findOne({ email });
    if (user && user.isActive) {
      const resetToken = createRawToken();
      user.passwordResetToken = hashToken(resetToken);
      user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_MINUTES * 60 * 1000);
      await user.save();

      sendPasswordResetEmail({ name: user.name, email: user.email, token: resetToken }).catch((error) => {
        console.error('Password reset email failed:', error.message);
      });
    }

    res.json({ message: GENERIC_RESET_MESSAGE });
  } catch (error) {
    console.error('Forgot password failed:', error.message);
    res.status(500).json({ message: 'Unable to process request' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const token = typeof req.body?.token === 'string' ? req.body.token : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!token || !isStrongPassword(password)) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const user = await User.findOne({
      passwordResetToken: hashToken(token),
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    clearSessionCookie(res);
    res.json({ message: 'Password has been reset.' });
  } catch (error) {
    console.error('Password reset failed:', error.message);
    res.status(500).json({ message: 'Unable to process request' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  clearSessionCookie(res);
  res.json({ message: 'Logged out successfully' });
});

export default router;
