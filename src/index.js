import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/* functional component: simpler, doesn't have own state (no constructor) doesn't extend React.Component
*  takes props as input and returns what should be rendered
*/
function Square(props) { 
	return(
		<button className="square" style={props.color} onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {	
	renderSquare(i) {
		const winnerSquares = calculateWinnerSquares(this.props.squares);
		if (winnerSquares) {
			if (i === winnerSquares[0] || i === winnerSquares[1] || i === winnerSquares[2]) {
				return(
					<Square
						key={i} 
						value={this.props.squares[i]}
						color={{backgroundColor:'yellow'}}
						onClick={() => this.props.onClick(i)}  
					/>
				);
			}
			else {
				return(
					<Square
						key={i} 
						value={this.props.squares[i]}
						onClick={() => this.props.onClick(i)}
					/>
				);
			}
		}
		else {
			return(
				<Square
					key={i} 
					value={this.props.squares[i]}
					onClick={() => this.props.onClick(i)}  //function(){} replaced w/ arrow function syntax
				/>
			);
		}
	}
	//Challenge 3: Use two loops to make the squares instead of hard-coding them
	render() {
		let i,j,row=[], board=[];
		for (i = 0; i < 3; i++) {
			for (j=0; j < 3; j++) {
				row.push(this.renderSquare(j + (i * 3)));
			};
			board.push(<div key={i} className="board-row">{row}</div>);
			row = [];
		}
		return(
			<div> {board} </div>
		);
				
	}
}

//to remember React components use state (can have state by setting this.state in constructor)
class Game extends React.Component { 
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null)
			}],
			moves: [
				'Game Start'
			],
			ascending: true,
			stepNumber: 0,
			xIsNext: true,
		};
	}
	
	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		let moves = this.state.moves.slice(0,this.state.stepNumber + 1);
		const current = history[history.length-1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}

		squares[i] = this.state.xIsNext ? 'X' : 'O';

		//CHALLENGE 1: Display (x,y) location in moves history list
		let x,y;
			if (i > 5){
				x = i - 5;
				y = 1;
			}
			else if (i > 2){
				x = i - 2;
				y = 2;
			}
			else{
				x = i + 1;
				y = 3;
			}

		const desc = squares[i] + ' takes square (' + x + ',' + y + ')';
		moves.push(desc);
		this.setState({
			history: history.concat([{
				squares: squares
			}]),
			moves: moves,
			ascending: this.state.ascending,
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}
	
	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}

	//CHALLENGE 4: Ascending/Descending Button
	toggle() {
		this.setState({
			ascending: !this.state.ascending
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		
		//CHALLENGE 2: Bold currently selected item in the move list
		let moves = this.state.moves.map((step, move) => {
			if (move === this.state.stepNumber) {
				return(
					<li key={move}>
						<button style={{fontWeight:'bold'}} onClick={() => this.jumpTo(move)}>{step}</button>
					</li>
				);
			}
			else {
				return(
					<li key={move}>
						<button style={{fontWeight:'normal'}} onClick={() => this.jumpTo(move)}>{step}</button>
					</li>
				);
			}

		});

		if (!this.state.ascending) {
			moves.reverse();
		}

		let status;
		if (winner) {
			status = 'WINNER: ' + winner;
		}
		//CHALLENGE 6: DRAW message when no one wins
		else if (this.state.stepNumber === 9) {
			console.log(this.state.stepNumber);
			status = 'DRAW';
		}
		else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}
		
		return(
			<div className="game">
				<div className="game-board">
					<Board 
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<button className="re-order" onClick={() => this.toggle()}>Ascending/Descending</button>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	]; 
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { //truthy
			return squares[a];
		}
	}
	return null;
}

//CHALLENGE 5: Highlight winning squares
function calculateWinnerSquares(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	]; 
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { //truthy
			return [a, b, c];
		}
	}
	return null;
}

// ===================================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
				
































	
				
			