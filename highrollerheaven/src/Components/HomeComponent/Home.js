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
        console.log(user);
        if (userId === user._id) {
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
      <h1>High Roller Heaven</h1>
      <div>Welcome {user.username}</div>
      <div>Your Current balance is {user.balance}</div>
    </>
  );
};

export default Home;
