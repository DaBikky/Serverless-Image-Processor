import React from "react";
import { Paper, Typography } from "@mui/material";

const Preview = ({ file, asciiArt }) => {
    return (
        <Paper elevation={3} style={{ padding: "20px", marginTop: "20px", overflowX: "auto" }}>
            {file && (
                <div>
                    <Typography variant="h6">Original Image</Typography>
                    <img src={URL.createObjectURL(file)} alt="Uploaded" style={{ maxWidth: "100%" }} />
                </div>
            )}
            {asciiArt && (
                <div style={{ marginTop: "10px", whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
                    <Typography variant="h6">ASCII Art</Typography>
                    <pre>{asciiArt}</pre>
                </div>
            )}
        </Paper>
    );
};

export default Preview;
