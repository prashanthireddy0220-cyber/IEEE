import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  albumName: { type: String, required: true },
  eventId: mongoose.Schema.Types.ObjectId,
  images: [{
    url: String,
    caption: String,
    data: Buffer,
    contentType: String,
    filename: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  category: { type: String, enum: ['workshop', 'seminar', 'hackathon', 'competition', 'meetup', 'general'] },
  description: String,
  createdBy: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Gallery', gallerySchema);
