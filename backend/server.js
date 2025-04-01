const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// ASCII Art Processing API
app.post("/api/process", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const stripAnsi = require("strip-ansi");
    const { characterSet = "--symbols ascii", size = 80 } = req.body;

    const imagePath = path.join(__dirname, req.file.path);

    // Convert image to ASCII using `chafa`
    exec(`chafa ${characterSet} --size=${size} ${imagePath}`, (error, stdout, stderr) => {
        // Remove uploaded file after processing
        fs.unlink(imagePath, () => {});

        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: "Failed to process image" });
        }

        const cleanAsciiArt = stripAnsi(stdout);
        res.json({ asciiArt: cleanAsciiArt });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

