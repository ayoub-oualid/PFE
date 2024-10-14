import express from 'express';
import {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  getReportsByInspector,
} from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('inspector'), createReport)
  .get(protect, getReports);

router.get('/inspector', protect, authorize('inspector'), getReportsByInspector);

router.route('/:id')
  .get(protect, getReportById)
  .put(protect, authorize('inspector'), updateReport)
  .delete(protect, authorize('admin'), deleteReport);

export default router;