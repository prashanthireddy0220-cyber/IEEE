import express from 'express';
import Achievement from '../models/Achievement.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Get all achievements
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ date: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get achievement by ID
router.get('/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create achievement (Chairman only)
router.post('/', authenticateToken, authorizeRole(['chairman']), async (req, res) => {
  try {
    const achievement = new Achievement(req.body);
    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update achievement (Chairman only)
router.put('/:id', authenticateToken, authorizeRole(['chairman']), async (req, res) => {
  try {
    const updated = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete achievement (Chairman only)
router.delete('/:id', authenticateToken, authorizeRole(['chairman']), async (req, res) => {
  try {
    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Achievement deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
