const windows = new Map();

const getClientKey = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  const ip = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0];
  return (ip || req.ip || req.socket?.remoteAddress || 'unknown').trim();
};

const SPECIAL_CHARACTER_PATTERN = /[^A-Za-z0-9]/;

export const isStrongPassword = (password) => {
  return typeof password === 'string'
    && password.length >= 8
    && password.length <= 128
    && SPECIAL_CHARACTER_PATTERN.test(password);
};

export const createRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests' } = {}) => {
  return (req, res, next) => {
    const key = `${getClientKey(req)}:${req.originalUrl}`;
    const now = Date.now();
    const record = windows.get(key);

    if (!record || record.resetAt <= now) {
      windows.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    record.count += 1;
    if (record.count > max) {
      return res.status(429).json({ message });
    }

    return next();
  };
};

export const validateAuthPayload = (req, res, next) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!email || !password || email.length > 254 || password.length > 128) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  req.body.email = email;
  next();
};

export const validateRegistrationPayload = (req, res, next) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!name || name.length > 80 || !email || email.length > 254 || !isStrongPassword(password)) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  req.body.name = name;
  req.body.email = email;
  next();
};
