import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthorizedUserContext from "../Authentication/AuthorizeUser";
import bcrypt from "bcryptjs";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import { useLocation } from "react-router-dom";

export const HiLo = () => {
    const suits = ["♠", "♣", "♥", "♦"];
    const ranks = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];

    const initialDeck = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        initialDeck.push({ suit, rank });
      }
    }

    const location = useLocation();

    const [deck, setDeck] = useState(initialDeck);

}