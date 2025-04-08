import React from "react";
import { Paper, Typography } from "@mui/material";

const Preview = ({ file, asciiArt, scale }) => {
    return (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
            {file && (
                <div>
                    <h3>Uploaded Image:</h3>
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Uploaded Preview"
                        style={{ maxWidth: "100%", maxHeight: "300px", marginBottom: "20px" }}
                    />
                </div>
            )}
            {asciiArt && (
                <div>
                    <h3>ASCII Art:</h3>
                    <div
                        style={{
                            whiteSpace: "pre-wrap",
                            textAlign: "left",
                            fontFamily: "monospace",
                            transform: `scale(${scale})`, // Apply scaling
                            transformOrigin: "top left", // Scale from top-left corner
                        }}
                        dangerouslySetInnerHTML={{ __html: asciiArt }}
                    />
                </div>
            )}
        </div>
    );
};


export default Preview;
