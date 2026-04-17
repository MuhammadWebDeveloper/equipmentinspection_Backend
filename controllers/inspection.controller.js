const Inspection = require('../models/Inspection.model');
const InspectionTemplate = require('../models/InspectionTemplate.model');
const Report = require('../models/Report.model');

// GET /api/inspections
const getInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find({ createdBy: req.user._id })
      .populate('client', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(inspections);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/inspections/:id
const getInspection = async (req, res) => {
  try {
    const inspection = await Inspection.findOne({ _id: req.params.id, createdBy: req.user._id })
      .populate('client', 'name email phone address')
      .populate('createdBy', 'name licenseNumber email');
    if (!inspection) return res.status(404).json({ message: 'Inspection not found' });
    res.json(inspection);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/inspections
const createInspection = async (req, res) => {
  try {
    const { client, equipmentCategory, equipmentName, equipmentId, serialNumber, inspectionDate } = req.body;
    if (!client || !equipmentCategory || !equipmentName || !inspectionDate)
      return res.status(400).json({ message: 'Client, equipment, and date are required' });

    // Load template questions
    const template = await InspectionTemplate.findOne({ equipmentName });
    const responses = template ? template.questions.map(q => ({
      questionNumber: q.questionNumber,
      questionText: q.questionText,
      answer: '',
      notes: '',
      images: []
    })) : [];

    const inspection = await Inspection.create({
      client, equipmentCategory, equipmentName, equipmentId, serialNumber,
      inspectionDate, responses, status: 'Pending', createdBy: req.user._id
    });
    const populated = await inspection.populate('client', 'name email phone');
    res.status(201).json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/inspections/:id
const updateInspection = async (req, res) => {
  try {
    const inspection = await Inspection.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!inspection) return res.status(404).json({ message: 'Inspection not found' });

    const { responses, overallNotes, status, equipmentId, serialNumber, inspectionDate } = req.body;
    if (responses) inspection.responses = responses;
    if (overallNotes !== undefined) inspection.overallNotes = overallNotes;
    if (equipmentId !== undefined) inspection.equipmentId = equipmentId;
    if (serialNumber !== undefined) inspection.serialNumber = serialNumber;
    if (inspectionDate) inspection.inspectionDate = inspectionDate;
    if (status) inspection.status = status;

    await inspection.save();

    // Auto-generate report when completed
    if (status === 'Completed') {
      const existingReport = await Report.findOne({ inspection: inspection._id });
      if (!existingReport) {
        await Report.create({
          inspection: inspection._id,
          client: inspection.client,
          inspector: req.user._id
        });
      }
    }

    const populated = await inspection.populate('client', 'name email phone');
    res.json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/inspections/:id
const deleteInspection = async (req, res) => {
  try {
    const inspection = await Inspection.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!inspection) return res.status(404).json({ message: 'Inspection not found' });
    await Report.findOneAndDelete({ inspection: inspection._id });
    res.json({ message: 'Inspection deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/inspections/:id/upload (upload image for a question)
const uploadImage = async (req, res) => {
  try {
    const { questionNumber } = req.body;
    const inspection = await Inspection.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!inspection) return res.status(404).json({ message: 'Inspection not found' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // With Cloudinary, path is the full URL
    const filePath = req.file.path;
    const qIdx = inspection.responses.findIndex(r => r.questionNumber === Number(questionNumber));
    if (qIdx !== -1) {
      inspection.responses[qIdx].images.push(filePath);
    }
    await inspection.save();
    res.json({ filePath, inspection });
  } catch (err) { res.status(500).json({ message: err.message }); }
};


module.exports = { getInspections, getInspection, createInspection, updateInspection, deleteInspection, uploadImage };
