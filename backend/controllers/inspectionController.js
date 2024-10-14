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
    await inspection.remove();
    res.json({ message: 'Inspection removed' });
  } else {
    res.status(404);
    throw new Error('Inspection not found');
  }
});

export {
  createInspection,
  getInspections,
  getInspectionById,
  updateInspection,
  deleteInspection,
};