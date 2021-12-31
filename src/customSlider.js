import React, { useState } from "react";
import { Slider } from "@mui/material";

function CustomSlider(props) {
	const [rating, setRating] = useState(props.initialRating);

	const handleInnerChange = (event, newValue) => {
		if (newValue !== null) {
			if (newValue !== rating) {
				setRating(newValue);
				props.handleSliderChange(props.targetName, newValue);
			}
		}
	};

	return <Slider onChange={handleInnerChange} defaultValue={5} step={1} marks min={1} max={10} value={rating} />;
}

export default CustomSlider;
