const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// 1. MongoDB Atlas Connection
const MONGO_URI = 'mongodb+srv://expertproven_db_user:%40proowais123@cluster0.zpbj7eu.mongodb.net/owais_portal?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Cloud (Atlas) connected successfully!'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// 2. Database Structure (Schema)
const visitorSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true },
    userAgent: { type: String },
    screenResolution: { type: String },
    language: { type: String },
    platform: { type: String },
    visitedAt: { type: Date, default: Date.now }
});

const Visitor = mongoose.model('Visitor', visitorSchema);

// ==========================================
// API ROUTES
// ==========================================

// ROUTE 1: Ping endpoint for cron-job.org to keep server 24/7 awake
app.get('/ping', (req, res) => {
    res.status(200).send("Server is awake, Owais!");
});

// ROUTE 2: Tracking API for your Frontend (index.html)
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

// ==========================================
// SERVER START
// ==========================================
// Cloud host (Render) ke liye process.env.PORT zaroori hota hai
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API is running on port ${PORT}`);
});            userAgent: userAgent,
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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 API is running on http://localhost:${PORT}`);
});
