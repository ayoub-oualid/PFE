import mongoose from 'mongoose';

const inspectionSchema = mongoose.Schema(
  {
    inspector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collaborator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collaborator',
      required: true,
    },
    line: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Line',
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'done', 'waiting_for_report'],
      default: 'scheduled',
    },
    plannedDateTime: {
      type: Date,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

const Inspection = mongoose.model('Inspection', inspectionSchema);

export default Inspection;