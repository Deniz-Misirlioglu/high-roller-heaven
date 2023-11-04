import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../HomeComponent/Home.css";

const Home = (props) => {
  const location = useLocation();

  const [mongoData, setMongoData] = useState([]);
  const [user, setUser] = useState(null);

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

  const refillUserBalance = async () => {
    console.log("User balance has been refilled:", user.balance);

    const post = {
      content: `User balance has been refilled to ${user.balance}`,
      amount: 50,
    };

    const response = await axios.post(
      "http://localhost:3001/postCustomers/" + user._id,
      post
    );

    if (response.status === 201) {
      setUser({ ...user, balance: user.balance + 50 });
    }
  };

  return (
    <>
      <div className="home">
        <h1>High Roller Heaven</h1>

        <button onClick={refillUserBalance}>Refill Balance</button>
        {user && (
          <>
            <div>Welcome {user.username}</div>
            <div>Your Current balance is {user.balance}</div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
