import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, TextField, Checkbox, FormControlLabel } from "@mui/material";

const Options = ({ setOptions }) => {
    const [size, setSize] = useState(80); // Default size (Width in characters)
    const [colored, setColored] = useState(false); // Whether to use colored output
    const [gradient, setGradient] = useState(false); // Whether to use gradient characters
    const [font, setFont] = useState("block"); // Default font (ASCII style)

    // Handle the change of character set (font)
    const handleCharacterSetChange = (e) => {
        setFont(e.target.value);
        // Pass the updated options to parent (App.js)
        setOptions({ width: size, colored, gradient, font: e.target.value });
    };

    // Handle the change in size (width of ASCII art)
    const handleSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10) || 80;
        setSize(newSize);
        // Pass the updated size to parent (App.js)
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
            {/* Character Set Dropdown */}
            <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Character Set</InputLabel>
                <Select
                    onChange={handleCharacterSetChange}
                    value={font}
                >
                    <MenuItem value="block">Blocks</MenuItem>
                    <MenuItem value="standard">Standard</MenuItem>
                    <MenuItem value="fancy">Fancy</MenuItem>
                </Select>
            </FormControl>

            {/* Size (Width) Input */}
            <TextField
                label="Size (Width in Characters)"
                type="number"
                value={size}
                onChange={handleSizeChange}  // <-- This is where the size is updated
                fullWidth
                inputProps={{ min: 20, max: 200 }}
                style={{ marginBottom: "10px" }}
            />

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

