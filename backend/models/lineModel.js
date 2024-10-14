import mongoose from 'mongoose';

const lineSchema = mongoose.Schema(
  {
    trainNumber: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    firstStop: {
      type: String,
      required: true,
    },
    lastStop: {
      type: String,
      required: true,
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collaborator',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Line = mongoose.model('Line', lineSchema);

export default Line;