let transporterPromise;

const getTransporter = async () => {
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      return null;
    }

    const { default: nodemailer } = await import('nodemailer');

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass
      }
    });
  })().catch((error) => {
    console.error('Email transporter setup failed:', error.message);
    return null;
  });

  return transporterPromise;
};

const buildStudentLoginEmail = ({ name }) => {
  const subject = 'Welcome to IEEE Education Society';
  const safeName = name || 'Student Member';

  return {
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="color: #0f4c81; margin-bottom: 12px;">Welcome to IEEE Education Society</h2>
        <p>Hi ${safeName},</p>
        <p>Welcome to the IEEE Education Society club. We are happy to have you as part of our student community.</p>
        <p>You can now explore chapter updates, discover upcoming events, and take part in activities that support your technical growth and leadership journey.</p>
        <p>We are excited to build, learn, and grow together with you.</p>
        <p style="margin-top: 20px;">Regards,<br />IEEE Education Society Team</p>
      </div>
    `,
    text: [
      `Hi ${safeName},`,
      '',
      'Welcome to the IEEE Education Society club.',
      'We are happy to have you as part of our student community.',
      'You can now explore chapter updates, discover upcoming events, and take part in activities that support your technical growth and leadership journey.',
      '',
      'Regards,',
      'IEEE Education Society Team'
    ].join('\n')
  };
};

export const sendStudentLoginEmail = async ({ name, email }) => {
  const transporter = await getTransporter();

  if (!transporter) {
    console.warn('Student login email skipped: SMTP configuration is missing.');
    return false;
  }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  const message = buildStudentLoginEmail({ name });

  await transporter.sendMail({
    from,
    to: email,
    subject: message.subject,
    text: message.text,
    html: message.html
  });

  return true;
};

const getClientUrl = () => process.env.CLIENT_URL || process.env.CLIENT_ORIGIN?.split(',')[0] || 'http://localhost:5173';

const sendMail = async ({ to, subject, text, html }) => {
  const transporter = await getTransporter();

  if (!transporter) {
    console.warn(`${subject} email skipped: SMTP configuration is missing.`);
    return false;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html
  });

  return true;
};

export const sendVerificationEmail = async ({ name, email, token }) => {
  const verifyUrl = `${getClientUrl()}/verify-email?token=${encodeURIComponent(token)}`;
  const safeName = name || 'IEEE Member';

  return sendMail({
    to: email,
    subject: 'Verify your IEEE Education Society account',
    text: `Hi ${safeName},\n\nVerify your account using this link:\n${verifyUrl}\n\nThis link expires soon.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="color: #0f4c81;">Verify your account</h2>
        <p>Hi ${safeName},</p>
        <p>Use the link below to verify your IEEE Education Society account. This link expires soon.</p>
        <p><a href="${verifyUrl}">Verify account</a></p>
      </div>
    `
  });
};

export const sendPasswordResetEmail = async ({ name, email, token }) => {
  const resetUrl = `${getClientUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  const safeName = name || 'IEEE Member';

  return sendMail({
    to: email,
    subject: 'Reset your IEEE Education Society password',
    text: `Hi ${safeName},\n\nReset your password using this link:\n${resetUrl}\n\nThis link expires soon and can only be used once.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="color: #0f4c81;">Reset your password</h2>
        <p>Hi ${safeName},</p>
        <p>Use the link below to reset your password. This link expires soon and can only be used once.</p>
        <p><a href="${resetUrl}">Reset password</a></p>
      </div>
    `
  });
};
