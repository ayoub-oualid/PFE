import { fi } from 'date-fns/locale';
import mongoose from 'mongoose';

const reportSchema = mongoose.Schema(
  {
    inspection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inspection',
      required: true,
    },
    field1: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
    },
    field2: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
    },
    field3: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
    },
    field4: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
    },
    field5: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
    },
    field6: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
    },
    field7: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
    },
    field8: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
    },
    field9: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
    },
    field10: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
    },
    field11: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
    },
    field12: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
    },
    field13: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
    },
    field14: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
    },
    field15: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;