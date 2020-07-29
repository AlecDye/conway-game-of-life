import React from "react";
import Grid from "./Components/Grid";
import Summary from "./Components/Summary";

function App() {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}>
			<Grid />
			<Summary />
		</div>
	);
}

export default App;
