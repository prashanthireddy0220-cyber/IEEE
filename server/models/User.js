import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  firebaseUid: { type: String, unique: true, sparse: true },
  role: { 
    type: String, 
    enum: ['chairman', 'faculty', 'core-team', 'student-chairperson', 'student'],
    default: 'student'
  },
  department: String,
  year: String,
  phone: String,
  bio: String,
  photo: String,
  socialMedia: {
    linkedin: String,
    instagram: String,
    twitter: String,
    github: String
  },
  emailVerified: { type: Boolean, default: false },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  lastLoginAt: Date,
  lastLoginIp: String,
  lastLoginUserAgent: String,
  tokenVersion: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ firebaseUid: 1 }, { unique: true, sparse: true });

userSchema.methods.isLocked = function() {
  return Boolean(this.lockUntil && this.lockUntil > Date.now());
};

export default mongoose.model('User', userSchema);
