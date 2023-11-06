import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthorizedUserContext from "../Authentication/AuthorizeUser";
import bcrypt from "bcryptjs";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "../SlotComponent/Slot.css";

const Slot = () => {
  const { setAuth } = useContext(AuthorizedUserContext);
  const navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  var userId = "";

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const getMongoData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/getCustomers");

      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const mongoData = await getMongoData();

      const foundUser = mongoData.find(
        (userName) => userName.username === user
      );
      console.log(pwd);
      if (foundUser) {
        const isMatch = await bcrypt.compare(pwd, foundUser.password);
        if (isMatch) {
          setAuth({ user, pwd });
          setUser("");
          setPwd("");
          setSuccess(true);
          const userId = foundUser._id;
          console.log(userId + "THIS IS USEER ID");
          navigate("/home", { replace: true, state: { userAccount: userId } });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return <>Test</>;
};

export default Slot;
