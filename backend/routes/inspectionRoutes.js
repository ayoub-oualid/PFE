import express from 'express';
import {
  createInspection,
  getInspections,
  getInspectionById,
  updateInspection,
  deleteInspection,
    getInspectionsByInspector,
  getInspectionsByCollaborator,
  getInspectionsByStatus,
} from '../controllers/inspectionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('inspector', 'admin'), createInspection)
  .get(protect, getInspections);

router.route('/inspector')
  .get(protect, authorize('inspector', 'admin'), getInspectionsByInspector);

router.route('/collaborator')
  .get(protect, authorize('inspector', 'admin'), getInspectionsByCollaborator);

  router.route('/status')
  .get(protect, authorize('inspector', 'admin'), getInspectionsByStatus);
  
  
router.route('/:id')
  .get(protect, getInspectionById)
  .put(protect, authorize('inspector', 'admin'), updateInspection)
  .delete(protect, authorize('admin'), deleteInspection);

export default router;