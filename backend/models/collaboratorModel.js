import mongoose from 'mongoose';

const collaboratorSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    assignedInspector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Collaborator = mongoose.model('Collaborator', collaboratorSchema);

export default Collaborator;