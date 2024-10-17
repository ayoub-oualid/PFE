import asyncHandler from 'express-async-handler';
import Inspection from '../models/inspectionModel.js';

// @desc    Create a new inspection
// @route   POST /api/inspections
// @access  Private/Inspector
const createInspection = asyncHandler(async (req, res) => {
  const { collaborator, line, plannedDateTime } = req.body;

  const inspection = await Inspection.create({
    inspector: req.user._id,
    collaborator,
    line,
    plannedDateTime,
    status: 'scheduled',
  });

  if (inspection) {
    res.status(201).json(inspection);
  } else {
    res.status(400);
    throw new Error('Invalid inspection data');
  }
});

// @desc    Get all inspections
// @route   GET /api/inspections
// @access  Private
const getInspections = asyncHandler(async (req, res) => {
  const inspections = await Inspection.find({})
    .populate('inspector', 'name email')
    .populate('collaborator', 'fullName employeeId')
    .populate('line', 'trainNumber');
  res.json(inspections);
});

// @desc    Get inspection by ID
// @route   GET /api/inspections/:id
// @access  Private
const getInspectionById = asyncHandler(async (req, res) => {
  const inspection = await Inspection.findById(req.params.id)
    .populate('inspector', 'name email')
    .populate('collaborator', 'fullName employeeId')
    .populate('line', 'trainNumber');

  if (inspection) {
    res.json(inspection);
  } else {
    res.status(404);
    throw new Error('Inspection not found');
  }
});

// @desc    Update inspection
// @route   PUT /api/inspections/:id
// @access  Private/Inspector
const updateInspection = asyncHandler(async (req, res) => {
  const inspection = await Inspection.findById(req.params.id);

  if (inspection) {
    inspection.status = req.body.status || inspection.status;
    inspection.plannedDateTime = req.body.plannedDateTime || inspection.plannedDateTime;
    inspection.rating = req.body.rating || inspection.rating;
    inspection.report = req.body.report || inspection.report;

    const updatedInspection = await inspection.save();
    res.json(updatedInspection);
  } else {
    res.status(404);
    throw new Error('Inspection not found');
  }
});

// @desc    Delete inspection
// @route   DELETE /api/inspections/:id
// @access  Private/Admin
const deleteInspection = asyncHandler(async (req, res) => {
  const inspection = await Inspection.findById(req.params.id);

  if (inspection) {
    await Inspection.deleteOne({ _id: req.params.id });
    res.json({ message: 'Inspection removed' });
  } else {
    res.status(404);
    throw new Error('Inspection not found');
  }
});
// @desk    Get inspections by inspector
// @route   GET /api/inspections/inspector?inspectorId=:id
// @access  Private/Inspector
const getInspectionsByInspector = async (req, res) => {
  const { inspectorId } = req.query;


  try {
    const inspections = await Inspection.find({ inspector: inspectorId })
      .populate('inspector', 'name email')
      .populate('collaborator', 'fullName employeeId')
      .populate('line', 'trainNumber');

    res.status(200).json(inspections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inspections', error });
  }
};

// @desc    Get inspections by collaborator
// @route   GET /api/inspections/collaborator?collaboratorId=:id
// @access  Private/Collaborator
const getInspectionsByCollaborator = asyncHandler(async (req, res) => {
  const inspections = await Inspection.find({ collaborator : req.query.collaboratorId })
    .populate('inspector', 'name email')
    .populate('collaborator', 'fullName employeeId')
    .populate('line', 'trainNumber');
  res.json(inspections);
});

// @desc    Get inspections by status
// @route   GET /api/inspections/status?status=:status
// @access  Private/Admin
const getInspectionsByStatus = asyncHandler(async (req, res) => {
  const inspections = await Inspection.find({ status: req.query.status })
    .populate('inspector', 'name email')
    .populate('collaborator', 'fullName employeeId')
    .populate('line', 'trainNumber');
  res.json(inspections);
});


export {
  createInspection,
  getInspections,
  getInspectionById,
  updateInspection,
  deleteInspection,
  getInspectionsByInspector,
  getInspectionsByCollaborator,
  getInspectionsByStatus,
};