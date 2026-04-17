const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  inspection: { type: mongoose.Schema.Types.ObjectId, ref: 'Inspection', required: true, unique: true },
  reportNumber: { type: String, unique: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  inspector: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  findings: { type: String, default: '' },
  recommendations: { type: String, default: '' },
  generatedAt: { type: Date, default: Date.now },
  signatureDate: { type: Date, default: Date.now }
});

// Auto-generate report number before save
ReportSchema.pre('save', async function () {
  if (!this.reportNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Report').countDocuments();
    this.reportNumber = `PASS-${year}-${String(count + 1).padStart(4, '0')}`;
  }
});

module.exports = mongoose.model('Report', ReportSchema);
