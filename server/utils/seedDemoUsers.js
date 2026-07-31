import User from '../models/User.js';

const shouldSeedDemoUsers = () => (
  process.env.NODE_ENV !== 'production'
  && process.env.SEED_DEMO_USERS !== 'false'
);

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

  for (const demoUser of demoUsers()) {
    const existingUser = await User.findOne({ email: demoUser.email });

    if (existingUser) {
      let changed = false;

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
        changed = true;
      }

      if (changed) {
        await existingUser.save();
      }

      continue;
    }

    await User.create({
      ...demoUser,
      emailVerified: true,
      isActive: true
    });
  }

  console.log('Demo profile users are ready. Create matching Firebase Auth users to sign in.');
};
