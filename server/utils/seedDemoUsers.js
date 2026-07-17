import User from '../models/User.js';

const shouldSeedDemoUsers = () => (
  process.env.NODE_ENV !== 'production'
  && process.env.SEED_DEMO_USERS !== 'false'
);

const demoPassword = () => process.env.DEMO_USER_PASSWORD || 'password123';

const demoUsers = () => [
  {
    name: 'IEEE Demo User',
    email: 'user@ieee.edu',
    role: 'chairman'
  },
  {
    name: 'Putluru Prashanthi',
    email: 'putluruprashanthi@gmail.com',
    role: 'student-chairperson'
  },
  {
    name: 'Putluru Prashanthi',
    email: 'prashanthireddy0220@gmail.com',
    role: 'student-chairperson'
  }
];

export const seedDemoUsers = async () => {
  if (!shouldSeedDemoUsers()) return;

  const password = demoPassword();

  for (const demoUser of demoUsers()) {
    const existingUser = await User.findOne({ email: demoUser.email }).select('+password');

    if (existingUser) {
      let changed = false;

      const passwordMatches = await existingUser.comparePassword(password);
      if (!passwordMatches) {
        existingUser.password = password;
        changed = true;
      }

      if (!existingUser.isActive) {
        existingUser.isActive = true;
        changed = true;
      }

      if (existingUser.lockUntil) {
        existingUser.lockUntil = undefined;
        existingUser.failedLoginAttempts = 0;
        changed = true;
      }

      if (existingUser.emailVerified === false) {
        existingUser.emailVerified = true;
        existingUser.emailVerificationToken = undefined;
        existingUser.emailVerificationExpires = undefined;
        changed = true;
      }

      if (changed) {
        await existingUser.save();
      }

      continue;
    }

    await User.create({
      ...demoUser,
      password,
      emailVerified: true,
      isActive: true
    });
  }

  console.log(`Demo login users are ready. Password: ${password}`);
};
