import { useRef, useState, useEffect, useContext } from "react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../RouletteComponent/Roulette.css";

const Roulette = () => {
  const wheelRef = useRef();
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningInfo, setWinningInfo] = useState({ number: null, color: null });

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

      <button onClick={spinWheel} className="spin-button" disabled={isSpinning}>
        Spin Wheel
      </button>
    </div>
  );
};

export default Roulette;
