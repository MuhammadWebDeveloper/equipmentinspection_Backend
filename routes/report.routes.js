const express = require('express');
const router = express.Router();
const { getReports, getReport, updateReport, deleteReport, downloadReport } = require('../controllers/report.controller');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getReports);
router.get('/:id', getReport);
router.get('/:id/download', downloadReport);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);

module.exports = router;
