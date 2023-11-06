import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthorizedUserContext from "../Authentication/AuthorizeUser";
import bcrypt from "bcryptjs";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "../SlotComponent/Slot.css";

const symbols = ["🌠", "☁️", "🌟", "🌈"];

// You can make it even rarer by adding more instances of the other symbols:
const weightedSymbols = [
  "☁️",
  "☁️",
  "☁️",
  "☁️",
  "🌈",
  "🌈",
  "🌈",
  "🌟",
  "🌟",
  "🌠",
];

const getRandomSymbol = () =>
  weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)];

const Slot = () => {
  const [reels, setReels] = useState([
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
  ]);
  const [spinning, setSpinning] = useState([false, false, false]);
  const [winLines, setWinLines] = useState([]);
  const [winningSymbol, setWinningSymbol] = useState("");
  // Function to check for win lines
  const checkForWin = () => {
    // This function now relies on the current state of the reels
    setReels((currentReels) => {
      const newWinLines = [];

      for (let row = 0; row < 3; row++) {
        if (
          currentReels[0][row] === currentReels[1][row] &&
          currentReels[1][row] === currentReels[2][row]
        ) {
          // If all symbols in the row match, it's a win
          newWinLines.push(row);
          setWinningSymbol(currentReels[0][row]);
        }
      }

      setWinLines(newWinLines);
      return currentReels; // Return the reels without modification
    });
  };

  // Function to spin an individual reel
  const spinReel = (reelIndex) => {
    const intervalId = setInterval(() => {
      setReels((prevReels) => {
        const newReel = [
          getRandomSymbol(),
          ...prevReels[reelIndex].slice(0, -1),
        ];
        return [
          ...prevReels.slice(0, reelIndex),
          newReel,
          ...prevReels.slice(reelIndex + 1),
        ];
      });
    }, 80);

    // Store the intervalId to clear it later
    setTimeout(() => {
      clearInterval(intervalId);
      // After the last reel has stopped, check for wins
      if (reelIndex === reels.length - 1) {
        checkForWin();
      }
    }, 2000 + reelIndex * 1000);
  };

  // Function to start spinning all reels and reset win lines
  const spinReels = () => {
    setSpinning([true, true, true]);
    setWinLines([]);

    // Start spinning each reel
    reels.forEach((_, reelIndex) => {
      spinReel(reelIndex);
    });

    // Reset the spinning state after all reels have stopped
    setTimeout(() => {
      setSpinning([false, false, false]);
    }, 2000 + (reels.length - 1) * 1000);
  };

  const renderReel = (reel, index) => (
    <div
      key={index}
      className="reel"
      style={{ display: "flex", flexDirection: "column", margin: "0 4px" }}
    >
      {reel.map((symbol, idx) => (
        <div
          key={idx}
          // Add 'horizontal-win' class if this symbol is part of a win line
          className={`symbol ${winLines.includes(idx) ? "horizontal-win" : ""}`}
          style={{ padding: "10px", border: "1px solid #ccc", margin: "2px" }}
        >
          {symbol}
        </div>
      ))}
    </div>
  );

  return (
    <div className="slot-machine-container">
      <div className="slot-machine">
        <div className="reels-container">{reels.map(renderReel)}</div>
        <button onClick={spinReels} disabled={spinning.some((s) => s)}>
          {spinning.some((s) => s) ? "Spinning..." : "Spin"}
        </button>
      </div>
    </div>
  );
};

export default Slot;
