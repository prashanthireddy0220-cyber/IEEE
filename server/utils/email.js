const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const getFrontendUrl = () => (
  process.env.FRONTEND_URL ||
  process.env.CLIENT_ORIGIN ||
  'https://ieee-jpc3.vercel.app'
).trim().replace(/\/$/, '');

const supportEmail = process.env.SUPPORT_EMAIL || 'kareieeeeducationsociety2026@gmail.com';

const parseEmailFrom = () => {
  const emailFrom = process.env.EMAIL_FROM || '';
  const match = emailFrom.match(/^(.*?)\s*<([^>]+)>$/);

  if (!match) {
    return {
      name: process.env.EMAIL_SENDER_NAME || 'KARE IEEE Education Society',
      email: process.env.EMAIL_SENDER_ADDRESS || supportEmail
    };
  }

  return {
    name: process.env.EMAIL_SENDER_NAME || match[1].replace(/^"|"$/g, '').trim(),
    email: process.env.EMAIL_SENDER_ADDRESS || match[2].trim()
  };
};

const sender = parseEmailFrom();

const logoUrl = () => `${getFrontendUrl()}/assets/kare-logo-XYVYeZYh.jpeg`;

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const shell = ({ preview, content }) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${preview}</title>
  </head>
  <body style="margin:0;background:#f4f8ff;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preview}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f8ff;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #dbeafe;">
            <tr>
              <td style="background:#075985;padding:28px;text-align:center;">
                <img src="${logoUrl()}" alt="KARE IEEE Education Society" width="88" height="88" style="display:block;margin:0 auto 14px;border-radius:16px;object-fit:cover;background:#ffffff;">
                <div style="color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">KARE IEEE Education Society</div>
                <div style="color:#bae6fd;font-size:13px;margin-top:6px;">Student Branch Chapter</div>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 28px;">
                ${content}
              </td>
            </tr>
            <tr>
              <td style="background:#eff6ff;padding:22px 28px;text-align:center;color:#475569;font-size:12px;line-height:1.7;">
                <div style="font-weight:700;color:#075985;">KARE IEEE Education Society</div>
                <div><a href="${getFrontendUrl()}" style="color:#0369a1;text-decoration:none;">${getFrontendUrl()}</a></div>
                <div>Support: <a href="mailto:${supportEmail}" style="color:#0369a1;text-decoration:none;">${supportEmail}</a></div>
                <div style="margin-top:10px;">Copyright ${new Date().getFullYear()} KARE IEEE Education Society. All rights reserved.</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

export const welcomeEmailTemplate = ({ name }) => shell({
  preview: 'Welcome to KARE IEEE Education Society',
  content: `
    <h1 style="margin:0 0 16px;color:#075985;font-size:28px;line-height:1.2;">Welcome, ${escapeHtml(name)}!</h1>
    <p style="margin:0 0 16px;color:#334155;font-size:16px;line-height:1.7;">
      We are delighted to welcome you to the KARE IEEE Education Society community.
    </p>
    <p style="margin:0 0 22px;color:#334155;font-size:16px;line-height:1.7;">
      Thank you for joining us. Once your email is verified, your member account will unlock chapter updates and digital resources.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eff6ff;border-radius:14px;padding:18px;border:1px solid #bfdbfe;">
      <tr><td style="color:#075985;font-weight:700;padding-bottom:10px;">What you can explore</td></tr>
      <tr><td style="color:#334155;font-size:15px;line-height:1.9;">Events<br>Gallery<br>Team<br>Resources<br>Member Dashboard</td></tr>
    </table>`
});

export const verificationEmailTemplate = ({ name, verificationLink }) => shell({
  preview: 'Verify Your KARE IEEE Education Society Account',
  content: `
    <h1 style="margin:0 0 16px;color:#075985;font-size:28px;line-height:1.2;">Verify your email</h1>
    <p style="margin:0 0 16px;color:#334155;font-size:16px;line-height:1.7;">Hello ${escapeHtml(name)},</p>
    <p style="margin:0 0 26px;color:#334155;font-size:16px;line-height:1.7;">
      Please confirm your email address to activate your IEEE Education Society account.
    </p>
    <div style="text-align:center;margin:30px 0;">
      <a href="${verificationLink}" style="display:inline-block;background:#0369a1;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:10px;font-size:16px;">
        Verify Email
      </a>
    </div>
    <p style="margin:24px 0 0;color:#64748b;font-size:13px;line-height:1.7;">
      Security note: this link is intended only for you. If you did not create this account, you can ignore this email.
    </p>
    <p style="margin:14px 0 0;color:#64748b;font-size:13px;line-height:1.7;">
      If the button does not work, copy and paste this link into your browser:<br>
      <a href="${verificationLink}" style="color:#0369a1;word-break:break-all;">${verificationLink}</a>
    </p>`
});

export const passwordResetEmailTemplate = ({ name, resetLink }) => shell({
  preview: 'Reset Your Password - KARE IEEE Education Society',
  content: `
    <h1 style="margin:0 0 16px;color:#075985;font-size:28px;line-height:1.2;">Reset your password</h1>
    <p style="margin:0 0 16px;color:#334155;font-size:16px;line-height:1.7;">Hello ${escapeHtml(name)},</p>
    <p style="margin:0 0 26px;color:#334155;font-size:16px;line-height:1.7;">
      We received a request to reset the password for your KARE IEEE Education Society account.
    </p>
    <div style="text-align:center;margin:30px 0;">
      <a href="${resetLink}" style="display:inline-block;background:#0369a1;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:10px;font-size:16px;">
        Reset Password
      </a>
    </div>
    <p style="margin:24px 0 0;color:#64748b;font-size:13px;line-height:1.7;">
      Security note: if you did not request this reset, you can safely ignore this email. Your password will remain unchanged.
    </p>
    <p style="margin:14px 0 0;color:#64748b;font-size:13px;line-height:1.7;">
      If the button does not work, copy and paste this link into your browser:<br>
      <a href="${resetLink}" style="color:#0369a1;word-break:break-all;">${resetLink}</a>
    </p>`
});

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY is not configured');
  }

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender,
      to,
      subject,
      htmlContent: html
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Email delivery failed: ${detail}`);
  }
};

export const sendRegistrationEmails = async ({ email, name, verificationLink }) => {
  const recipient = [{ email, name }];

  await sendEmail({
    to: recipient,
    subject: 'Welcome to KARE IEEE Education Society',
    html: welcomeEmailTemplate({ name })
  });

  await sendEmail({
    to: recipient,
    subject: 'Verify Your KARE IEEE Education Society Account',
    html: verificationEmailTemplate({ name, verificationLink })
  });
};

export const sendPasswordResetEmail = async ({ email, name, resetLink }) => {
  await sendEmail({
    to: [{ email, name }],
    subject: 'Reset Your Password - KARE IEEE Education Society',
    html: passwordResetEmailTemplate({ name, resetLink })
  });
};
