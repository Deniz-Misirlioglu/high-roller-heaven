import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthorizedUserContext from "../Authentication/AuthorizeUser";
import bcrypt from "bcryptjs";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "../RegisterComponent/Register";
const Home = (userId) => {
    var print = userId.userId;
  return (
    <>
      HelloWorld
      {{print}}
    </>
  );
};

export default Home;
