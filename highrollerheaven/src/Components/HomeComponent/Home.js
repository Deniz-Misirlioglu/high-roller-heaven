import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../HomeComponent/Home.css";

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
    if (user) {
      const date = Date.now();
      setRefillBalanceTime(user.refillBalanceTime);
      console.log(user.refillBalanceTime);
      if (user.refillBalanceTime <= date - 1800000 && !isRefilled)
        setAllowedToRefill(true);
    }
  }, [user]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (user) {
        const refillTime = user.refillBalanceTime;
        const currentTime = Date.now();
        const timeRemaining = Math.max(0, 1800000 - (currentTime - refillTime));
        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = ((timeRemaining % 60000) / 1000).toFixed(0);

        setTimer(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
      }
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [user]);

  const refillUserBalance = async () => {
    console.log("Hello");
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
        "http://localhost:3001/postCustomers/" + user._id,
        post
      );

      if (response.status === 201) {
        setUser({ ...user, balance: user.balance + 50 });
        setAllowedToRefill(false);
      }
    } else {
      alert("Can only refill balance every 30 Minutes");
    }
  };

  return (
    <>
      <div className="home">
        <div className="vertical">
          <h1 className="title">High Roller Heaven</h1>
        </div>
        {user && (
          <>
            <div>Welcome {user.username + allowedToRefill}</div>
            <div>Your Current balance is {user.balance}</div>

            <button
              className={`button-85 ${
                !allowedToRefill ? "disabled-button" : ""
              }`}
              onClick={refillUserBalance}
              disabled={!allowedToRefill}
            >
              {allowedToRefill ? "Refill Balance" : timer + " To Refill"}
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
