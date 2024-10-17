import asyncHandler from 'express-async-handler';
import Report from '../models/reportModel.js';
import Inspection from '../models/inspectionModel.js';

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private/Inspector
const createReport = asyncHandler(async (req, res) => {
  const { inspection, field1, field2, field3, field4, field5, field6, field7, field8, field9, field10, field11, field12, field13, field14, field15 } = req.body;

  const inspectionExists = await Inspection.findById(inspection);

  if (!inspectionExists) {
    res.status(404);
    throw new Error('Inspection not found');
  }

  const report = await Report.create({
    inspection,
    field1,
    field2,
    field3,
    field4,
    field5,
    field6,
    field7,
    field8,
    field9,
    field10,
    field11,
    field12,
    field13,
    field14,
    field15
  });

  if (report) {
    inspectionExists.status = 'done';
    inspectionExists.rating = (field1 + field2 + field3 + field4 + field5 + field6 + field7 + field8 + field9 + field10 + field11 + field12 + field13 + field14 + field15) / 15;
    await inspectionExists.save();
    res.status(201).json(report);
  } else {
    res.status(400);
    throw new Error('Invalid report data');
  }
});

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({}).populate({
    path: 'inspection',
    populate: [
      { path: 'inspector', select: 'name email' },
      { path: 'collaborator', select: 'fullName employeeId' },
      { path: 'line', select: 'trainNumber' }
    ]
  });
  res.json(reports);
});

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
const getReportById = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id).populate({
    path: 'inspection',
    populate: [
      { path: 'inspector', select: 'name email' },
      { path: 'collaborator', select: 'fullName employeeId' },
      { path: 'line', select: 'trainNumber' }
    ]
  });

  if (report) {
    res.json(report);
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
});

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private/Inspector
const updateReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (report) {
    report.field1 = req.body.field1 || report.field1;
    report.field2 = req.body.field2 || report.field2;
    report.field3 = req.body.field3 || report.field3;
    report.field4 = req.body.field4 || report.field4;
    report.field5 = req.body.field5 || report.field5;
    report.field6 = req.body.field6 || report.field6;
    report.field7 = req.body.field7 || report.field7;
    report.field8 = req.body.field8 || report.field8;
    report.field9 = req.body.field9 || report.field9;
    report.field10 = req.body.field10 || report.field10;
    report.field11 = req.body.field11 || report.field11;
    report.field12 = req.body.field12 || report.field12;
    report.field13 = req.body.field13 || report.field13;
    report.field14 = req.body.field14 || report.field14;
    report.field15 = req.body.field15 || report.field15;

    const updatedReport = await report.save();
    res.json(updatedReport);
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
const deleteReport = asyncHandler(async (req, res) => {
    const report = await Report.findById(req.params.id);
  
    if (report) {
      const inspection = await Inspection.findById(report.inspection);
      if (inspection) {
        inspection.status = 'waiting_for_report'; // Reset inspection status
        await inspection.save();
      }
  
      await Report.deleteOne({ _id: report._id });
      res.json({ message: 'Report removed' });
    } else {
      res.status(404);
      throw new Error('Report not found');
    }
  });

// @desc    Get reports by inspector
// @route   GET /api/reports/inspector
// @access  Private/Inspector
const getReportsByInspector = asyncHandler(async (req, res) => {
  const reports = await Report.find({}).populate({
    path: 'inspection',
    match: { inspector: req.user._id },
    populate: [
      { path: 'collaborator', select: 'fullName employeeId' },
      { path: 'line', select: 'trainNumber' }
    ]
  });

  // Filter out reports where inspection is null (i.e., not matching the inspector)
  const inspectorReports = reports.filter(report => report.inspection !== null);

  res.json(inspectorReports);
});

// @desc    Get reports by collaborator
// @route   GET /api/reports/collaborator
// @access  Private/Collaborator
const getReportsByCollaborator = asyncHandler(async (req, res) => {
  const reports = await Report.find({}).populate({
    path: 'inspection',
    match: { collaborator: req.user._id },
    populate: [
      { path: 'inspector', select: 'name email' },
      { path: 'line', select: 'trainNumber' }
    ]
  });
});

// @desc    Get reports by inspection
// @route   GET /api/reports/inspection
// @access  Private/Inspector
const getReportsByInspection = asyncHandler(async (req, res) => {
  const { inspectionId } = req.query;

  if (!inspectionId) {
    res.status(400);
    throw new Error('Inspection ID is required');
  }

  const reports = await Report.find({ inspection: inspectionId }).populate({
    path: 'inspection',
    populate: [
      { path: 'inspector', select: 'name email' },
      { path: 'collaborator', select: 'fullName employeeId' },
      { path: 'line', select: 'trainNumber' }
    ]
  });

  if (!reports) {
    res.status(404);
    throw new Error('Reports not found');
  }

  res.json(reports);
});
export {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  getReportsByInspector,
  getReportsByCollaborator,
  getReportsByInspection
};