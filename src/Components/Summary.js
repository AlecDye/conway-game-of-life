import React from "react";

const Summary = () => {
	return (
		<div>
			<h1>Conway's Game of Life</h1>
			<p>...with React Hooks</p>
			<h2>What is the "Game of Life"?</h2>
			<p>
				Created by John Horton Conway in 1970, the Game of Life is an example of cellular automaton.
				After the user initializes the starting positions of cells, the game will proceed without
				any further input from the user.
			</p>
			<h2>Behavioral Rules</h2>
			<ol>
				<li>Any "live" cell with more than two "living" neighbors will survive</li>
				<li>Any "dead" cell with at least three "living" neighbors will become "alive"</li>
			</ol>
		</div>
	);
};

export default Summary;
