const express = require("express");
const multer = require("multer");
const asciifyImage = require("asciify-image");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));
app.use(cors({ origin: "*" }));

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });
const supportedFonts = ["block", "standard", "fancy"];

// Manual ANSI strip function
function stripAnsiManually(str) {
    const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
    return str.replace(ansiRegex, '');
}

// ASCII Art Processing API
app.post("/api/process", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const { width = 80, colored = false, gradient = false, font = "fancy" } = req.body;
    const imagePath = path.join(__dirname, req.file.path);

    // Validate font
    const selectedFont = supportedFonts.includes(font) ? font : "block";

    console.log(`Processing image: ${imagePath} with options: ${width}, colored=${colored}, gradient=${gradient}, font=${selectedFont}`);

    fs.exists(imagePath, (exists) => {
        if (!exists) {
            return res.status(500).json({ error: "File not found" });
        }

        asciifyImage(imagePath, {
            width: parseInt(width),
            font: selectedFont, // Use validated font
            colored: colored === 'true' || colored === true,
            gradient: gradient === 'true' || gradient === true,
        })
            .then((asciiArt) => {
                // Conditionally strip ANSI codes
                const responseArt = (colored === 'true' || colored === true)
                    ? asciiArt
                    : stripAnsiManually(asciiArt);

                // Clean up uploaded image
                fs.unlink(imagePath, (err) => {
                    if (err) console.error("Error deleting file: ", err);
                });

                res.json({ asciiArt: responseArt });
            })
            .catch((error) => {
                console.error("Error processing image:", error);
                res.status(500).json({ error: "Failed to process image" });
            });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
