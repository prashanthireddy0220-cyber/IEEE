let lastEmailApiError;
const DEFAULT_CLIENT_ORIGINS = 'http://localhost:5173,http://127.0.0.1:5173,https://ieee-jpc3.vercel.app';
const BREVO_EMAIL_API_URL = 'https://api.brevo.com/v3/smtp/email';
const DEFAULT_EMAIL_FROM = 'KARE IEEE Education Society <kareieeeeducationsociety2026@gmail.com>';

const getEmailConfig = () => {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const configuredFrom = (process.env.EMAIL_FROM || DEFAULT_EMAIL_FROM).trim();

  return {
    apiKey,
    from: configuredFrom,
    emailFrom: configuredFrom,
    fromConfigured: Boolean(configuredFrom)
  };
};

const getSafeErrorDetails = (error) => ({
  message: error.message,
  code: error.code,
  command: error.command,
  responseCode: error.responseCode,
  response: error.response
});

const getSafeEmailConfigSummary = () => {
  const { apiKey, from, emailFrom } = getEmailConfig();

  return {
    BREVO_API_KEY_EXISTS: Boolean(apiKey),
    EMAIL_FROM: emailFrom || from,
    CLIENT_URL: getConfiguredClientUrl()
  };
};

const logEmailConfigIssue = (message, details = {}) => {
  console.error('Brevo email configuration error:', {
    message,
    ...details
  });
};

const logEmailSendIssue = (context, error) => {
  console.error(`${context} email failed:`, getSafeErrorDetails(error));
};

const validateEmailConfig = ({ apiKey, from, fromConfigured }) => {
  const issues = [];

  if (!apiKey) issues.push('BREVO_API_KEY is required');
  if (!from) issues.push('EMAIL_FROM is required');

  if (issues.length > 0) {
    logEmailConfigIssue('Invalid Brevo API configuration.', {
      issues,
      apiKeyConfigured: Boolean(apiKey),
      fromConfigured
    });
    return false;
  }

  return true;
};

const parseSender = (from) => {
  const match = from.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (!match) return { email: from };

  const name = match[1].replace(/^"|"$/g, '').trim();
  const email = match[2].trim();
  return name ? { name, email } : { email };
};

const createBrevoEmailClient = (apiKey) => ({
  sendEmail: ({ sender, to, subject, textContent, htmlContent }) => fetch(BREVO_EMAIL_API_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender,
      to,
      subject,
      textContent,
      htmlContent
    })
  })
});

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export const verifySmtpTransporter = async ({ reset = false } = {}) => {
  if (reset) {
    lastEmailApiError = undefined;
  }

  const emailConfig = getEmailConfig();
  const success = validateEmailConfig(emailConfig);
  return {
    success,
    smtpConnected: success,
    config: getSafeEmailConfigSummary(),
    error: success ? undefined : lastEmailApiError || { message: 'Brevo email API is unavailable' }
  };
};

export const logBrevoEmailStartupStatus = () => {
  console.info('Brevo email startup configuration:', getSafeEmailConfigSummary());
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
  const emailConfig = getEmailConfig();
  const { apiKey, from } = emailConfig;

  if (!validateEmailConfig(emailConfig)) {
    console.warn(`${subject} email skipped: Brevo email API is not configured.`, {
      to,
      from,
      error: lastEmailApiError
    });
    return false;
  }

  try {
    console.info(`Sending ${subject} email:`, {
      to,
      from
    });

    const brevoEmailClient = createBrevoEmailClient(apiKey);
    const response = await brevoEmailClient.sendEmail({
      sender: parseSender(from),
      to: [{ email: to }],
      subject,
      textContent: text,
      htmlContent: html
    });

    if (!response.ok) {
      const errorBody = await response.text();
      lastEmailApiError = {
        message: 'Brevo email API request failed',
        status: response.status,
        statusText: response.statusText,
        response: errorBody
      };
      console.error(`${subject} email failed:`, {
        to,
        status: response.status,
        statusText: response.statusText,
        response: errorBody
      });
      return false;
    }

    const result = await response.json().catch(() => ({}));
    lastEmailApiError = undefined;
    console.info(`${subject} email sent:`, {
      to,
      messageId: result.messageId
    });
    return true;
  } catch (error) {
    lastEmailApiError = getSafeErrorDetails(error);
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
