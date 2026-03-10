const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Cloud Connection
const MONGO_URI = 'mongodb+srv://expertproven_db_user:%40proowais123@cluster0.zpbj7eu.mongodb.net/owais_portal?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Cloud (Atlas) connected successfully!'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Schema Definition
const visitorSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true },
    userAgent: { type: String },
    screenResolution: { type: String },
    language: { type: String },
    platform: { type: String },
    visitedAt: { type: Date, default: Date.now }
});

const Visitor = mongoose.model('Visitor', visitorSchema);

// Ping Route for Cron-Job
app.get('/ping', (req, res) => {
    res.status(200).send("Server is awake, Owais!");
});

// Tracking Route
app.post('/api/track', async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        const { screenResolution, language, platform } = req.body;

        const newVisitor = new Visitor({
            ipAddress: ip,
            userAgent: userAgent,
            screenResolution: screenResolution,
            language: language,
            platform: platform
        });

        await newVisitor.save();

        console.log(`🎉 New visitor logged! IP: ${ip}`);
        res.status(200).json({ success: true, message: "Visitor data saved to Cloud!" });

    } catch (error) {
        console.error("Error saving visitor:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API is running on port ${PORT}`);
});});
