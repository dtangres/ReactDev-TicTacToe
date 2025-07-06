import { useState } from "react";

function Square({ value, onSquareClick, highlighted }) {
  return (
    <button
      className={highlighted ? "winSquare" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares).winner) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    const nextMove = i;
    onPlay(nextSquares, nextMove);
  }

  const winnerData = calculateWinner(squares);
  let status;
  if (!squares.includes(null) && !winnerData.winner) {
    status = "Draw!";
  } else {
    status = winnerData.winner
      ? `Winner: ${winnerData.winner}`
      : `Next player: ${xIsNext ? "X" : "O"}`;
  }

  let rows = [<div className="status">{status}</div>];
  for (let r = 0; r < 3; r++) {
    let rowComp = [];
    for (let c = 0; c < 3; c++) {
      const index = c + 3 * r;
      rowComp.push(
        <Square
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          highlighted={winnerData.line && winnerData.line.includes(index)}
        />
      );
    }
    rows.push(<div className="board-row">{rowComp}</div>);
  }
  return rows;
}

export default function Game() {
  const [boardHistory, setBoardHistory] = useState([Array(9).fill(null)]);
  const [moveHistory, setMoveHistory] = useState([null]);
  const [currentMove, setCurrentMove] = useState(0);
  const [moveSortAscending, toggleMoveSortAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = boardHistory[currentMove];

  function handlePlay(nextSquares, nextMove) {
    const nextBoardHistory = [
      ...boardHistory.slice(0, currentMove + 1),
      nextSquares,
    ];
    const nextMoveHistory = [
      ...moveHistory.slice(0, currentMove + 1),
      nextMove,
    ];
    setBoardHistory(nextBoardHistory);
    setMoveHistory(nextMoveHistory);
    setCurrentMove(nextBoardHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = boardHistory.map((squares, move) => {
    const moveCheck = moveHistory[move];
    let desc;
    desc =
      move > 0
        ? `Go to move #${move} (${~~(moveCheck / 3)}, ${moveCheck % 3})`
        : "Go to game start";
    const itemContent =
      move < boardHistory.length - 1 ? (
        <button onClick={() => jumpTo(move)}>{desc}</button>
      ) : (
        `You are at move #${move}`
      );
    return <li key={move}>{itemContent}</li>;
  });

  let sortButtonText;
  sortButtonText = `Sort ${moveSortAscending ? "⬆️" : "⬇️"}`;

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => toggleMoveSortAscending(!moveSortAscending)}>
          {sortButtonText}
        </button>
        <ol>{moveSortAscending ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
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
    if (squares[a] && squares[a] === squares[b] && squares[a] == squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}
