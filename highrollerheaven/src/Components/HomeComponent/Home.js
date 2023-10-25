import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthorizedUserContext from "../Authentication/AuthorizeUser";
import bcrypt from "bcryptjs";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Register from "../RegisterComponent/Register";

const Home = (props) => {
  const location = useLocation();
  console.log(location);
  return (
    <>
    </>
  );
};

export default Home;
