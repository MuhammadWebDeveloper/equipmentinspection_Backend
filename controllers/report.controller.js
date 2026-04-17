const Report = require('../models/Report.model');
const Inspection = require('../models/Inspection.model');
const path = require('path');
const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, ImageRun, HeadingLevel, ShadingType
} = require('docx');

// GET /api/reports
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ inspector: req.user._id })
      .populate({ path: 'inspection', populate: { path: 'client', select: 'name email phone address' } })
      .populate('client', 'name email phone address')
      .populate('inspector', 'name licenseNumber email')
      .sort({ generatedAt: -1 });
    res.json(reports);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/reports/:id
const getReport = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, inspector: req.user._id })
      .populate({ path: 'inspection', populate: { path: 'client', select: 'name email phone address' } })
      .populate('client', 'name email phone address')
      .populate('inspector', 'name licenseNumber email');
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/reports/:id
const updateReport = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, inspector: req.user._id });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    const { findings, recommendations } = req.body;
    if (findings !== undefined) report.findings = findings;
    if (recommendations !== undefined) report.recommendations = recommendations;
    await report.save();
    res.json(report);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/reports/:id
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({ _id: req.params.id, inspector: req.user._id });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json({ message: 'Report deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/reports/:id/download
const downloadReport = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, inspector: req.user._id })
      .populate({
        path: 'inspection',
        populate: { path: 'client', select: 'name email phone address' }
      })
      .populate('inspector', 'name licenseNumber email');

    if (!report) return res.status(404).json({ message: 'Report not found' });

    const { inspection, inspector } = report;
    const client = inspection.client;
    const uploadsDir = path.join(__dirname, '../uploads');

    // Helper to create a styled text run
    const boldText = (text, size = 22) => new TextRun({ text: String(text || ''), bold: true, size, font: 'Calibri' });
    const normalText = (text, size = 20) => new TextRun({ text: String(text || ''), size, font: 'Calibri' });
    const colorText = (text, color = '1e6fff', size = 22) => new TextRun({ text: String(text || ''), color, bold: true, size, font: 'Calibri' });

    const divider = () => new Paragraph({
      border: { bottom: { color: '1e6fff', style: BorderStyle.SINGLE, size: 8 } },
      spacing: { after: 100 }
    });

    const sectionHeader = (text) => new Paragraph({
      children: [new TextRun({ text, bold: true, size: 24, color: '0a1628', font: 'Calibri' })],
      spacing: { before: 300, after: 150 },
      shading: { type: ShadingType.SOLID, color: 'e8f0fe' }
    });

    // Build checklist rows
    const checklistRows = [];
    // Header row
    checklistRows.push(new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [boldText('No.', 20)] })], width: { size: 8, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.SOLID, color: '0a1628' } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Inspection Item', bold: true, size: 20, color: 'FFFFFF', font: 'Calibri' })] })], width: { size: 50, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.SOLID, color: '0a1628' } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Result', bold: true, size: 20, color: 'FFFFFF', font: 'Calibri' })] })], width: { size: 15, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.SOLID, color: '0a1628' } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Notes', bold: true, size: 20, color: 'FFFFFF', font: 'Calibri' })] })], width: { size: 27, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.SOLID, color: '0a1628' } }),
      ],
      tableHeader: true
    }));

    const resultColor = (ans) => {
      if (ans === 'Pass') return '1a9c3e';
      if (ans === 'Fail') return 'e53935';
      return '888888';
    };

    for (const r of (inspection.responses || [])) {
      checklistRows.push(new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [normalText(r.questionNumber)] })] }),
          new TableCell({ children: [new Paragraph({ children: [normalText(r.questionText)] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: r.answer || 'N/A', bold: true, size: 20, color: resultColor(r.answer), font: 'Calibri' })] })] }),
          new TableCell({ children: [new Paragraph({ children: [normalText(r.notes || '-')] })] }),
        ]
      }));
    }

    // Collect image paragraphs
    const imageParagraphs = [];
    for (const r of (inspection.responses || [])) {
      for (const imgPath of (r.images || [])) {
        const fullPath = path.join(uploadsDir, path.basename(imgPath));
        if (fs.existsSync(fullPath)) {
          const imgBuffer = fs.readFileSync(fullPath);
          const ext = path.extname(imgPath).toLowerCase().replace('.', '');
          imageParagraphs.push(
            new Paragraph({ children: [boldText(`Q${r.questionNumber}: ${r.questionText}`, 20)], spacing: { before: 200, after: 80 } }),
            new Paragraph({
              children: [new ImageRun({ data: imgBuffer, transformation: { width: 400, height: 280 }, type: ext === 'png' ? 'png' : 'jpg' })],
              spacing: { after: 200 }
            })
          );
        }
      }
    }

    const docSections = [
      // ── HEADER ──
      new Paragraph({ children: [new TextRun({ text: 'PASS', bold: true, size: 56, color: '1e6fff', font: 'Calibri' })], alignment: AlignmentType.CENTER }),
      new Paragraph({ children: [new TextRun({ text: 'Prime Assessment Services and Solutions', size: 26, color: '0a1628', font: 'Calibri' })], alignment: AlignmentType.CENTER }),
      new Paragraph({ children: [new TextRun({ text: 'Equipment Inspection Division', size: 22, color: '555555', font: 'Calibri' })], alignment: AlignmentType.CENTER }),
      divider(),
      new Paragraph({ children: [colorText('EQUIPMENT INSPECTION REPORT', '0a1628', 36)], alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
      new Paragraph({ children: [boldText(`Report No: `, 22), colorText(report.reportNumber)], alignment: AlignmentType.CENTER, spacing: { after: 300 } }),
      divider(),

      // ── INSPECTION INFO ──
      sectionHeader('  INSPECTION DETAILS'),
      new Paragraph({ children: [boldText('Inspector Name:   '), normalText(inspector?.name)], spacing: { after: 80 } }),
      new Paragraph({ children: [boldText('License Number:   '), normalText(inspector?.licenseNumber)], spacing: { after: 80 } }),
      new Paragraph({ children: [boldText('Client Name:      '), normalText(client?.name)], spacing: { after: 80 } }),
      new Paragraph({ children: [boldText('Client Contact:   '), normalText(client?.phone || client?.email)], spacing: { after: 80 } }),
      new Paragraph({ children: [boldText('Client Address:   '), normalText(client?.address)], spacing: { after: 80 } }),
      new Paragraph({ children: [boldText('Equipment Category:'), normalText(inspection.equipmentCategory)], spacing: { after: 80 } }),
      new Paragraph({ children: [boldText('Equipment Name:   '), normalText(inspection.equipmentName)], spacing: { after: 80 } }),
      new Paragraph({ children: [boldText('Equipment ID:     '), normalText(inspection.equipmentId)], spacing: { after: 80 } }),
      new Paragraph({ children: [boldText('Serial Number:    '), normalText(inspection.serialNumber)], spacing: { after: 80 } }),
      new Paragraph({ children: [boldText('Inspection Date:  '), normalText(new Date(inspection.inspectionDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }))], spacing: { after: 80 } }),
      new Paragraph({ children: [boldText('Report Generated: '), normalText(new Date(report.generatedAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }))], spacing: { after: 200 } }),
      divider(),

      // ── CHECKLIST ──
      sectionHeader('  INSPECTION CHECKLIST RESULTS'),
      new Paragraph({ spacing: { after: 150 } }),
      new Table({ rows: checklistRows, width: { size: 100, type: WidthType.PERCENTAGE } }),
      new Paragraph({ spacing: { after: 200 } }),
      divider(),

      // ── OVERALL NOTES ──
      sectionHeader('  OVERALL INSPECTION NOTES'),
      new Paragraph({ children: [normalText(inspection.overallNotes || 'No overall notes provided.')], spacing: { after: 200 } }),
      divider(),

      // ── FINDINGS ──
      sectionHeader('  FINDINGS & RECOMMENDATIONS'),
      new Paragraph({ children: [boldText('Findings: ')], spacing: { after: 80 } }),
      new Paragraph({ children: [normalText(report.findings || 'No findings recorded.')], spacing: { after: 150 } }),
      new Paragraph({ children: [boldText('Recommendations: ')], spacing: { after: 80 } }),
      new Paragraph({ children: [normalText(report.recommendations || 'No recommendations recorded.')], spacing: { after: 200 } }),
      divider(),

      // ── IMAGES ──
      ...(imageParagraphs.length > 0 ? [sectionHeader('  INSPECTION PHOTOGRAPHS'), ...imageParagraphs, divider()] : []),

      // ── SIGNATURE ──
      sectionHeader('  INSPECTOR DECLARATION & SIGNATURE'),
      new Paragraph({ children: [normalText('I hereby certify that this inspection was carried out in accordance with the applicable standards and the information recorded is accurate to the best of my knowledge.')], spacing: { after: 300 } }),
      new Paragraph({ children: [boldText('Inspector Name:   '), normalText(inspector?.name)], spacing: { after: 200 } }),
      new Paragraph({ children: [boldText('License No:       '), normalText(inspector?.licenseNumber)], spacing: { after: 200 } }),
      new Paragraph({ children: [boldText('Signature:        '), normalText('_______________________________')], spacing: { after: 200 } }),
      new Paragraph({ children: [boldText('Date:             '), normalText(new Date(report.signatureDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }))], spacing: { after: 300 } }),
      divider(),
      new Paragraph({ children: [new TextRun({ text: 'PASS — Prime Assessment Services and Solutions | Equipment Inspection Division', size: 16, color: '999999', font: 'Calibri' })], alignment: AlignmentType.CENTER }),
    ];

    const doc = new Document({
      sections: [{ properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } }, children: docSections }]
    });

    const buffer = await Packer.toBuffer(doc);
    const filename = `PASS-Report-${report.reportNumber}.docx`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getReports, getReport, updateReport, deleteReport, downloadReport };
