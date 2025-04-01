import React, { useState } from "react";
import { Container, Typography, Paper, Button, CircularProgress, Alert, createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import Upload from "./components/Upload";
import Options from "./components/Options";
import Preview from "./components/Preview";
import axios from "axios";

// Create a dark theme
const darkTheme = createTheme({
    palette: {
        mode: "dark", // Set the mode to dark
    },
});

const App = () => {
    const [file, setFile] = useState(null);
    const [options, setOptions] = useState({ width: 80, colored: false, gradient: false, font: "block" });
    const [asciiArt, setAsciiArt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async () => {
        if (!file) {
            setError("Please upload an image first.");
            return;
        }

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
            setAsciiArt(response.data.asciiArt);
        } catch (err) {
            setError("Failed to process image.");
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
                    <Button variant="contained" color="primary" onClick={handleUpload} style={{ marginTop: "10px" }}>
                        Convert to ASCII
                    </Button>
                </Paper>

                {loading && <CircularProgress />}
                {error && <Alert severity="error">{error}</Alert>}

                <Preview file={file} asciiArt={asciiArt} />
            </Container>
        </ThemeProvider>
    );
};

export default App;

