const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionNumber: { type: Number, required: true },
  questionText: { type: String, required: true },
  answerType: { type: String, enum: ['pass_fail_na', 'text', 'numeric'], default: 'pass_fail_na' }
}, { _id: false });

const InspectionTemplateSchema = new mongoose.Schema({
  equipmentCategory: { type: String, required: true },
  equipmentName: { type: String, required: true, unique: true },
  questions: [QuestionSchema]
});

module.exports = mongoose.model('InspectionTemplate', InspectionTemplateSchema);
