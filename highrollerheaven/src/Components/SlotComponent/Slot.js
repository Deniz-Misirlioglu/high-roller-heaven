import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../SlotComponent/Slot.css";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();

  const [spinning, setSpinning] = useState([false, false, false]);
  const [winLines, setWinLines] = useState([]);
  const [currentWin, setCurrentWin] = useState(0);
  const [betSize, setBetSize] = useState(0);
  const [winningSymbol, setWinningSymbol] = useState("");
  const [user, setUser] = useState("");
  const [mongoData, setMongoData] = useState([]);
  const [justWon, setJustWon] = useState(false);

  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const getMongoData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getCustomers");
        setMongoData(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getMongoData();
  }, []);

  useEffect(() => {
    if (currentWin > 0) {
      changeUserBalance(currentWin * betSize);
      setJustWon(true);
    }
  }, [currentWin]);

  useEffect(() => {
    if (location.state.userAccount) {
      const userId = location.state.userAccount;
      const foundUser = mongoData.find((user) => user._id === userId);
      setUser(foundUser);
    }
  }, [mongoData, location.state.userAccount]);

  const [reels, setReels] = useState([
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
  ]);

  const checkForWin = () => {
    setReels((currentReels) => {
      let newCurrentWin = 0;
      const newWinLines = [];

      for (let row = 0; row < 3; row++) {
        if (
          currentReels[0][row] === currentReels[1][row] &&
          currentReels[1][row] === currentReels[2][row]
        ) {
          newWinLines.push(row);
          setWinningSymbol(currentReels[0][row]);
          const winMultiplier = symbolMultipliers[currentReels[0][row]];
          newCurrentWin += winMultiplier;
        }
      }
      setCurrentWin(newCurrentWin);
      setWinLines(newWinLines);

      return currentReels;
    });
  };

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

    setTimeout(() => {
      clearInterval(intervalId);
      if (reelIndex === reels.length - 1) {
        //checkForWin();
      }
    }, 2000 + reelIndex * 1000);
  };

  const spinReels = async () => {
    setJustWon(false);
    changeUserBalance(betSize * -1);
    setSpinning([true, true, true]);
    setWinLines([]);

    reels.forEach((_, reelIndex) => {
      spinReel(reelIndex);
    });

    setTimeout(() => {
      setSpinning([false, false, false]);

      checkForWin();
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
          className={`symbol ${winLines.includes(idx) ? "horizontal-win" : ""}`}
          style={{ padding: "10px", border: "1px solid #ccc", margin: "2px" }}
        >
          {symbol}
        </div>
      ))}
    </div>
  );

  const changeUserBalance = async (changingAmount) => {
    const date = Date.now();

    const post = {
      content: `User balance has been refilled by ${changingAmount}`,
      amount: changingAmount,
      date: date,
    };

    const response = await axios.post(
      "http://localhost:3001/postCustomers/" + user._id,
      post
    );

    if (response.status === 201) {
      setUser({
        ...user,
        balance: user.balance + Number(changingAmount),
        refillBalanceTime: user.refillBalanceTime,
      });
    }
  };

  return (
    <>
      <h1 className="title1">High Roller Heaven</h1>
      <div className="rules">
        {!gameStarted && <h1>Welcome to Slots!</h1>}
        {!gameStarted && <h2>Read rules before playing!</h2>}
        {!gameStarted && <p>Must score 3 in a row horizontally to win</p>}
        {!gameStarted && (
          <button
            onClick={() => {
              setGameStarted(true);
            }}
          >
            Start Game!
          </button>
        )}
      </div>
      {gameStarted && (
        <>
          <div className="slot-machine-container">
            <div className="slot-machine">
              <div className="reels-container">{reels.map(renderReel)}</div>
              <div className="entireNumberContainer">
                <div className="number-container1">
                  <button
                    disabled={spinning.some((s) => s)}
                    className="number plus1"
                    onClick={() => {
                      if (betSize - 10 < 0) {
                        alert("Bet Size Cannot Be Negative");
                      } else {
                        setBetSize(betSize - 10);
                      }
                    }}
                  >
                    -
                  </button>
                  10
                  <button
                    disabled={spinning.some((s) => s)}
                    className="number minus1"
                    onClick={() => {
                      if (betSize + 10 <= user.balance)
                        setBetSize(betSize + 10);
                      else {
                        alert("Cannot Bet more than Balance");
                      }
                    }}
                  >
                    +
                  </button>
                </div>
                <div className="number-container2">
                  <button
                    disabled={spinning.some((s) => s)}
                    className="number plus2"
                    onClick={() => {
                      if (betSize - 20 < 0) {
                        alert("Bet Size Cannot Be Negative");
                      } else {
                        setBetSize(betSize - 20);
                      }
                    }}
                  >
                    -
                  </button>
                  20
                  <button
                    disabled={spinning.some((s) => s)}
                    className="number minus2"
                    onClick={() => {
                      if (betSize + 20 <= user.balance)
                        setBetSize(betSize + 20);
                      else {
                        alert("Cannot Bet more than Balance");
                      }
                    }}
                  >
                    +
                  </button>
                </div>
                <div className="number-container3">
                  <button
                    disabled={spinning.some((s) => s)}
                    className="number plus3"
                    onClick={() => {
                      if (betSize - 50 < 0) {
                        alert("Bet Size Cannot Be Negative");
                      } else {
                        setBetSize(betSize - 50);
                      }
                    }}
                  >
                    -
                  </button>
                  50
                  <button
                    disabled={spinning.some((s) => s)}
                    className="number minus3"
                    onClick={() => {
                      if (betSize + 50 <= user.balance)
                        setBetSize(betSize + 50);
                      else {
                        alert("Cannot Bet more than Balance");
                      }
                    }}
                  >
                    +
                  </button>
                </div>
                <div className="number-container4">
                  <button
                    disabled={spinning.some((s) => s)}
                    className="number plus4"
                    onClick={() => {
                      if (betSize - 100 < 0) {
                        alert("Bet Size Cannot Be Negative");
                      } else {
                        setBetSize(betSize - 100);
                      }
                    }}
                  >
                    -
                  </button>
                  100
                  <button
                    disabled={spinning.some((s) => s)}
                    className="number minus3"
                    onClick={() => {
                      if (betSize + 100 <= user.balance)
                        setBetSize(betSize + 100);
                      else {
                        alert("Cannot Bet more than Balance");
                      }
                    }}
                  >
                    +
                  </button>
                  <div className="bet-amount">Bet Amount: {betSize}</div>
                </div>
              </div>
              {user && (
                <button
                  onClick={spinReels}
                  disabled={spinning.some((s) => s) || betSize > user.balance}
                >
                  {spinning.some((s) => s) ? "Spinning..." : "Spin"}
                </button>
              )}
            </div>
            <div className="win-display">
              {justWon > 0 && (
                <div className="win-message">
                  You won {currentWin}x your bet!
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {gameStarted && (
        <>
          <div className="user-table">
            <div>
              {user && (
                <>
                  <div>
                    <u>{user.username}</u>
                  </div>
                  <div>
                    Your Current balance is {user.balance}{" "}
                    <p>Adjust your bet with +/-</p>
                  </div>
                </>
              )}
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
                <FontAwesomeIcon icon={faInfoCircle} /> Win by getting 3 symbols
                in a row
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Slot;
