import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthorizedUserContext from "../Authentication/AuthorizeUser";
import bcrypt from "bcryptjs";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import "../HomeComponent/Home.css";

const Home = (props) => {
  const location = useLocation();

  const [mongoData, setMongoData] = useState([]);

  useEffect(() => {
    // This code will run when the component mounts
    const getMongoData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getCustomers");
        setMongoData(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getMongoData();
  }, []); // The empty dependency array ensures this effect runs once

  const getUserData = (userId) => {
    try {
      const data = mongoData;
      for (const user of data) {
        if (userId === user._id) {
          console.log(user);
          return user;
        }
      }
      return [];
    } catch (err) {
      console.log(err);
    }
  };

  const user = getUserData(location.state.userAccount);

  return (
    <>
      <div className="home">
      <h1>High Roller Heaven</h1>
      <div>Welcome {user.username}</div>
      <div>Your Current balance is {user.balance}</div>
      </div>
    </>
  );
};

export default Home;
