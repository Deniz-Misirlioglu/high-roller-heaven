import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthorizedUserContext from "../Authentication/AuthorizeUser";
import bcrypt from "bcryptjs";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";import Card from "../BlackjackComponent/Card";
import "./HiLo.css";
import { useLocation } from "react-router-dom";

const HiLo = () => {

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

  const [user, setUser] = useState("");
  const [mongoData, setMongoData] = useState([]);

  const [gameStarted, setGameStarted] = useState(false);
  const [currentCard, setCurrentCard] = useState([]);
  const [deck, setDeck] = useState([...initialDeck]);
  
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(0);
  const [typedBet, setTypedBet] = useState(0);

  const [lowOdds, setLowOdds] = useState(1);
  const [highOdds, setHighOdds] = useState(1);

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
      setBalance(user.balance);
    }
  }, [user]);

  const changeUserBalance = async (changingAmount) => {
    const date = Date.now();

    console.log("THIS CHANGING AMOUNT" + changingAmount);

    const post = {
      content: `User balance has been refilled by ${changingAmount}`,
      amount: changingAmount,
      date: date,
    };

    const response = await axios.post(
      "http://localhost:3001/postCustomers/" + user._id,
      post
    );

    console.log("User balance has been refilled:", user.balance);
    if (response.status === 201) {
      setUser({
        ...user,
        balance: user.balance + Number(changingAmount),
        refillBalanceTime: user.refillBalanceTime,
      });
    }
  };

  function shuffleDeck(array) {
    let len = array.length,
      currentIndex;
    for (currentIndex = len - 1; currentIndex > 0; currentIndex--) {
      let randIndex = Math.floor(Math.random() * (currentIndex + 1));
      var temp = array[currentIndex];
      array[currentIndex] = array[randIndex];
      array[randIndex] = temp;
    }
    return array;
  }

  // Draws next card, checks if the high bet successful, sets that drawn card to currentCard
  // Returns if bet successful.  
  const processHighBet = () => {
    var newCard = deck.pop();
    changeUserBalance(-1 * bet);

    // Result is if the rank is higher in the next card
    var result = (ranks.indexOf(currentCard.rank) < ranks.indexOf(newCard.rank)) 
      ? true : false;

    drawCard(newCard);
    if (result) {
      changeUserBalance(Math.floor((highOdds - 1) * bet));
    }
    setBet(0);
  }

  // Draws next card, checks if the low bet successful, sets that drawn card to currentCard
  // Returns if bet successful.
  const processLowBet = () => {
    var newCard = deck.pop();
    changeUserBalance(-1 * bet);

    // Result is if the rank is lower in the next card
    var result = (ranks.indexOf(currentCard.rank) > ranks.indexOf(newCard.rank)) 
      ? true : false;

    // Set current card to the one we drew.
    drawCard(newCard);
    if (result) {
      changeUserBalance(Math.floor((lowOdds - 1) * bet));
    }
    setBet(0);
  }

  const processTieBet = () => {
    var newCard = deck.pop();
    changeUserBalance(-1 * bet);

    // Result is if the rank is the same in the next card
    var result = (ranks.indexOf(currentCard.rank) === ranks.indexOf(newCard.rank)) 
      ? true : false;

    // Set current card to the one we drew.
    drawCard(newCard);
    if (result) {
      changeUserBalance(Math.floor((tieOdds - 1) * bet));
    }
    setBet(0);
  }

  // All of the possible odds
  const AllLoOdds = [12.0, 5.0, 3.0, 3.0, 2.0, 1.8, 1.5, 1.4, 1.3, 1.2, 1.1, 1.0];
  const AllHiOdds = [1.0, 1.1, 1.2, 1.4, 1.4, 1.5, 1.8, 2.0, 3.0, 4.0, 5.0, 12.0];
  const tieOdds = 12.5;

  // Draws a card, assigns betting odds based on the card.
  const drawCard = (card = deck.pop()) => {
    // Set our card to be the one we drew
    setCurrentCard(card);
    // Set our odds accordingly
    setLowOdds(AllLoOdds[ranks.indexOf(card.rank) - 1]);
    setHighOdds(AllHiOdds[ranks.indexOf(card.rank)]);

    // If we've drawn more than half the cards, reshuffle
    if (deck.length <= 26) {
      setDeck(shuffleDeck([...initialDeck]));
    }
  }

  // Initializes the game by making the game board, shuffling the deck, drawing first card
  const startGame = () => {
    setGameStarted(true);
    shuffleDeck(deck);
    drawCard();
  }

  // Handles altering bets with buttons/input
  const alterBet = (size, set = false) => {
    // We need to know if the 
    if (size < 0) {
      if (bet - size < 0) {
        alert("Bet can't be negative.")
      } else {
        set ? alert("Bet can't be negative.") : setBet(bet + size);
      }
    } else {
      if (bet + size > balance) {
        alert("Your balance isn't high enough.")
      } else {
        set ? setBet(size) : setBet(bet + size);
      }
    }
  }

    return (
      <div className="page">
        <div className="rules">
          {!gameStarted ? <h1>Welcome to Hi-Lo!</h1> : <h1>Hi-Lo</h1>}
          {!gameStarted && <h2>Read rules before playing!</h2>}
          {!gameStarted && <p>
            Playing Hi-Lo is very simple; as the player, you 
            need to bet on whether the next card to be drawn from 
            the deck will be higher or lower than the current card. 
            You can also bet on the card being the same value as the current card – 
            which is known as a tie. Aces are high. The odds, the amount your bet
            will be multiplied by on winning, is displayed on the button. Cards previously
            seen will be reshuffled into the deck when half of cards are left.
          </p>}
          {!gameStarted && <button onClick={() => {startGame()}}>Start Game!</button>}
        </div>
        {gameStarted && (
          <div className="game">
            <Card suit={currentCard.suit} rank={currentCard.rank} />
            {/* TODO: Display balance, current bet */}
            <div className="choice">
              {/* If you have an ace, can't bet high */}
              {ranks.indexOf(currentCard.rank) !== 12 && 
                <button onClick={() => {processHighBet()}} className="hiButton">
                  HIGHER <br></br>
                  {highOdds}x
                </button>
              }
              <button onClick={() => {processTieBet()}} className="tieButton">
                TIE <br></br>
                {tieOdds}x
              </button>
              {/* If its the lowest card, we won't let you bet low. */}
              {ranks.indexOf(currentCard.rank) !== 0 && 
                <button onClick={() => {processLowBet()}} className="loButton">
                  LOWER <br></br>
                  {lowOdds}x
                </button>
              } 
            </div>
            <div className="betting">
              <h3>Place your bet!</h3>
              <h3>Your balance: {balance}</h3>
              <h3>Current Bet: {bet}</h3>
              <label>Custom Bet: </label>
              <input onChange={(e) => {setTypedBet(parseInt(e.target.value))}}></input>
              <button onClick={() => {(!isNaN(typedBet)) && alterBet(typedBet, true)}}>SET</button>
              <br></br>
              <button onClick={() => {alterBet(10)}}>+10</button>
              <button onClick={() => {alterBet(50)}}>+50</button>
              <button onClick={() => {alterBet(100)}}>+100</button>
              <button onClick={() => {alterBet(250)}}>+250</button>
              <br></br>
              <button onClick={() => {alterBet(-10)}}>-10</button>
              <button onClick={() => {alterBet(-50)}}>-50</button>
              <button onClick={() => {alterBet(-100)}}>-100</button>
              <button onClick={() => {alterBet(-250)}}>-250</button>
            </div>
          </div>
        )}
      </div>
    );
}

export default HiLo;