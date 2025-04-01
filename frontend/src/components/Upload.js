import React from "react";
import { Button } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const Upload = ({ setFile }) => {
    const handleChange = (event) => {
        setFile(event.target.files[0]);
    };

    return (
        <div>
            <input
                accept="image/*"
                style={{ display: "none" }}
                id="upload-button"
                type="file"
                onChange={handleChange}
            />
            <label htmlFor="upload-button">
                <Button variant="contained" color="secondary" component="span" startIcon={<CloudUpload />}>
                    Upload Image
                </Button>
            </label>
        </div>
    );
};

export default Upload;
