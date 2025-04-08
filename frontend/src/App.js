import React, { useState } from "react";
import { Container, Typography, Paper, Button, CircularProgress, Alert, Slider, createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import Upload from "./components/Upload";
import Options from "./components/Options";
import Preview from "./components/Preview";
import axios from "axios";
import AnsiToHtml from "ansi-to-html";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const App = () => {
    const [file, setFile] = useState(null);
    const [options, setOptions] = useState({ width: 80, colored: false, gradient: false, font: "block" });
    const [asciiArt, setAsciiArt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [scale, setScale] = useState(1); // Current scale value
    const [appliedOptions, setAppliedOptions] = useState({ options: {}, scale: 1 }); // Applied settings

    const handleUpload = async () => {
        if (!file) {
            setError("Please upload an image first.");
            return;
        }

        if (!options.width || options.width <= 0) {
            setError("Please provide a valid width.");
            return;
        }

        // Apply the current settings
        setAppliedOptions({ options, scale });

        setLoading(true);
        setError("");
        setAsciiArt("");

        const formData = new FormData();
        formData.append("image", file);
        formData.append("width", options.width);
        formData.append("colored", options.colored);
        formData.append("gradient", options.gradient);
        formData.append("font", options.font);

        try {
            const response = await axios.post("http://localhost:5000/api/process", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (options.colored) {
                const convert = new AnsiToHtml();
                const htmlArt = convert.toHtml(response.data.asciiArt);
                setAsciiArt(htmlArt);
            } else {
                setAsciiArt(response.data.asciiArt);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to process image.");
        }

        setLoading(false);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Container maxWidth="md" style={{ textAlign: "center", padding: "20px", minHeight: "100vh", backgroundColor: "#121212" }}>
                <Typography variant="h4" gutterBottom>
                    ASCII Art Image Processor
                </Typography>

                <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
                    <Upload setFile={setFile} />
                    <Options setOptions={setOptions} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        style={{ marginTop: "10px" }}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Convert to ASCII"}
                    </Button>
                </Paper>

                {loading && <CircularProgress style={{ margin: "20px 0" }} />}
                {error && <Alert severity="error" style={{ margin: "20px 0" }}>{error}</Alert>}

                <Typography variant="h6" gutterBottom>
                    Scale ASCII Art
                </Typography>
                <Slider
                    value={scale}
                    onChange={(e, newValue) => setScale(newValue)}
                    min={0.5}
                    max={3}
                    step={0.1}
                    valueLabelDisplay="auto"
                    style={{ marginBottom: "20px" }}
                />

                <Preview file={file} asciiArt={asciiArt} scale={appliedOptions.scale} />
            </Container>
        </ThemeProvider>
    );
};

export default App;