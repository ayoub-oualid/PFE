import express from 'express';
import {
  createCollaborator,
  getCollaborators,
  getCollaboratorById,
  updateCollaborator,
  deleteCollaborator,
  assignCollaborator,
  unassignCollaborator,
  getCollaboratorsByInspector,
  getUnassignedCollaborators,
} from '../controllers/collaboratorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('admin'), createCollaborator)
  .get(protect, getCollaborators);

  router.route('/assign')
  .post(protect, authorize('inspector', 'admin'), assignCollaborator);

router.route('/unassign')
  .post(protect, authorize('inspector', 'admin'), unassignCollaborator);

router.route('/inspector/:inspectorId')
  .get(protect, authorize('inspector', 'admin'), getCollaboratorsByInspector);

router.route('/unassigned')
  .get(protect, authorize('inspector', 'admin'), getUnassignedCollaborators);

router.route('/:id')
.get(protect, getCollaboratorById)
.put(protect, authorize('admin'), updateCollaborator)
.delete(protect, authorize('admin'), deleteCollaborator);

export default router;