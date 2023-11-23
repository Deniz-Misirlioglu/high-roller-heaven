import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthorizedUserContext from "../Authentication/AuthorizeUser";
import bcrypt from "bcryptjs";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import { useLocation } from "react-router-dom";

import "../BlackjackComponent/Blackjack.css";

const Blackjack = () => {
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
  const location = useLocation();
  const initialDeck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      initialDeck.push({ suit, rank });
    }
  }

  const [deck, setDeck] = useState(initialDeck);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState("");
  const [betAmount, setBetAmount] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [user, setUser] = useState("");
  const [mongoData, setMongoData] = useState([]);
  const [cardsDealt, setCardsDealt] = useState(false);
  const [secondCardFace, setSecondCardFace] = useState(0);
  const [onlyFirstCard, setOnlyFirstCart] = useState(true);
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
      setTotalBalance(user.balance);
    }
  }, [user]);

  const placeBet = (amount) => {
    setBetAmount(0);
    if (!gameOver) {
      if (totalBalance >= amount) {
        setBetAmount(amount);
      } else {
        alert("Insufficient balance to place the bet.");
      }
    } else {
      setBetAmount(0);
      setGameOver(false);
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

  const deal = () => {
    if (betAmount === 0) {
      alert("Player must bet money to play.");
      return;
    }

    // Reset necessary game states for a new round
    setPlayerHand([]);
    setDealerHand([]);
    setGameResult("");
    setGameOver(false);
    setCardsDealt(true);
    setOnlyFirstCart(true);
    const shuffledDeck = shuffleDeck(initialDeck);

    const playerInitialHand = [shuffledDeck.pop(), shuffledDeck.pop()];
    const dealerInitialHand = [
      { ...shuffledDeck.pop(), faceDown: true }, // Face down for dealer
      shuffledDeck.pop(), // Face up for dealer
    ];

    const secondCard = dealerInitialHand.find((card, index) => index === 1);
    const secondCardRank = secondCard ? secondCard.rank : 0;
    setSecondCardFace(secondCardRank);

    setPlayerHand(playerInitialHand);

    setDealerHand(dealerInitialHand);
    setDeck(shuffledDeck);

    changeUserBalance(betAmount * -1);

    if (calculateHandValue(playerInitialHand) === 21) {
      const result = "Player wins with Blackjack!";
      setOnlyFirstCart(false);
      changeUserBalance(betAmount * 2.5);
      setGameResult(result);
      setGameOver(true);
      setCardsDealt(false);
      return;
    }
    if (calculateHandValue(dealerInitialHand) === 21) {
      const result = "Dealer wins with Blackjack!";
      setOnlyFirstCart(false);
      setGameResult(result);
      setGameOver(true);
      setCardsDealt(false);
      return;
    }

    setCardsDealt(true);
  };

  const hit = () => {
    if (gameOver || betAmount === 0) {
      alert("Game hasn't started");
      return;
    }
    const newDeck = [...deck];
    const newPlayerHand = [...playerHand];

    newPlayerHand.push(newDeck.pop());

    setDeck(newDeck);
    setPlayerHand(newPlayerHand);

    if (calculateHandValue(newPlayerHand) > 21) {
      const result = "Dealer Wins";
      setTotalBalance(totalBalance - betAmount);
      setGameResult(result);
      setGameOver(true);
      setCardsDealt(false);
    }
    if (calculateHandValue(newPlayerHand) === 21) {
      const result = "Player Wins";
      setTotalBalance(totalBalance - betAmount);
      setGameResult(result);
      changeUserBalance(betAmount * 2);
      setGameOver(true);
      setCardsDealt(false);
    }
  };

  const stand = () => {
    setOnlyFirstCart(false);
    if (gameOver || betAmount === 0) {
      alert("Game hasn't started");
      return;
    }
    const dealerHandCopy = [...dealerHand];
    while (calculateHandValue(dealerHandCopy) <= 17) {
      const card = deck.pop();
      dealerHandCopy.push(card);
    }

    if (calculateHandValue(dealerHandCopy) < calculateHandValue(playerHand)) {
      const card = deck.pop();
      dealerHandCopy.push(card);
    }
    setDealerHand(dealerHandCopy);

    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHandCopy);

    let result, winnings;
    if (dealerValue > 21 || (playerValue <= 21 && playerValue > dealerValue)) {
      result = "Player wins!";
      winnings = 2 * betAmount;
      changeUserBalance(betAmount * 2);
    } else if (playerValue === 21) {
      result = "Player wins!";
      winnings = 2.5 * betAmount;
    } else if (playerValue === dealerValue) {
      result = "It's a tie!";
      winnings = 0;
    } else {
      result = "Dealer wins!";
      winnings = -betAmount;
    }

    setTotalBalance(totalBalance + winnings);
    setGameResult(result);
    setBetAmount(0);
    setGameOver(true);
    setCardsDealt(false);
  };

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

  const calculateHandValue = (hand) => {
    let value = 0;
    let aceCount = 0;

    for (const card of hand) {
      const rank = card.rank;
      if (rank === "A") {
        aceCount++;
        value += 11;
      } else if (["K", "Q", "J"].includes(rank)) {
        value += 10;
      } else {
        value += parseInt(rank);
      }
    }

    while (aceCount > 0 && value > 21) {
      value -= 10;
      aceCount--;
    }

    return value;
  };

  return (
    <div className="blackjack">
      {user && (
        <div>

          <h1 className="title1">High Roller Heaven</h1>
          <div className="bet-button-container">
            <div className="">
              <button
                className="bet-button"
                onClick={() => {
                  if (betAmount - 10 < 0) {
                    alert("Bet Size Cannot Be Negative");
                  } else {
                    setBetAmount(betAmount - 10);
                  }
                }}
              >
                -
              </button>
              10
              <button
                className="bet-button"
                onClick={() => {
                  if (betAmount + 10 <= user.balance)
                    setBetAmount(betAmount + 10);
                  else {
                    alert("Cannot Bet more than Balance");
                  }
                }}
              >
                +
              </button>
            </div>
            <div className="">
              <button
                className="bet-button"
                onClick={() => {
                  if (betAmount - 20 < 0) {
                    alert("Bet Size Cannot Be Negative");
                  } else {
                    setBetAmount(betAmount - 20);
                  }
                }}
              >
                -
              </button>
              20
              <button
                className="bet-button"
                onClick={() => {
                  if (betAmount + 20 <= user.balance)
                    setBetAmount(betAmount + 20);
                  else {
                    alert("Cannot Bet more than Balance");
                  }
                }}
              >
                +
              </button>
            </div>
            <div className="">
              <button
                className="bet-button"
                onClick={() => {
                  if (betAmount - 50 < 0) {
                    alert("Bet Size Cannot Be Negative");
                  } else {
                    setBetAmount(betAmount - 50);
                  }
                }}
              >
                -
              </button>
              50
              <button
                className="bet-button"
                onClick={() => {
                  if (betAmount + 50 <= user.balance)
                    setBetAmount(betAmount + 50);
                  else {
                    alert("Cannot Bet more than Balance");
                  }
                }}
              >
                +
              </button>
            </div>
            <div className="number-container4">
              <button
                className="bet-button"
                onClick={() => {
                  if (betAmount - 100 < 0) {
                    alert("Bet Size Cannot Be Negative");
                  } else {
                    setBetAmount(betAmount - 100);
                  }
                }}
              >
                -
              </button>
              100
              <button
                className="bet-button"
                onClick={() => {
                  if (betAmount + 100 <= user.balance)
                    setBetAmount(betAmount + 100);
                  else {
                    alert("Cannot Bet more than Balance");
                  }
                }}
              >
                +
              </button>
            </div>
          </div>
          <div className="game-controls">
            <button onClick={deal}>Deal</button>
            <button onClick={hit} disabled={!cardsDealt}>
              Hit
            </button>
            <button onClick={stand} disabled={!cardsDealt}>
              Stand
            </button>
          </div>

          <p>Bet Amount: {betAmount}</p>
          <p>Total Balance: {user.balance}</p>


          <div className="game-area">
            <div className="player-section">
              <h2>Player: ({calculateHandValue(playerHand)})</h2>
              <div className="player-hand">
                {playerHand.map((card, index) => (
                  <Card key={index} suit={card.suit} rank={card.rank} />
                ))}
              </div>
            </div>
            <div className="dealer-section">
              {onlyFirstCard ? (
                <div className="dealer-section">
                  <div>{secondCardFace.rank}</div>
                  <h2>Dealer: N/A </h2>
                  <div className="dealer-hand">
                    {dealerHand.map((card, index) => (
                      <Card
                        key={index}
                        suit={index === 1 ? null : card.faceDown}
                        rank={index === 1 ? null : card.rank}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="dealer-section">
                  <h2>Dealer: ({calculateHandValue(dealerHand)})</h2>
                  <div className="dealer-hand">
                    {dealerHand.map((card, index) => (
                      <Card
                        key={index}
                        suit={index === 1 ? card.faceDown : card.faceDown}
                        rank={index === 1 ? card.rank : card.rank}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {gameOver && (
            <div className="end-game-prompt">
              <p>{gameResult}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blackjack;
