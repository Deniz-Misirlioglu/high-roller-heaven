import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../RouletteComponent/Roulette.css";

const Roulette = () => {
  const wheelRef = useRef();
  const [winningInfo, setWinningInfo] = useState({ number: null, color: null });
  const [isSpinning, setIsSpinning] = useState(false);
  const [betSize, setBetSize] = useState(10);
  const [selectedColor, setSelectedColor] = useState(null); // 'red', 'black', 'green'
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [user, setUser] = useState("");

  const changeBetSize = (increment) => {
    const newBetSize = betSize + increment;
    if (newBetSize < 0) {
      alert("Bet Size Cannot Be Negative");
    } else if (newBetSize > user.balance) {
      alert("Cannot Bet More Than Balance");
    } else {
      setBetSize(newBetSize);
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getCustomers");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const spinWheel = () => {
    setIsSpinning(true); // Disable the button
    const spinToAngle = Math.floor(Math.random() * 360 + 720); // This ensures at least two full spins
    const cssTransition = `transform 4s cubic-bezier(0.17, 0.67, 0.83, 0.67)`;

    if (wheelRef.current) {
      wheelRef.current.style.transition = cssTransition;
      wheelRef.current.style.transform = `rotate(${spinToAngle}deg)`;
    }
    setTimeout(() => {
      const finalAngle = spinToAngle % 360;
      // 28 is close
      const offset = 27; // We want the number at the far left, which is at 270 degrees on the wheel
      const sliceDegree = 360 / 37;
      // Calculate the index of the number at the 270-degree position
      let numberIndex = Math.floor((finalAngle + offset) / sliceDegree) % 37;
      // Adjust for the array index starting at 0
      numberIndex = (37 - numberIndex) % 37;
      setSelectedNumber(numberIndex);

      const winningNumber = numberIndex; // Assuming numberIndex is your winning number
      const winningColor = colors[winningNumber]; // Get the color from your colors array
      setWinningInfo({ number: winningNumber, color: winningColor });
      if (wheelRef.current) {
        wheelRef.current.style.transition = "none";
        // This will reset the wheel for the next spin without affecting the current spin result
        wheelRef.current.style.transform = `rotate(${finalAngle}deg)`;

        setIsSpinning(false);
      }
    }, 4000); // Should match the duration of the CSS transition
  };

  const handleNumberChange = (event) => {
    const value = event.target.value;
    if (value === "" || (Number(value) >= 0 && Number(value) <= 36)) {
      setSelectedNumber(value);
    } else {
      alert("Please enter a number between 0 and 36");
    }
  };

  const colors = [
    "green",
    "red",
    "black",
    "red",
    "black",
    "red",
    "black",
    "red",
    "black",
    "red",
    "black",
    "black",
    "red",
    "black",
    "red",
    "black",
    "red",
    "black",
    "red",
    "red",
    "black",
    "red",
    "black",
    "red",
    "black",
    "red",
    "black",
    "red",
    "black",
    "black",
    "red",
    "black",
    "red",
    "black",
    "red",
    "black",
    "red",
  ];
  return (
    <div className="roulette-container">
      {/* Color Betting Controls Container */}
      <div className="betting-controls-container-color">
        Color Betting
        {/* Color Betting */}
        <div className="color-betting">
          <button onClick={() => setSelectedColor("red")}>Red</button>
          <button onClick={() => setSelectedColor("black")}>Black</button>
          <button onClick={() => setSelectedColor("green")}>Green</button>
          <p>Selected Color: {selectedColor}</p>
          <div className="bet-size-selector-color">
            <div className="bet-button-group">
              <button onClick={() => changeBetSize(-10)}>-10</button>
              <button onClick={() => changeBetSize(10)}>+10</button>
            </div>
            <div className="bet-button-group">
              <button onClick={() => changeBetSize(-20)}>-20</button>
              <button onClick={() => changeBetSize(20)}>+20</button>
            </div>
            <div className="bet-button-group">
              <button onClick={() => changeBetSize(-50)}>-50</button>
              <button onClick={() => changeBetSize(50)}>+50</button>
            </div>
            <div className="bet-button-group">
              <button onClick={() => changeBetSize(-100)}>-100</button>
              <button onClick={() => changeBetSize(100)}>+100</button>
            </div>
            <p>Bet Size: {betSize}</p>
          </div>
        </div>
      </div>

      {/* Number Betting Controls Container */}
      <div className="betting-controls-container-number">
        Number Betting
        {/* Number Betting */}
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
              <button onClick={() => changeBetSize(-10)}>-10</button>
              <button onClick={() => changeBetSize(10)}>+10</button>
            </div>
            <div className="bet-button-group">
              <button onClick={() => changeBetSize(-20)}>-20</button>
              <button onClick={() => changeBetSize(20)}>+20</button>
            </div>
            <div className="bet-button-group">
              <button onClick={() => changeBetSize(-50)}>-50</button>
              <button onClick={() => changeBetSize(50)}>+50</button>
            </div>
            <div className="bet-button-group">
              <button onClick={() => changeBetSize(-100)}>-100</button>
              <button onClick={() => changeBetSize(100)}>+100</button>
            </div>
            <p>Bet Size: {betSize}</p>
          </div>
        </div>
      </div>

      {/* Wheel and Arrow Container */}
      <div className="wheel-and-arrow-container">
        <FontAwesomeIcon icon={faArrowRight} className="roulette-arrow" />
        <div className="roulette-wheel" ref={wheelRef}>
          {[...Array(37)].map((_, i) => (
            <div
              key={i}
              className={`roulette-number ${colors[i]}`}
              style={{ "--angle": `${i * (360 / 37)}deg` }}
              data-number={i}
            ></div>
          ))}
        </div>
      </div>

      {/* Winning Info Display */}
      {winningInfo.number !== null && (
        <div className={`winning-info ${winningInfo.color}`}>
          <p>Winning Number: {winningInfo.number}</p>
          <p>Color: {winningInfo.color}</p>
        </div>
      )}

      {/* Spin Button */}
      <button
        onClick={spinWheel}
        disabled={isSpinning || betSize > user.balance}
      >
        Spin
      </button>
    </div>
  );
};

export default Roulette;
