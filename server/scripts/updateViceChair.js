import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ieee-sbc';

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // EDIT THESE VALUES if you want different details
    const photoUrl = 'https://kommodo.ai/i/jLdkkM9T4P9gvlocvy6t';
    const phone = '99240040715';

    // Try to find existing vice-chair (student-chairperson)
    let user = await User.findOne({ role: 'student-chairperson' });

    if (user) {
      console.log('Found existing student-chairperson:', user.name || user.email);
      user.photo = photoUrl;
      user.phone = phone;
      user.socialMedia = user.socialMedia || {};
      await user.save();
      console.log('Updated user:', { id: user._id.toString(), name: user.name, photo: user.photo, phone: user.phone });
    } else {
      // Create a placeholder user (required fields: name, email, password)
      const placeholder = {
        name: 'Vice Chairperson',
        email: 'vicechair@example.local',
        password: 'ChangeMe123!',
        role: 'student-chairperson',
        photo: photoUrl,
        phone,
        socialMedia: {}
      };

      const newUser = await User.create(placeholder);
      console.log('Created placeholder user:', { id: newUser._id.toString(), email: newUser.email, password: placeholder.password });
      console.log('Please change this user\'s password and email as needed via the dashboard or database.');
    }

    await mongoose.disconnect();
    console.log('Disconnected and finished. Refresh your /team page to see the update.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
