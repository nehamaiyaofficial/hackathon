/**
 * Main Express server for CV upload and skills analysis
 * Endpoints:
 * - POST /api/upload-cv  => uploads PDF and extracts text
 * - POST /api/extract-skills => analyzes skills from text
 * - GET  /api/trends?keyword=... => gets trend data
 */

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');
const cors = require('cors');
const { extractSkillsWithGemini } = require('./gemini');
const { getInterestOverTime } = require('./trends');

require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app = express();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const filename = Date.now() + '-' + (file.originalname || 'upload.pdf');
        cb(null, filename);
    }
});
const upload = multer({ storage });

// Routes
app.get('/api/health', (req, res) => {
    res.json({ ok: true, message: 'Server is running!' });
});

// File upload endpoint
app.post('/api/upload-cv', upload.single('cv'), async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('Processing file:', req.file.filename);

        const data = fs.readFileSync(req.file.path);
        const pdf = await pdfParse(data);

        // Optional: Clean up uploaded file
        // fs.unlinkSync(req.file.path);

        return res.json({
            text: pdf.text || '',
            filename: req.file.filename
        });
    } catch (err) {
        console.error('Error processing PDF:', err);
        return res.status(500).json({ error: err.message });
    }
});

// Skills extraction endpoint
app.post('/api/extract-skills', async(req, res) => {
    try {
        const { text, desiredRole } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Missing text parameter' });
        }

        console.log('Extracting skills for role:', desiredRole || 'General');

        const result = await extractSkillsWithGemini({ text, desiredRole });
        return res.json(result);
    } catch (err) {
        console.error('Error extracting skills:', err);
        return res.status(500).json({ error: err.message });
    }
});

// Trends endpoint
app.get('/api/trends', async(req, res) => {
    const keyword = req.query.keyword || '';

    if (!keyword) {
        return res.status(400).json({ error: 'keyword parameter is required' });
    }

    try {
        console.log('Getting trends for keyword:', keyword);
        const trend = await getInterestOverTime(keyword);
        return res.json(trend);
    } catch (err) {
        console.error('Error getting trends:', err);
        return res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
    console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
});