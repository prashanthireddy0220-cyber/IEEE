import express from 'express';
import User from '../models/User.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Get all team members
router.get('/', async (req, res) => {
  try {
    const obsoleteStandaloneNames = ['prashanthi', 'prashanhnti', 'prashanhti'];
    const team = await User.find({
      role: { $in: ['chairman', 'faculty', 'core-team', 'student-chairperson', 'president'] }
    }).select('-password');
    const visibleTeam = team.filter(
      (member) => !obsoleteStandaloneNames.includes(member.name?.trim().toLowerCase())
    );
    res.json(visibleTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update team member (Chairman only)
router.put('/:id', authenticateToken, authorizeRole(['chairman']), async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
