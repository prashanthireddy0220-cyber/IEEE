let transporterPromise;
let verifiedTransporter;
const DEFAULT_CLIENT_ORIGINS = 'http://localhost:5173,http://127.0.0.1:5173,https://ieee-jpc3.vercel.app';

const parseBooleanEnv = (value, fallback = false) => {
  if (value === undefined || value === '') return fallback;
  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
};

const getEmailConfig = () => {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const configuredFrom = (process.env.SMTP_FROM || process.env.EMAIL_FROM || '').trim();
  const from = configuredFrom || user || '';
  const secure = parseBooleanEnv(process.env.SMTP_SECURE, port === 465);
  const requireTLS = parseBooleanEnv(process.env.SMTP_REQUIRE_TLS, port === 587 && !secure);

  return { host, port, user, pass, from, fromConfigured: Boolean(configuredFrom), secure, requireTLS };
};

const getSafeErrorDetails = (error) => ({
  message: error.message,
  code: error.code,
  command: error.command,
  responseCode: error.responseCode
});

const logEmailConfigIssue = (message, details = {}) => {
  console.error('SMTP email configuration error:', {
    message,
    ...details
  });
};

const logEmailSendIssue = (context, error) => {
  console.error(`${context} email failed:`, getSafeErrorDetails(error));
};

const validateEmailConfig = ({ host, port, user, pass, from, fromConfigured, secure, requireTLS }) => {
  const issues = [];
  const warnings = [];

  if (!host) issues.push('SMTP_HOST is required');
  if (!Number.isInteger(port) || port <= 0 || port > 65535) issues.push('SMTP_PORT must be a valid TCP port');
  if (!user) issues.push('SMTP_USER is required');
  if (!pass) issues.push('SMTP_PASS is required');
  if (!from) issues.push('SMTP_FROM or SMTP_USER is required');
  if (!fromConfigured) warnings.push('SMTP_FROM is missing; falling back to SMTP_USER');
  if (port === 465 && !secure) issues.push('SMTP_SECURE must be true when SMTP_PORT is 465');
  if (port === 587 && secure) issues.push('SMTP_SECURE should be false when SMTP_PORT is 587 because STARTTLS is used after connection');

  if (issues.length > 0) {
    logEmailConfigIssue('Invalid SMTP configuration.', {
      issues,
      hostConfigured: Boolean(host),
      port,
      userConfigured: Boolean(user),
      passwordConfigured: Boolean(pass),
      fromConfigured,
      secure,
      requireTLS
    });
    return false;
  }

  if (warnings.length > 0) {
    console.warn('SMTP email configuration warning:', {
      warnings,
      hostConfigured: Boolean(host),
      port,
      userConfigured: Boolean(user),
      fromConfigured,
      secure,
      requireTLS
    });
  }

  return true;
};

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const getTransporter = async () => {
  if (verifiedTransporter) return verifiedTransporter;
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    const emailConfig = getEmailConfig();
    const { host, port, user, pass, secure, requireTLS } = emailConfig;

    if (!validateEmailConfig(emailConfig)) {
      transporterPromise = undefined;
      return null;
    }

    const { default: nodemailer } = await import('nodemailer');

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      requireTLS,
      auth: {
        user,
        pass
      },
      connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 10000),
      greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT_MS || 10000),
      socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT_MS || 20000)
    });

    console.info('Verifying SMTP transporter:', {
      host,
      port,
      secure,
      requireTLS,
      userConfigured: Boolean(user),
      fromConfigured: emailConfig.fromConfigured
    });

    await transporter.verify();
    verifiedTransporter = transporter;
    console.info('SMTP transporter verified:', {
      host,
      port,
      secure,
      requireTLS,
      userConfigured: Boolean(user),
      fromConfigured: emailConfig.fromConfigured
    });

    return verifiedTransporter;
  })().catch((error) => {
    logEmailConfigIssue('Transporter setup or verification failed.', getSafeErrorDetails(error));
    transporterPromise = undefined;
    verifiedTransporter = undefined;
    return null;
  });

  return transporterPromise;
};

const buildAccountWelcomeEmail = ({ name }) => {
  const subject = 'Welcome to KARE IEEE Education Society';
  const displayName = name || 'Student Member';
  const safeName = escapeHtml(displayName);

  return {
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="color: #0f4c81; margin-bottom: 12px;">Welcome to KARE IEEE Education Society</h2>
        <p>Hi ${safeName},</p>
        <p>Your account has been created successfully.</p>
        <p>Welcome to the KARE IEEE Education Society. We are happy to have you as part of our student community.</p>
        <p>You can now explore chapter updates, discover upcoming events, and take part in activities that support your technical growth, research mindset, and leadership journey.</p>
        <p>We are excited to build, learn, and grow together with you.</p>
        <p style="margin-top: 20px;">Regards,<br />KARE IEEE Education Society Team</p>
      </div>
    `,
    text: [
      `Hi ${displayName},`,
      '',
      'Your account has been created successfully.',
      'Welcome to the KARE IEEE Education Society.',
      'We are happy to have you as part of our student community.',
      'You can now explore chapter updates, discover upcoming events, and take part in activities that support your technical growth, research mindset, and leadership journey.',
      '',
      'Regards,',
      'KARE IEEE Education Society Team'
    ].join('\n')
  };
};

export const sendAccountWelcomeEmail = async ({ name, email }) => {
  const message = buildAccountWelcomeEmail({ name });

  return sendMail({
    to: email,
    subject: message.subject,
    text: message.text,
    html: message.html
  });
};

const getConfiguredClientUrl = () => process.env.CLIENT_URL || (process.env.CLIENT_ORIGIN || DEFAULT_CLIENT_ORIGINS).split(',')[0];

const getAllowedClientOrigins = () => (process.env.CLIENT_ORIGIN || DEFAULT_CLIENT_ORIGINS)
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const getClientUrl = (requestOrigin) => {
  const configuredClientUrl = getConfiguredClientUrl().replace(/\/$/, '');
  const normalizedRequestOrigin = typeof requestOrigin === 'string'
    ? requestOrigin.trim().replace(/\/$/, '')
    : '';

  if (!normalizedRequestOrigin) return configuredClientUrl;

  const allowedOrigins = getAllowedClientOrigins();
  if (allowedOrigins.includes(normalizedRequestOrigin)) {
    return normalizedRequestOrigin;
  }

  return configuredClientUrl;
};

const sendMail = async ({ to, subject, text, html }) => {
  const transporter = await getTransporter();
  const { from } = getEmailConfig();

  if (!transporter) {
    console.warn(`${subject} email skipped: SMTP transporter is unavailable.`);
    return false;
  }

  try {
    console.info(`Sending ${subject} email:`, {
      to,
      from
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html
    });

    console.info(`${subject} email sent:`, {
      to,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected
    });
    return true;
  } catch (error) {
    logEmailSendIssue(subject, error);
    return false;
  }
};

export const sendVerificationEmail = async ({ name, email, token, clientOrigin }) => {
  const verifyUrl = `${getClientUrl(clientOrigin)}/verify-email?token=${encodeURIComponent(token)}`;
  const displayName = name || 'IEEE Member';
  const safeName = escapeHtml(displayName);
  const safeVerifyUrl = escapeHtml(verifyUrl);

  return sendMail({
    to: email,
    subject: 'Verify your IEEE Education Society account',
    text: `Hi ${displayName},\n\nVerify your account using this link:\n${verifyUrl}\n\nThis link expires soon.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="color: #0f4c81;">Verify your account</h2>
        <p>Hi ${safeName},</p>
        <p>Use the link below to verify your IEEE Education Society account. This link expires soon.</p>
        <p><a href="${safeVerifyUrl}">Verify account</a></p>
      </div>
    `
  });
};

export const sendPasswordResetEmail = async ({ name, email, token, clientOrigin }) => {
  const resetUrl = `${getClientUrl(clientOrigin)}/reset-password?token=${encodeURIComponent(token)}`;
  const displayName = name || 'IEEE Member';
  const safeName = escapeHtml(displayName);
  const safeResetUrl = escapeHtml(resetUrl);

  return sendMail({
    to: email,
    subject: 'Reset your IEEE Education Society password',
    text: `Hi ${displayName},\n\nReset your password using this link:\n${resetUrl}\n\nThis link expires soon and can only be used once.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="color: #0f4c81;">Reset your password</h2>
        <p>Hi ${safeName},</p>
        <p>Use the link below to reset your password. This link expires soon and can only be used once.</p>
        <p><a href="${safeResetUrl}">Reset password</a></p>
      </div>
    `
  });
};
