const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  questionNumber: Number,
  questionText: String,
  answer: { type: String, default: '' }, // Pass / Fail / N/A / text
  notes: { type: String, default: '' },
  images: [{ type: String }] // file paths
}, { _id: false });

const InspectionSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  equipmentCategory: { type: String, required: true },
  equipmentName: { type: String, required: true },
  equipmentId: { type: String, trim: true },
  serialNumber: { type: String, trim: true },
  inspectionDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  responses: [ResponseSchema],
  overallNotes: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

InspectionSchema.pre('save', async function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Inspection', InspectionSchema);
