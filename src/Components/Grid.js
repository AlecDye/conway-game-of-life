import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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

// Grid (or grid cell)
const Grid = () => {
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

	// Initializes grid state to empty grid
	const [grid, setGrid] = useState(() => {
		return resetGrid();
	});

	// Grid cell color state
	const [gridColor, setGridColor] = useState("#f97b61");

	// Initializing state for simulation running
	const [running, setRunning] = useState(false);

	// State for generation (how many updates per seed)
	const [counter, setCounter] = useState(0);

	// setTimeout state
	const [rate, setRate] = useState(600);

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
		setCounter((counter) => counter + 1);
		// time that simulation refreshes
		setTimeout(runSimulation, rate);
	}, [rate]);

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
								backgroundColor: grid[Rindex][Cindex] ? gridColor : undefined,
								border: "dashed 1px #ababab",
							}}
						/>
					))
				)}
			</div>
			{/* Start / Stop */}
			<Button
				onClick={() => {
					setRunning(!running);
					if (!running) {
						// prevents race condition between simulation and running state
						runningRef.current = true;
						runSimulation();
					}
				}}>
				{running ? "Stop" : "Start"}
			</Button>
			{/* Random generator */}
			<Button
				onClick={() => {
					const rows = [];
					// loop to create grid's rows
					for (let i = 0; i < numRows; i++) {
						// populate each row with a column of 0
						rows.push(Array.from(Array(numCols), () => (Math.random() > 0.8 ? 1 : 0)));
					}

					setGrid(rows);
					setRunning(false);
					setCounter(0);
				}}>
				Random
			</Button>
			{/* Reset */}
			<Button
				onClick={() => {
					setRunning(false);
					setGrid(resetGrid());
					setCounter(0);
				}}>
				Reset
			</Button>
			<Container>
				<Row>
					<Col>
						<div>
							<h3>Simulation Speed:</h3>
							<Button
								onClick={() => {
									setRunning(false);
									setRate(900);
								}}>
								Half Speed
							</Button>
							<p>Rate of advance: {rate / 1000} seconds</p>
							<Button
								onClick={() => {
									setRunning(false);
									setRate(300);
								}}>
								Double Speed
							</Button>
						</div>
					</Col>
					<Col>
						<h2>Generation: {counter}</h2>
						<div>
							<h2>Color Select: </h2>
							<Button
								onClick={() => {
									setGridColor("#f97b61");
								}}>
								Salmon
							</Button>
							<Button
								onClick={() => {
									setGridColor("#3eb5f0");
								}}>
								Sky Blue
							</Button>
							<Button
								onClick={() => {
									setGridColor("#f03ec6");
								}}>
								Neon Pink
							</Button>
						</div>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default Grid;
