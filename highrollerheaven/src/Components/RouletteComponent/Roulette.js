import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../RouletteComponent/Roulette.css";
import { useLocation } from "react-router-dom";

const Roulette = () => {
  const location = useLocation();
  const wheelRef = useRef();
  const [winningInfo, setWinningInfo] = useState({ number: null, color: null });
  const [isSpinning, setIsSpinning] = useState(false);
  const [ColorBetSize, setColorBetSize] = useState(0);
  const [NumberBetSize, setNumberBetSize] = useState(0);
  const [selectedColor, setSelectedColor] = useState("None");
  const [selectedNumber, setSelectedNumber] = useState("None");
  const [mongoData, setMongoData] = useState([]);
  const [user, setUser] = useState(null);
  const [currentWin, setCurrentWin] = useState(0);
  const [wheelRotationAngle, setWheelRotationAngle] = useState(0);

  const [gameStarted, setGameStarted] = useState(false);
  const europeanWheelNumbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
  ];

  // const europeanWheelNumbers = [
  //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // ];

  const numberColors = {
    0: "green",
    32: "red",
    15: "black",
    19: "red",
    4: "black",
    21: "red",
    2: "black",
    25: "red",
    17: "black",
    34: "red",
    6: "black",
    27: "red",
    13: "black",
    36: "red",
    11: "black",
    30: "red",
    8: "black",
    23: "red",
    10: "black",
    5: "red",
    24: "black",
    16: "red",
    33: "black",
    1: "red",
    20: "black",
    14: "red",
    31: "black",
    9: "red",
    22: "black",
    18: "red",
    29: "black",
    7: "red",
    28: "black",
    12: "red",
    35: "black",
    3: "red",
    26: "black",
  };
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
    if (location.state.userAccount) {
      const userId = location.state.userAccount;
      const foundUser = mongoData.find((user) => user._id === userId);
      setUser(foundUser);
    }
  }, [mongoData, location.state.userAccount]);

  const changeColorBetSize = (increment) => {
    const newColorBetSize = ColorBetSize + increment;
    if (newColorBetSize < 0) {
      alert("Bet Size Cannot Be Negative");
    } else if (newColorBetSize > user.balance) {
      alert("Cannot Bet More Than Balance");
    } else {
      setColorBetSize(newColorBetSize);
    }
  };

  const changeNumberBetSize = (increment) => {
    const newNumberBetSize = NumberBetSize + increment;
    if (newNumberBetSize < 0) {
      alert("Bet Size Cannot Be Negative");
    } else if (newNumberBetSize > user.balance) {
      alert("Cannot Bet More Than Balance");
    } else {
      setNumberBetSize(newNumberBetSize);
    }
  };

  const spinWheel = () => {
    setWinningInfo({ number: null, color: null });
    if (
      (selectedNumber === "" || selectedNumber === null) &&
      NumberBetSize > 0
    ) {
      alert(
        "You must choose a number or set the number bet amount to zero to spin the wheel."
      );
      return;
    }
    if (selectedNumber === null && NumberBetSize > 0) {
      alert(
        "You must choose a number or set the number bet amount to zero to spin the wheel."
      );
      return;
    }

    if (selectedColor === "None" && ColorBetSize > 0) {
      alert(
        "You must choose a color or set the color bet amount to zero to spin the wheel."
      );
      return;
    }
    if (ColorBetSize === 0 && NumberBetSize === 0) {
      alert(
        "You must increase bet size on either color or number bet to spin the wheel."
      );
      return;
    }
    if (ColorBetSize === 0) {
      setSelectedColor("None");
    }
    changeUserBalance((ColorBetSize + NumberBetSize) * -1);
    setIsSpinning(true);
    const spinToAngle = Math.floor(Math.random() * 360 + 720);
    setWheelRotationAngle(spinToAngle);
    const cssTransition = `transform 4s cubic-bezier(0.17, 0.67, 0.83, 0.67)`;

    if (wheelRef.current) {
      wheelRef.current.style.transition = cssTransition;
      wheelRef.current.style.transform = `rotate(${spinToAngle}deg)`;
    }
    setTimeout(() => {
      const finalAngle = spinToAngle % 360;
      const offset = 27;
      const sliceDegree = 360 / 37;
      let index = Math.floor((finalAngle + offset) / sliceDegree) % 37;
      index = (37 - index) % 37; // This gives the index in the European sequence

      const winningNumber = europeanWheelNumbers[index];
      const winningColor = numberColors[winningNumber];
      const winnings = calculateWinnings(winningNumber, winningColor);
      setCurrentWin(winnings); // Set the current winnings
      if (winnings > 0) {
        changeUserBalance(winnings - ColorBetSize - NumberBetSize);
      }
      setWinningInfo({ number: winningNumber, color: winningColor });
      if (wheelRef.current) {
        wheelRef.current.style.transition = "none";
        wheelRef.current.style.transform = `rotate(${finalAngle}deg)`;

        setIsSpinning(false);
      }
    }, 4000);
  };

  const calculateWinnings = (winningNumber, winningColor) => {
    let winnings = 0;

    // Calculate winnings for color bet
    if (winningColor === selectedColor) {
      winnings += ColorBetSize * 2;
    }

    // Calculate winnings for number bet
    if (selectedNumber !== null && winningNumber === parseInt(selectedNumber)) {
      winnings += NumberBetSize * 35;
    }
    return winnings;
  };

  const handleNumberChange = (event) => {
    const value = event.target.value;
    if (value === "" || (Number(value) >= 0 && Number(value) <= 36)) {
      setSelectedNumber(value);
    } else {
      alert("Please enter a number between 0 and 36");
    }
  };

  const changeUserBalance = async (changingAmount) => {
    const date = Date.now();

    console.log("THIS CHANGING AMOUNT" + changingAmount);

    const post = {
      content: `User balance has been refilled by ${changingAmount}`,
      amount: changingAmount,
      date: date,
    };

    const response = await axios.post(
      "http://localhost:3001/postCustomers/" + user._id,
      post
    );

    console.log("User balance has been refilled:", user.balance);
    if (response.status === 201) {
      setUser({
        ...user,
        balance: user.balance + Number(changingAmount),
        refillBalanceTime: user.refillBalanceTime,
      });
    }
  };

  const winningInfoStyle = {
    transform: `rotate(${-wheelRotationAngle}deg)`,
  };

  return (
    <>
      <h1 className="title1">High Roller Heaven</h1>
      <div className="rules">
        {!gameStarted && <h1>Welcome to Roullete!</h1>}
        {!gameStarted && <h2>Read rules before playing!</h2>}
        {!gameStarted && (
          <p className="prol">
            Roulette is a classic casino game played on a wheel marked with
            numbers from 0 to 3, alternating between red and black colors.
            Players bet on where a small ball will land after the wheel spins.
            Bets can be placed on specific numbers, groups of numbers, colors
            (red or black), odd or even numbers, or ranges. Once bets are
            placed, the dealer spins the wheel, and the ball is spun in the
            opposite direction. If the ball lands on a number or category a
            player bet on, they win according to the specific odds associated
            with their bet.
          </p>
        )}
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
      <div className="roulette-container">
        {gameStarted && (
          <>
            <div className="user-table-roulette">
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
            </div>
            <div className="betting-controls-container-color">
              Color Betting<br></br>Win 2x Your Bet!
              <div className="color-betting">
                <div className="selection-group-color">
                  <button
                    onClick={() => setSelectedColor("red")}
                    style={{ backgroundColor: "red" }}
                  >
                    Red
                  </button>
                  <button
                    onClick={() => setSelectedColor("black")}
                    style={{ backgroundColor: "black" }}
                  >
                    Black
                  </button>
                </div>
                <p>Selected Color: {selectedColor}</p>
                <div className="bet-size-selector-color">
                  <div className="bet-button-group">
                    <button onClick={() => changeColorBetSize(-10)}>-10</button>
                    <button onClick={() => changeColorBetSize(10)}>+10</button>
                  </div>
                  <div className="bet-button-group">
                    <button onClick={() => changeColorBetSize(-20)}>-20</button>
                    <button onClick={() => changeColorBetSize(20)}>+20</button>
                  </div>
                  <div className="bet-button-group">
                    <button onClick={() => changeColorBetSize(-50)}>-50</button>
                    <button onClick={() => changeColorBetSize(50)}>+50</button>
                  </div>
                  <div className="bet-button-group">
                    <button onClick={() => changeColorBetSize(-100)}>
                      -100
                    </button>
                    <button onClick={() => changeColorBetSize(100)}>
                      +100
                    </button>
                  </div>
                  <p>Color Bet Amount: ${ColorBetSize}</p>
                </div>
              </div>
            </div>

            <div className="betting-controls-container-number">
              Number Betting <br></br>Win 35x Your Bet!
              <div className="number-betting">
                <input
                  type="number"
                  placeholder="Enter a number (0-36)"
                  value={selectedNumber}
                  onChange={handleNumberChange}
                  className="number-input"
                />
                <p>Selected Number: {selectedNumber}</p>
                <div className="bet-size-selector-number">
                  <div className="bet-button-group">
                    <button onClick={() => changeNumberBetSize(-10)}>
                      -10
                    </button>
                    <button onClick={() => changeNumberBetSize(10)}>+10</button>
                  </div>
                  <div className="bet-button-group">
                    <button onClick={() => changeNumberBetSize(-20)}>
                      -20
                    </button>
                    <button onClick={() => changeNumberBetSize(20)}>+20</button>
                  </div>
                  <div className="bet-button-group">
                    <button onClick={() => changeNumberBetSize(-50)}>
                      -50
                    </button>
                    <button onClick={() => changeNumberBetSize(50)}>+50</button>
                  </div>
                  <div className="bet-button-group">
                    <button onClick={() => changeNumberBetSize(-100)}>
                      -100
                    </button>
                    <button onClick={() => changeNumberBetSize(100)}>
                      +100
                    </button>
                  </div>
                  <p>Number Bet Amount: ${NumberBetSize}</p>
                </div>
              </div>
            </div>

            <div className="wheel-and-arrow-container">
              <FontAwesomeIcon icon={faArrowRight} className="roulette-arrow" />
              <div className="roulette-wheel" ref={wheelRef}>
                {winningInfo.number !== null && (
                  <div
                    className={`winning-info ${winningInfo.color}`}
                    style={winningInfoStyle}
                  >
                    <p>Winning Number: {winningInfo.number}</p>
                    <p>Winning Color: {winningInfo.color}</p>
                    <p>Winnings: ${currentWin}</p>
                  </div>
                )}

                {europeanWheelNumbers.map((number, i) => (
                  <div
                    key={i}
                    className={`roulette-number ${numberColors[number]}`}
                    style={{ "--angle": `${i * (360 / 37)}deg` }}
                    data-number={number}
                  ></div>
                ))}
              </div>
            </div>

            <button
              className="spin-button"
              onClick={spinWheel}
              disabled={
                isSpinning ||
                (user &&
                  (ColorBetSize > user.balance || NumberBetSize > user.balance))
              }
            >
              Spin
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Roulette;
