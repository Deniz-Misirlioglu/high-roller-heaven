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
  const [spinning, setSpinning] = useState([false, false, false]);

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
    setSpinning([true, true, true]);
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
      setSpinning([false, false, false]);
      // Reset transition for next spin
      if (wheelRef.current) {
        wheelRef.current.style.transition = "none";
        // This will reset the wheel for the next spin without affecting the current spin result
        wheelRef.current.style.transform = `rotate(${finalAngle}deg)`;

        setIsSpinning(false);
      }
    }, 4000); // Should match the duration of the CSS transition
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
      <div className="betting-controls-container">
        <div className="bet-size-selector">
          {/* Bet size buttons */}
          <button onClick={() => setBetSize((prev) => Math.max(0, prev - 10))}>
            -10
          </button>
          <button onClick={() => setBetSize((prev) => prev + 10)}>+10</button>
          <p>Bet Size: {betSize}</p>
        </div>

        <div className="color-selector">
          <div className="entireNumberContainer">
            Hello
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
                  if (betSize + 10 <= user.balance) setBetSize(betSize + 10);
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
                  if (betSize + 20 <= user.balance) setBetSize(betSize + 20);
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
                  if (betSize + 50 <= user.balance) setBetSize(betSize + 50);
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
                  if (betSize + 100 <= user.balance) setBetSize(betSize + 100);
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
          {/* Color selection buttons */}
          <button onClick={() => setSelectedColor("red")}>Red</button>
          <button onClick={() => setSelectedColor("black")}>Black</button>
          <button onClick={() => setSelectedColor("green")}>Green</button>
          <p>Selected Color: {selectedColor}</p>
        </div>

        <div className="number-selector">
          {/* Number selection input */}
          <input
            type="number"
            value={selectedNumber}
            onChange={(e) => setSelectedNumber(e.target.value)}
          />
          <p>Selected Number: {selectedNumber}</p>
        </div>
      </div>

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

      {winningInfo.number !== null && (
        <div className={`winning-info ${winningInfo.color}`}>
          <p>Winning Number: {winningInfo.number}</p>
          <p>Color: {winningInfo.color}</p>
        </div>
      )}

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
