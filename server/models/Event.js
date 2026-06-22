import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: String,
  venue: String,
  location: String,
  category: { type: String, enum: ['workshop', 'seminar', 'hackathon', 'competition', 'meetup'] },
  speakers: [{
    name: String,
    designation: String,
    bio: String,
    photo: String
  }],
  poster: String,
  images: [String],
  registrationLink: String,
  capacity: Number,
  registrations: { type: Number, default: 0 },
  status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' },
  createdBy: mongoose.Schema.Types.ObjectId,
  approvedBy: mongoose.Schema.Types.ObjectId,
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Event', eventSchema);
