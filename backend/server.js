const express = require("express");
const multer = require("multer");
const asciifyImage = require("asciify-image");
//const stripAnsi = require("strip-ansi"); // Import strip-ansi to clean the output
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

// ASCII Art Processing API
app.post("/api/process", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const { width = 80, colored = false, gradient = false, font = "block" } = req.body;
    const imagePath = path.join(__dirname, req.file.path);

    console.log(`Processing image: ${imagePath} with options: ${width}, ${colored}, ${gradient}, ${font}`);

    // Check if the file exists before proceeding
    fs.exists(imagePath, (exists) => {
        if (!exists) {
            return res.status(500).json({ error: "File not found" });
        }
        function stripAnsiManually(str) {
            const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
            return str.replace(ansiRegex, '');
          }
        // Process the image with asciify-image
        asciifyImage(imagePath, {
            width: width,  // Set the size (width)
            font: font,    // Set the font style
            colored: colored,  // Set whether the output should be colored
            gradient: gradient  // Set whether the output should use a gradient
        })
            .then((asciiArt) => {
                // Strip out the ANSI color codes
                const cleanAsciiArt = stripAnsiManually(asciiArt);

                // Remove uploaded file after processing
                fs.unlink(imagePath, (err) => {
                    if (err) console.error("Error deleting file: ", err);
                });

                res.json({ asciiArt: cleanAsciiArt });
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
