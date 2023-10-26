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
import Register from "../RegisterComponent/Register";

const Home = (props) => {
  const location = useLocation();
  console.log(location.state.userAccount);

  const [mongoData, setMongoData] = useState([]);

  useEffect(() => {
    // This code will run when the component mounts
    const getMongoData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getCustomers");
        console.log(response.data);
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

      console.log("got the mongo Data" + data);
      for (const user of data) {
        console.log("Hello");
        console.log(user);
        if (userId === user._id) {
          console.log(`Found user with ID ${userId}: ${user.name}`);
          return user.username;
        }
      }
      return [];
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div>{getUserData(location.state.userAccount)}</div>
    </>
  );
};

export default Home;
