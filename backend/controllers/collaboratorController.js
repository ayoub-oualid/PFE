import asyncHandler from 'express-async-handler';
import Collaborator from '../models/collaboratorModel.js';

// @desc    Create a new collaborator
// @route   POST /api/collaborators
// @access  Private/Admin
const createCollaborator = asyncHandler(async (req, res) => {
  const { fullName, employeeId, department, position } = req.body;

  const collaboratorExists = await Collaborator.findOne({ employeeId });

  if (collaboratorExists) {
    res.status(400);
    throw new Error('Collaborator already exists');
  }

  const collaborator = await Collaborator.create({
    fullName,
    employeeId,
    department,
    position,
    assignedInspector: req.user._id,
  });

  if (collaborator) {
    res.status(201).json(collaborator);
  } else {
    res.status(400);
    throw new Error('Invalid collaborator data');
  }
});

// @desc    Get all collaborators
// @route   GET /api/collaborators
// @access  Private
const getCollaborators = asyncHandler(async (req, res) => {
  const collaborators = await Collaborator.find({}).populate('assignedInspector', 'name email');
  res.json(collaborators);
});

// @desc    Get collaborator by ID
// @route   GET /api/collaborators/:id
// @access  Private
const getCollaboratorById = asyncHandler(async (req, res) => {
  const collaborator = await Collaborator.findById(req.params.id).populate('assignedInspector', 'name email');

  if (collaborator) {
    res.json(collaborator);
  } else {
    res.status(404);
    throw new Error('Collaborator not found');
  }
});

// @desc    Update collaborator
// @route   PUT /api/collaborators/:id
// @access  Private/Admin
const updateCollaborator = asyncHandler(async (req, res) => {
  const collaborator = await Collaborator.findById(req.params.id);

  if (collaborator) {
    collaborator.fullName = req.body.fullName || collaborator.fullName;
    collaborator.employeeId = req.body.employeeId || collaborator.employeeId;
    collaborator.department = req.body.department || collaborator.department;
    collaborator.position = req.body.position || collaborator.position;
    collaborator.assignedInspector = req.body.assignedInspector || collaborator.assignedInspector;

    const updatedCollaborator = await collaborator.save();
    res.json(updatedCollaborator);
  } else {
    res.status(404);
    throw new Error('Collaborator not found');
  }
});

// @desc    Delete collaborator
// @route   DELETE /api/collaborators/:id
// @access  Private/Admin
const deleteCollaborator = asyncHandler(async (req, res) => {
  const collaborator = await Collaborator.findById(req.params.id);

  if (collaborator) {
    await collaborator.remove();
    res.json({ message: 'Collaborator removed' });
  } else {
    res.status(404);
    throw new Error('Collaborator not found');
  }
});

export {
  createCollaborator,
  getCollaborators,
  getCollaboratorById,
  updateCollaborator,
  deleteCollaborator,
};