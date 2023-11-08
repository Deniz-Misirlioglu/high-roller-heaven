import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthorizedUserContext from "../Authentication/AuthorizeUser";
import bcrypt from "bcryptjs";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

const symbolMultipliers = {
  "☁️": 1,
  "🌈": 3,
  "🌟": 10,
  "🌠": 100,
};

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
  const [betSize, setBetSize] = useState(1); // default bet size of 1
  const [currentWin, setCurrentWin] = useState(0);
  const [winningSymbol, setWinningSymbol] = useState("");
  // Function to check for win lines
  const checkForWin = () => {
    // This function now relies on the current state of the reels
    setReels((currentReels) => {
      let newCurrentWin = 0;
      const newWinLines = [];

      for (let row = 0; row < 3; row++) {
        if (
          currentReels[0][row] === currentReels[1][row] &&
          currentReels[1][row] === currentReels[2][row]
        ) {
          // If all symbols in the row match, it's a win
          newWinLines.push(row);
          setWinningSymbol(currentReels[0][row]);
          const winMultiplier = symbolMultipliers[currentReels[0][row]];
          newCurrentWin += winMultiplier * betSize;
        }
      }
      setCurrentWin(newCurrentWin);
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
    <>
      <div className="slot-machine-container">
        <div className="slot-machine">
          <div className="reels-container">{reels.map(renderReel)}</div>
          <button onClick={spinReels} disabled={spinning.some((s) => s)}>
            {spinning.some((s) => s) ? "Spinning..." : "Spin"}
          </button>
        </div>
        <div className="win-display">
          {currentWin > 0 && (
            <div className="win-message">You won {currentWin}x your bet!</div>
          )}
        </div>
      </div>
      <div className="payout-table">
        <div className="payout-item">
          <span className="payout-symbol">☁️</span> 1x
        </div>
        <div className="payout-item">
          <span className="payout-symbol">🌈</span> 3x
        </div>
        <div className="payout-item">
          <span className="payout-symbol">🌟</span> 10x
        </div>
        <div className="payout-item">
          <span className="payout-symbol">🌠</span> 100x
        </div>
        <div className="win-information">
          <FontAwesomeIcon icon={faInfoCircle} /> Win by getting 3 symbols in a
          row
        </div>
      </div>
    </>
  );
};

export default Slot;
