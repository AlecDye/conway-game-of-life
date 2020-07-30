import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Grid from "./Components/Grid";
import Summary from "./Components/Summary";

function App() {
	return (
		<Jumbotron fluid>
			<Container>
				<Row>
					<Col>
						<Grid />
					</Col>
					<Col>
						<Summary />
					</Col>
				</Row>
			</Container>
		</Jumbotron>
	);
}

export default App;
