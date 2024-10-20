import asyncHandler from 'express-async-handler';
import Line from '../models/lineModel.js';
import Collaborator from '../models/collaboratorModel.js';
import mongoose from 'mongoose';
// @desc    Create a new line
// @route   POST /api/lines
// @access  Private/Admin
const createLine = asyncHandler(async (req, res) => {
  const { trainNumber, dateTime, firstStop, lastStop, collaborators } = req.body;

  const lineExists = await Line.findOne({ trainNumber });

  if (lineExists) {
    res.status(400);
    throw new Error('Line already exists');
  }

  const line = await Line.create({
    trainNumber,
    dateTime,
    firstStop,
    lastStop,
    collaborators,
  });

  if (line) {
    res.status(201).json(line);
  } else {
    res.status(400);
    throw new Error('Invalid line data');
  }
});

// @desc    Get all lines
// @route   GET /api/lines
// @access  Private
const getLines = asyncHandler(async (req, res) => {
  const lines = await Line.find({}).populate('collaborators', 'fullName employeeId');
  res.json(lines);
});

// @desc    Get line by ID
// @route   GET /api/lines/:id
// @access  Private
const getLineById = asyncHandler(async (req, res) => {
  const line = await Line.findById(req.params.id).populate('collaborators', 'fullName employeeId');

  if (line) {
    res.json(line);
  } else {
    res.status(404);
    throw new Error('Line not found');
  }
});

// @desc    Update line
// @route   PUT /api/lines/:id
// @access  Private/Admin
const updateLine = asyncHandler(async (req, res) => {
  const line = await Line.findById(req.params.id);

  if (line) {
    line.trainNumber = req.body.trainNumber || line.trainNumber;
    line.dateTime = req.body.dateTime || line.dateTime;
    line.firstStop = req.body.firstStop || line.firstStop;
    line.lastStop = req.body.lastStop || line.lastStop;
    line.collaborators = req.body.collaborators || line.collaborators;

    const updatedLine = await line.save();
    res.json(updatedLine);
  } else {
    res.status(404);
    throw new Error('Line not found');
  }
});

// @desc    Delete line
// @route   DELETE /api/lines/:id
// @access  Private/Admin
const deleteLine = asyncHandler(async (req, res) => {
  const line = await Line.findById(req.params.id);

  if (line) {
    await line.remove();
    res.json({ message: 'Line removed' });
  } else {
    res.status(404);
    throw new Error('Line not found');
  }
});

// @desc    Get lines by collaborator
// @route   GET /api/lines/collaborator/:id
// @access  Private
const getLinesByCollaborator = asyncHandler(async (req, res) => {
  const collaboratorId = req.params.id;

  // Check if the collaborator exists
  const collaboratorExists = await Collaborator.exists({ _id: collaboratorId });
  if (!collaboratorExists) {
    return res.status(404).json({ message: 'Collaborator not found' });
  }

  // Find all lines where the collaboratorId exists in the collaborators array
  const lines = await Line.find({
    collaborators: {
      $elemMatch: { $eq: collaboratorId }
    }
  }).populate('collaborators'); // Optional: populate collaborator details

  res.json(lines);
});
// @desc    assign collaborator to line
// @route   PUT /api/lines/:id/assign
// @access  Private/Admin
const assignCollaboratorToLine = asyncHandler(async (req, res) => {
  const line = await Line.findById(req.params.id);

  if (line) {
    line.collaborators.push(req.body.collaboratorId);
    const updatedLine = await line.save();
    res.json(updatedLine);
  } else {
    res.status(404);
    throw new Error('Line not found');
  }
});

export {
  createLine,
  getLines,
  getLineById,
  updateLine,
  deleteLine,
  getLinesByCollaborator,
  assignCollaboratorToLine,
};