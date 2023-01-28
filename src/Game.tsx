import { useState, useEffect } from "react";
import Square from "./Square";

type Scores = {
  [key: string]: number;
};

const INITIAL_GAME_STATE = ["", "", "", "", "", "", "", "", ""];
const INITIAL_SCORE: Scores = { X: 0, O: 0 };

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function Game() {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [scores, setScores] = useState(INITIAL_SCORE);

  useEffect(() => {
    if (gameState === INITIAL_GAME_STATE) return;
    checkForWinner();
  }, [gameState]);

  useEffect(() => {
    const storeScores = localStorage.getItem("scores");
    if (storeScores) {
      setScores(JSON.parse(storeScores));
    }
  }, []);

  const resetBoard = () => setGameState(INITIAL_GAME_STATE);

  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const handleWin = () => {
    window.alert(`Congrats player ${currentPlayer}! You are the winner!`);

    const newPlayerScore = scores[currentPlayer] + 1;
    const newScores = { ...scores };
    newScores[currentPlayer] = newPlayerScore;
    setScores(newScores);
    localStorage.setItem("scores", JSON.stringify(newScores));

    resetBoard();
  };

  const handleDraw = () => {
    window.alert("The game ended in a draw");

    resetBoard();
  };

  const checkForWinner = () => {
    let roundWon = false;
    for (let i = 0; i < WINNING_COMBOS.length; i++) {
      const winCombo = WINNING_COMBOS[i];

      let a = gameState[winCombo[0]];
      let b = gameState[winCombo[1]];
      let c = gameState[winCombo[2]];

      if ([a, b, c].includes("")) {
        continue;
      }

      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      setTimeout(() => handleWin(), 500);
      return;
    } else if (!gameState.includes("")) {
      setTimeout(() => handleDraw(), 500);
      return;
    }

    changePlayer();
  };

  const handleCellClick = (event: any) => {
    const cellIndex = Number(event.target.getAttribute("data-cell-index"));

    const currentValue = gameState[cellIndex];
    if (currentValue) {
      return;
    }

    const newValues = [...gameState];
    newValues[cellIndex] = currentPlayer;
    setGameState(newValues);
  };

  const storeScore = () => {
    window.localStorage.removeItem("scores");
  };

  return (
    <div className="h-full p-8 text-slate-800 bg-gradient-to-r from-cyan-500 to-blue-500">
      <h1 className="text-center text-5xl mb-4 font-display text-white">
        Tic Tac Toe Game Page
      </h1>
      <div>
        <div className="grid grid-cols-3 gap-3 mx-auto w-96">
          {gameState.map((player, index) => (
            <Square
              key={index}
              onClick={handleCellClick}
              {...{ index, player }}
            />
          ))}
        </div>
        <div className="mx-auto w-96 text-2xl text-center">
          <p className="text-white mt-5">
            Next Player : <span>{currentPlayer}</span>
          </p>
          <p className="text-white mt-5">
            Player X wins : <span>{scores["X"]}</span>
          </p>
          <p className="text-white mt-5">
            Player O wins : <span>{scores["O"]}</span>
          </p>
        </div>
        <div className="">
          <button onClick={() => storeScore()} className="bg-blue-300 to-slate-400 rounded-md p-2">
            <a href="/">Reset Score</a>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Game;
