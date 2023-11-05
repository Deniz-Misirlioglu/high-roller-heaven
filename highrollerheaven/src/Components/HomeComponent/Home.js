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
      setRefillBalanceTime(user.refillBalanceTime);
    }
  }, [user]);

  const refillUserBalance = async () => {
    console.log(user.refillBalanceTime);
    const date = Date.now();
    if (user.refillBalanceTime <= date - 7200000 && !isRefilled) {
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
      }
    } else {
      alert("Can only refil Balance every 2 hours");
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
            <div>Welcome {user.username}</div>
            <div>Your Current balance is {user.balance}</div>
            <button className="button-85" onClick={refillUserBalance}>
              Refill Balance
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
