let transporterPromise;
let transporterVerified = false;

const parseBooleanEnv = (value, fallback = false) => {
  if (value === undefined || value === '') return fallback;
  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
};

const getEmailConfig = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = parseBooleanEnv(process.env.SMTP_SECURE, port === 465);
  const requireTLS = parseBooleanEnv(process.env.SMTP_REQUIRE_TLS, port === 587);

  return { host, port, user, pass, secure, requireTLS };
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

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const getTransporter = async () => {
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    const { host, port, user, pass, secure, requireTLS } = getEmailConfig();

    if (!host || !user || !pass || !Number.isInteger(port)) {
      logEmailConfigIssue('SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS must be configured.', {
        hasHost: Boolean(host),
        hasUser: Boolean(user),
        hasPassword: Boolean(pass),
        port
      });
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

    await transporter.verify();
    transporterVerified = true;
    console.info('SMTP transporter verified:', {
      host,
      port,
      secure,
      requireTLS,
      userConfigured: Boolean(user),
      fromConfigured: Boolean(process.env.EMAIL_FROM)
    });

    return transporter;
  })().catch((error) => {
    logEmailConfigIssue('Transporter setup or verification failed.', getSafeErrorDetails(error));
    transporterPromise = undefined;
    transporterVerified = false;
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

const getClientUrl = () => process.env.CLIENT_URL || process.env.CLIENT_ORIGIN?.split(',')[0] || 'http://localhost:5173';

const sendMail = async ({ to, subject, text, html }) => {
  const transporter = await getTransporter();

  if (!transporter) {
    console.warn(`${subject} email skipped: SMTP configuration is missing.`);
    return false;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html
    });

    console.info(`${subject} email sent:`, {
      to,
      transporterVerified
    });
    return true;
  } catch (error) {
    logEmailSendIssue(subject, error);
    return false;
  }
};

export const sendVerificationEmail = async ({ name, email, token }) => {
  const verifyUrl = `${getClientUrl()}/verify-email?token=${encodeURIComponent(token)}`;
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

export const sendPasswordResetEmail = async ({ name, email, token }) => {
  const resetUrl = `${getClientUrl()}/reset-password?token=${encodeURIComponent(token)}`;
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
