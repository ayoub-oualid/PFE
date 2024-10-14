import mongoose from 'mongoose';

const reportSchema = mongoose.Schema(
  {
    inspection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inspection',
      required: true,
    },
    field1: String,
    field2: String,
    field3: String,
    // Add more predefined fields as needed
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;