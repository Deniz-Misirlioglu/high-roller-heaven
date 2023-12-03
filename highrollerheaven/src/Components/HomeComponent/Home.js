import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../HomeComponent/Home.css";
import blackjack from "../../blackjack.png";
import hilo from "../../hilo.png";
import roulette from "../../roulette.png";
import slotmachine from "../../slot-machine.png";

const Home = (props) => {
  const location = useLocation();

  const [mongoData, setMongoData] = useState([]);
  const [user, setUser] = useState(null);
  const [refillBalanceTime, setRefillBalanceTime] = useState(0);
  const [isRefilled, setIsRefilled] = useState(false);
  const [allowedToRefill, setAllowedToRefill] = useState(false);
  const [timer, setTimer] = useState("00:00");

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

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (user) {
        const date = Date.now();
        const refillTime = user.refillBalanceTime;
        console.log(user.refillBalanceTime);
        const currentTime = Date.now();
        const timeRemaining = Math.max(0, 1800000 - (currentTime - refillTime));
        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = ((timeRemaining % 60000) / 1000).toFixed(0);

        setTimer(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
        if (timeRemaining === 0) {
          setAllowedToRefill(true);
          setIsRefilled(false);
        }
      }
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [user]);

  const refillUserBalance = async () => {
    const date = Date.now();
    if (user.refillBalanceTime <= date - 1800000 && !isRefilled) {
      setIsRefilled(true);
      console.log("DATE" + date);
      console.log("User balance has been refilled:", user.balance);

      const post = {
        content: `User balance has been refilled to ${user.balance}`,
        amount: 50,
        date: date,
      };

      const response = await axios.post(
        "http://localhost:3001/postCustomers/changeBalance/" + user._id,
        post
      );

      if (response.status === 201) {
        setUser({
          ...user,
          balance: user.balance + 50,
          refillBalanceTime: date, // Update the user's refillBalanceTime
        });
        setAllowedToRefill(false);
      }
    } else {
      alert("Can only refill balance every 30 Minutes");
    }
  };

  return (
    <>
      <h1 className="title1"></h1>
      <div className="home">
        <div className="vertical"></div>
        {user && (
          <>
            <div className="balance">
              Balance: {user.balance}
              <br></br>
              <button
                className={`button-85 ${
                  !allowedToRefill ? "disabled-button" : ""
                }`}
                onClick={refillUserBalance}
                disabled={!allowedToRefill}
              >
                {allowedToRefill ? "Refill Balance" : timer + " To Refill"}
              </button>
            </div>
          </>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", margin: "10px" }}>
          <p>Slot Machine</p>
          <img
            src={slotmachine}
            alt="SlotMachine Image"
            className="slotmachine"
          />
        </div>

        <div style={{ textAlign: "center", margin: "10px" }}>
          <p>Blackjack</p>
          <img
            src={blackjack}
            alt="Blackjack Image"
            className="blackjackGame"
          />
        </div>

        <div style={{ textAlign: "center", margin: "10px" }}>
          <p>Roulette</p>
          <img src={roulette} alt="Roulette Image" className="roulette" />
        </div>

        <div style={{ textAlign: "center", margin: "10px" }}>
          <p>HiLo</p>
          <img src={hilo} alt="HiLo Image" className="hilo" />
        </div>
      </div>
    </>
  );
};

export default Home;
