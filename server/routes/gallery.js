import express from 'express';
import Gallery from '../models/Gallery.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

const getUploadedImages = (files) => {
  if (!files?.images) return [];
  return Array.isArray(files.images) ? files.images : [files.images];
};

const getCaptions = (body) => {
  if (!body.captions) return [];
  return Array.isArray(body.captions) ? body.captions : [body.captions];
};

// Get all galleries
router.get('/', async (req, res) => {
  try {
    const galleries = await Gallery.find().select('-images.data').sort({ createdAt: -1 });
    res.json(galleries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get gallery image from MongoDB
router.get('/:id/images/:imageId', async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: 'Gallery not found' });

    const image = gallery.images.id(req.params.imageId);
    if (!image?.data) return res.status(404).json({ message: 'Image not found' });

    res.set('Content-Type', image.contentType || 'application/octet-stream');
    res.send(image.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get gallery by ID
router.get('/:id', async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id).select('-images.data');
    if (!gallery) return res.status(404).json({ message: 'Gallery not found' });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create gallery
router.post('/', authenticateToken, authorizeRole(['chairman', 'core-team', 'student-chairperson']), async (req, res) => {
  try {
    const uploadedImages = getUploadedImages(req.files);
    const captions = getCaptions(req.body);
    const images = uploadedImages.map((image, index) => ({
      caption: captions[index] || '',
      data: image.data,
      contentType: image.mimetype,
      filename: image.name
    }));

    const gallery = new Gallery({
      albumName: req.body.albumName,
      eventId: req.body.eventId,
      category: req.body.category,
      description: req.body.description,
      images,
      createdBy: req.user.id
    });

    gallery.images.forEach((image) => {
      image.url = `/api/gallery/${gallery._id}/images/${image._id}`;
    });

    await gallery.save();
    const response = gallery.toObject();
    response.images = response.images.map(({ data, ...image }) => image);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update gallery
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (gallery.createdBy.toString() !== req.user.id && req.user.role !== 'chairman') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const updated = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
