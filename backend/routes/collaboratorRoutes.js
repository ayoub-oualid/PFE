import express from 'express';
import {
  createCollaborator,
  getCollaborators,
  getCollaboratorById,
  updateCollaborator,
  deleteCollaborator,
} from '../controllers/collaboratorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('admin'), createCollaborator)
  .get(protect, getCollaborators);

router.route('/:id')
  .get(protect, getCollaboratorById)
  .put(protect, authorize('admin'), updateCollaborator)
  .delete(protect, authorize('admin'), deleteCollaborator);

export default router;