const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. MONGODB DATABASE CONNECTION
// ==========================================
const MONGO_URI = 'mongodb+srv://expertproven_db_user:%40proowais123@cluster0.zpbj7eu.mongodb.net/owais_portal?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Cloud (Atlas) connected successfully!'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// ==========================================
// 2. DATABASE SCHEMA (Data Structure)
// ==========================================
const visitorSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true },
    userAgent: { type: String },
    screenResolution: { type: String },
    language: { type: String },
    platform: { type: String },
    batteryLevel: { type: String },   // Advanced: Battery %
    localTime: { type: String },      // Advanced: Local Time of visitor
    networkType: { type: String },    // Advanced: WiFi/4G
    visitedAt: { type: Date, default: Date.now }
});

const Visitor = mongoose.model('Visitor', visitorSchema);

// ==========================================
// 3. API ROUTES
// ==========================================

// ROUTE 1: Ping Route (Keeps server 24/7 awake via Cron-Job)
app.get('/ping', (req, res) => {
    res.status(200).send("Server is awake, King OwAiS!");
});

// ROUTE 2: Admin Dashboard Route (Fetch all visitors securely)
app.get('/api/visitors', async (req, res) => {
    // Password Protection
    const { password } = req.query;
    if (password !== "kingowais123") {
        return res.status(401).json({ success: false, message: "Access Denied! You are not King OwAiS." });
    }

    try {
        // Fetch latest 100 visitors, sorted by newest first
        const visitors = await Visitor.find().sort({ visitedAt: -1 }).limit(100);
        res.status(200).json(visitors);
    } catch (error) {
        console.error("Error fetching visitors:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ROUTE 3: Tracking Route (Receives data from index.html)
app.post('/api/track', async (req, res) => {
    try {
        const { ipAddress, screenResolution, language, platform, batteryLevel, localTime, networkType } = req.body;
        
        // Extract IP (Fallback to server-side if frontend fails)
        const ip = ipAddress || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];

        const newVisitor = new Visitor({
            ipAddress: ip,
            userAgent: userAgent,
            screenResolution: screenResolution,
            language: language,
            platform: platform,
            batteryLevel: batteryLevel,
            localTime: localTime,
            networkType: networkType
        });

        await newVisitor.save();

        console.log(`🎉 New Pro visitor logged! IP: ${ip}`);
        res.status(200).json({ success: true, message: "Advanced Visitor data saved to Cloud!" });

    } catch (error) {
        console.error("Error saving visitor:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ==========================================
// 4. START THE SERVER
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 King OwAiS API is running on port ${PORT}`);
});