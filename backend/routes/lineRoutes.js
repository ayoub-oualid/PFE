import express from 'express';
import {
  createLine,
  getLines,
  getLineById,
  updateLine,
  deleteLine,
  assignCollaboratorToLine,
  getLinesByCollaborator,
} from '../controllers/lineController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('admin'), createLine)
  .get(protect, getLines);


router.route('/assign')
  .post(protect, authorize('inspector', 'admin'), assignCollaboratorToLine);

router.route('/collaborator/:collaboratorId')
  .get(protect, authorize('inspector', 'admin'), getLinesByCollaborator);

  router.route('/:id')
  .get(protect, getLineById)
  .put(protect, authorize('admin'), updateLine)
  .delete(protect, authorize('admin'), deleteLine);

export default router;