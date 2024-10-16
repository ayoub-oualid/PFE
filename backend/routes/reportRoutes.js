import express from 'express';
import {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  getReportsByInspector,
  getReportsByCollaborator,
  getReportsByInspection,
} from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('inspector'), createReport)
  .get(protect, getReports);

router.get('/inspector', protect, authorize('admin','inspector'), getReportsByInspector);
router.get('/collaborator', protect, authorize('admin','inspector'), getReportsByCollaborator);
router.get('/inspection', protect, authorize('admin','inspector'), getReportsByInspection);



router.route('/:id')
  .get(protect, getReportById)
  .put(protect, authorize('inspector'), updateReport)
  .delete(protect, authorize('inspector'), deleteReport);

export default router;