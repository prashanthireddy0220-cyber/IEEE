import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
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
  emailVerified: { type: Boolean, default: true },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
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
userSchema.index({ passwordResetToken: 1 }, { sparse: true });
userSchema.index({ emailVerificationToken: 1 }, { sparse: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.isLocked = function() {
  return Boolean(this.lockUntil && this.lockUntil > Date.now());
};

export default mongoose.model('User', userSchema);
