const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// 1. MONGODB DATABASE CONNECTION
const MONGO_URI = 'mongodb+srv://expertproven_db_user:%40proowais123@cluster0.zpbj7eu.mongodb.net/owais_portal?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Cloud (Atlas) connected successfully!'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// 2. PRO DATABASE SCHEMA (All Features)
const visitorSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true },
    location: { type: String },       // City, Country
    isp: { type: String },            // Internet Provider (Jazz, Zong, PTCL etc)
    referrer: { type: String },       // Kahan se aaya?
    ramAndCpu: { type: String },      // RAM and Processor Cores
    userAgent: { type: String },      // Browser/OS Details
    screenResolution: { type: String },
    language: { type: String },
    platform: { type: String },
    batteryLevel: { type: String },   
    localTime: { type: String },      
    networkType: { type: String },    
    visitedAt: { type: Date, default: Date.now }
});

const Visitor = mongoose.model('Visitor', visitorSchema);

// 3. API ROUTES

// Ping Route for Cron-Job
app.get('/ping', (req, res) => {
    res.status(200).send("Server is awake, King OwAiS!");
});

// Admin Dashboard Route (Secure)
app.get('/api/visitors', async (req, res) => {
    const { password } = req.query;
    if (password !== "kingowais123") {
        return res.status(401).json({ success: false, message: "Access Denied! You are not King OwAiS." });
    }
    try {
        const visitors = await Visitor.find().sort({ visitedAt: -1 }).limit(100);
        res.status(200).json(visitors);
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Pro Tracking Route (Receives data from index.html)
app.post('/api/track', async (req, res) => {
    try {
        const { ipAddress, location, isp, referrer, ramAndCpu, screenResolution, language, platform, batteryLevel, localTime, networkType } = req.body;
        
        const ip = ipAddress || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];

        const newVisitor = new Visitor({
            ipAddress: ip, location: location, isp: isp, referrer: referrer, ramAndCpu: ramAndCpu,
            userAgent: userAgent, screenResolution: screenResolution, language: language,
            platform: platform, batteryLevel: batteryLevel, localTime: localTime, networkType: networkType
        });

        await newVisitor.save();
        console.log(`🎉 Pro Visitor Logged! IP: ${ip} | Loc: ${location}`);
        res.status(200).json({ success: true, message: "Pro Data Saved!" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 King OwAiS API running on port ${PORT}`);
});