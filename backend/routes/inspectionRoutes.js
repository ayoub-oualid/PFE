import express from 'express';
import {
  createInspection,
  getInspections,
  getInspectionById,
  updateInspection,
  deleteInspection,
} from '../controllers/inspectionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('inspector', 'admin'), createInspection)
  .get(protect, getInspections);

router.route('/:id')
  .get(protect, getInspectionById)
  .put(protect, authorize('inspector', 'admin'), updateInspection)
  .delete(protect, authorize('admin'), deleteInspection);

export default router;