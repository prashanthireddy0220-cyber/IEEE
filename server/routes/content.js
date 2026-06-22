import express from 'express';
import Content from '../models/Content.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Get content by key
router.get('/:key', async (req, res) => {
  try {
    const content = await Content.findOne({ key: req.params.key });
    if (!content) return res.status(404).json({ message: 'Content not found' });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update content (Chairman only)
router.put('/:key', authenticateToken, authorizeRole(['chairman']), async (req, res) => {
  try {
    const updated = await Content.findOneAndUpdate(
      { key: req.params.key },
      { ...req.body, lastUpdatedBy: req.user.id },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
