import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";

const Options = ({ setOptions }) => {
    const [size, setSize] = useState(80); // Default size (Width in characters)
    const [colored, setColored] = useState(false); // Whether to use colored output
    const [gradient, setGradient] = useState(false); // Whether to use gradient characters
    const [font, setFont] = useState("block"); // Default font (ASCII style)
    const [fonts, setFonts] = useState([]); // List of available fonts

    // Fetch fonts when the component mounts
    useEffect(() => {
        axios.get("http://localhost:5000/api/fonts")
            .then((response) => {
                setFonts(response.data.fonts); // Populate fonts from backend
            })
            .catch((error) => {
                console.error("Error fetching fonts:", error);
            });
    }, []);

    // Handle the change of character set (font)
    const handleCharacterSetChange = (e) => {
        const newFont = e.target.value;
        setFont(newFont);
        setOptions({ width: size, colored, gradient, font: newFont });
        console.log("Font updated to:", newFont); // Debugging
    };

    // Handle the change in size (width of ASCII art)
    const handleSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10) || 80;
        setSize(newSize);
        setOptions({ width: newSize, colored, gradient, font });
    };

    // Handle the change in colored output checkbox
    const handleColoredChange = (e) => {
        setColored(e.target.checked);
        setOptions({ width: size, colored: e.target.checked, gradient, font });
    };

    // Handle the change in gradient output checkbox
    const handleGradientChange = (e) => {
        setGradient(e.target.checked);
        setOptions({ width: size, colored, gradient: e.target.checked, font });
    };

    return (
        <div style={{ marginTop: "20px" }}>
            {/* Colored Output Checkbox */}
            <FormControlLabel
                control={
                    <Checkbox
                        checked={colored}
                        onChange={handleColoredChange}
                        color="primary"
                    />
                }
                label="Use Colored Output"
            />

            {/* Gradient Output Checkbox */}
            <FormControlLabel
                control={
                    <Checkbox
                        checked={gradient}
                        onChange={handleGradientChange}
                        color="primary"
                    />
                }
                label="Use Gradient Characters"
            />
        </div>
    );
};

export default Options;