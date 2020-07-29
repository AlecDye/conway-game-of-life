import React, { useState, useCallback, useRef } from "react";
import produce from "immer";

// Row / Column sizes
const numRows = 25;
const numCols = 25;

// Array of possible operations for neighbors (8)
const operations = [
	[0, 1],
	[0, -1],
	[1, -1],
	[-1, 1],
	[1, 1],
	[-1, -1],
	[1, 0],
	[-1, 0],
];

// Resets grid to empty
const resetGrid = () => {
	const rows = [];
	// loop to create grid's rows
	for (let i = 0; i < numRows; i++) {
		// populate each row with a column of 0
		rows.push(Array.from(Array(numCols), () => 0));
	}

	return rows;
};

// Grid (or grid cell)
const Grid = () => {
	// Initializes grid state to empty grid
	const [grid, setGrid] = useState(() => {
		return resetGrid();
	});

	// Initializing state for simulation running
	const [running, setRunning] = useState(false);

	// setTimeout state
	const [rate, setRate] = useState(300);

	// useRef will store the current state of "running"
	const runningRef = useRef();
	runningRef.current = running;

	// useCallback to create a recursive function
	const runSimulation = useCallback(() => {
		// base (end) condition
		if (!runningRef.current) {
			return;
		}
		// Simulation - g is our original grid
		setGrid((g) => {
			// need to create a grid copy in this function's scope
			return produce(g, (gridCopy) => {
				// 2 for loops to populate both rows and cols
				for (let Rindex = 0; Rindex < numRows; Rindex++) {
					for (let Cindex = 0; Cindex < numCols; Cindex++) {
						// neighbors will determine if grid is "on" or "off"
						let neighbors = 0;
						// Using the operations array to make cleaner code (otherwise chain conditional statements)
						operations.forEach(([x, y]) => {
							const newRindex = Rindex + x;
							const newCindex = Cindex + y;
							// checking the boundaries (row / col) of the grid
							if (newRindex >= 0 && newRindex < numRows && newCindex >= 0 && numCols) {
								neighbors += g[newRindex][newCindex];
							}
						});
						// condition for underpop or overpop of neighbors to grid
						if (neighbors < 2 || neighbors > 3) {
							gridCopy[Rindex][Cindex] = 0;
						}
						// condition for dead cell with 3 neighbors
						else if (g[Rindex][Cindex] === 0 && neighbors === 3) {
							gridCopy[Rindex][Cindex] = 1;
						}
					}
				}
			});
		});
		// time that simulation refreshes
		setTimeout(runSimulation, rate);
	}, []);

	return (
		<>
			{/* displays as traditional grid (not a single column)*/}
			<div style={{ display: "grid", gridTemplateColumns: `repeat(${numCols}, 20px)` }}>
				{grid.map((rows, Rindex) =>
					rows.map((col, Cindex) => (
						<div
							key={`${Rindex} - ${Cindex}`}
							onClick={() => {
								// MVP: cannot toggle grids while simulation running
								if (!running) {
									const newGrid = produce(grid, (gridCopy) => {
										// will set to "on"
										// gridCopy[Rindex][Cindex] = 1;
										// will toggle between "on" and "off"
										gridCopy[Rindex][Cindex] = grid[Rindex][Cindex] ? 0 : 1;
									});
									// Recursion
									setGrid(newGrid);
								}
							}}
							style={{
								width: 20,
								height: 20,
								backgroundColor: grid[Rindex][Cindex] ? "#f97b61" : undefined,
								border: "dashed 1px #ababab",
							}}
						/>
					))
				)}
			</div>
			{/* Start / Stop */}
			<button
				onClick={() => {
					setRunning(!running);
					if (!running) {
						// prevents race condition between simulation and running state
						runningRef.current = true;
						runSimulation();
					}
				}}>
				{running ? "Stop" : "Start"}
			</button>
			{/* Random generator */}
			<button
				onClick={() => {
					const rows = [];
					// loop to create grid's rows
					for (let i = 0; i < numRows; i++) {
						// populate each row with a column of 0
						rows.push(Array.from(Array(numCols), () => (Math.random() > 0.8 ? 1 : 0)));
					}

					setGrid(rows);
				}}>
				Random
			</button>
			{/* Reset */}
			<button
				onClick={() => {
					setRunning(!running);
					setGrid(resetGrid());
				}}>
				Reset
			</button>
		</>
	);
};

export default Grid;