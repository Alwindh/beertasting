import * as React from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function ToggleButtons(props) {
	const [alignment, setAlignment] = React.useState(props.initialGuess);

	const handleAlignment = (event, newAlignment) => {
		if (newAlignment !== null) {
			if (newAlignment !== alignment) {
				setAlignment(newAlignment);
				props.handleSelectChange(props.targetName, newAlignment);
			}
		}
	};

	return (
		<ToggleButtonGroup
			style={{ minWidth: "100%", display: "flex" }}
			value={alignment}
			exclusive
			onChange={handleAlignment}
		>
			<ToggleButton value="a">A</ToggleButton>
			<ToggleButton value="b">B</ToggleButton>
			<ToggleButton value="c">C</ToggleButton>
			<ToggleButton value="d">D</ToggleButton>
			<ToggleButton value="e">E</ToggleButton>
			<ToggleButton value="f">F</ToggleButton>
			<ToggleButton value="g">G</ToggleButton>
		</ToggleButtonGroup>
	);
}
