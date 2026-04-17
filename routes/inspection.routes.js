const express = require('express');
const router = express.Router();
const {
  getInspections, getInspection, createInspection,
  updateInspection, deleteInspection, uploadImage
} = require('../controllers/inspection.controller');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const InspectionTemplate = require('../models/InspectionTemplate.model');

router.use(protect);
router.get('/', getInspections);
router.get('/templates', async (req, res) => {
  try {
    const templates = await InspectionTemplate.find({}, 'equipmentCategory equipmentName');
    res.json(templates);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/templates/:equipmentName', async (req, res) => {
  try {
    const template = await InspectionTemplate.findOne({ equipmentName: decodeURIComponent(req.params.equipmentName) });
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/:id', getInspection);
router.post('/', createInspection);
router.put('/:id', updateInspection);
router.delete('/:id', deleteInspection);
router.post('/:id/upload', upload.single('image'), uploadImage);

module.exports = router;
