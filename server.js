// ─────────────────────────────────────────────
//  LESSON 1 — Your First Express Server
// ─────────────────────────────────────────────

require('dotenv').config();

// 1. Import express — like adding a library in Python
const express = require('express');

// 2. Import 'path' — a built-in Node module for file paths
const path = require('path');

const nodemailer = require('nodemailer');

// 3. Create your app — this IS your server
const app = express();

// 4. Choose the port your server listens on
//    process.env.PORT lets hosting platforms (Render, Railway) set it later
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────
//  MIDDLEWARE
//  (code that runs on EVERY request, before routes)
// ─────────────────────────────────────────────

// 🔍 DEBUG — print what dotenv loaded (remove this after fixing)
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ loaded (' + process.env.EMAIL_PASS.length + ' chars)' : '❌ UNDEFINED');
console.log('RECEIVER:  ', process.env.RECEIVER);

// Tell Express to serve your HTML/CSS/JS files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Tell Express to understand JSON bodies (needed for fetch() calls later)
app.use(express.json());


// ─────────────────────────────────────────────
//  EMAIL TRANSPORTER
//  Think of this as your "email client" object.
//  It uses your Gmail to send emails.
// ─────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});


// ─────────────────────────────────────────────
//  ROUTES
//  Each route = a URL + what to do when someone visits it
// ─────────────────────────────────────────────

// GET /api/status → our first API endpoint!
// "GET" means: just fetch some data (no changes)
app.get('/api/status', (req, res) => {
    // req = the incoming request (what the browser sent)
    // res = the response (what we send back)

    res.json({
        status: 'online',
        message: 'portfolio backend is running! 🚀',
        time: new Date().toISOString()
    });
});

// POST /api/contact → receives form data, sends email
app.post('/api/contact', async (req, res) => {

    // 1️⃣  Read what the browser sent us
    const { name, email, message } = req.body;

    // 2️⃣  Validate — make sure nothing is empty
    if (!name || !email || !message) { 
        return res.status(400).json({
            success: false,
            error: 'All fields are required.'
        });
    }

    // 3️⃣  Build the email object
    const mailOptions = {
        from:    `"${name}" <${process.env.EMAIL_USER}>`,
        to:      process.env.RECEIVER,
        subject: `📬 Portfolio contact from ${name}`,
        // Plain text version
        text: `Name:    ${name}\nEmail:   ${email}\n\nMessage:\n${message}`,
        // HTML version (shows up nicely in Gmail)
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px;">
                <h2 style="color: #6c63ff;">New Portfolio Message</h2>
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <hr style="border-color: #eee;">
                <p><strong>Message:</strong></p>
                <p style="color: #444;">${message}</p>
            </div>
        `
    };

    // 4️⃣  Send it! (async/await because sending takes time)
    try {
        await transporter.sendMail(mailOptions);

        // 5️⃣  Tell the browser it worked
        res.json({ success: true, message: 'Email sent successfully!' });

    } catch (error) {
        // If something goes wrong, log it and tell the browser
        console.error('Email error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to send email. Please try again.'
        });
    }
});

// ─────────────────────────────────────────────
//  START THE SERVER
// ─────────────────────────────────────────────

app.listen(PORT, () => {
    console.log('─────────────────────────────────');
    console.log(`✅ Server running!`);
    console.log(`   Local: http://localhost:${PORT}`);
    console.log(`   API:   http://localhost:${PORT}/api/status`);
    console.log('─────────────────────────────────');
});