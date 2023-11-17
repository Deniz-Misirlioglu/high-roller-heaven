import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthorizedUserContext from "../Authentication/AuthorizeUser";
import bcrypt from "bcryptjs";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Card from './Card';

import "../BlackjackComponent/Blackjack.css";

const Blackjack = () => {
  const suits = ['♠', '♣', '♥', '♦'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

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
  const [totalBalance, setTotalBalance] = useState(1000);

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

    setPlayerHand([]);
    setDealerHand([]);
    setGameResult("");

    const shuffledDeck = shuffleDeck(initialDeck);

    setPlayerHand([shuffledDeck.pop(), shuffledDeck.pop()]);
    setDealerHand([shuffledDeck.pop(), shuffledDeck.pop()]);
    setDeck(shuffledDeck);
    return 1;
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
      const result = "Dealer Wins"
      setTotalBalance(totalBalance - betAmount);
      setGameResult(result);
      setGameOver(true);
    }
  };

  const stand = () => {
    if (gameOver || betAmount === 0) {
      alert("Game hasn't started");
      return;
    }
    const dealerHandCopy = [...dealerHand];
    while (calculateHandValue(dealerHandCopy) < 19) {
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
      result = 'Player wins!';
      winnings = 1.5 * betAmount;
    } else if (playerValue === dealerValue) {
      result = 'It\'s a tie!';
      winnings = 0;
    } else {
      result = 'Dealer wins!';
      winnings = -betAmount;
    }

    setTotalBalance(totalBalance + winnings);
    setGameResult(result);
    setBetAmount(0);
    setGameOver(true);
  };

  const calculateHandValue = (hand) => {
    let value = 0;
    let aceCount = 0;

    for (const card of hand) {
      const rank = card.rank;
      if (rank === 'A') {
        aceCount++;
        value += 11;
      } else if (['K', 'Q', 'J'].includes(rank)) {
        value += 10;
      } else {
        value += parseInt(rank);
      }
    }

    while (aceCount > 0 && value > 21) {
      value -= 10; // Reduce the value of Aces to 1 to avoid a bust
      aceCount--;
    }

    return value;
  };

  return (
    <div className="blackjack">
      <p1>Blackjack</p1>
      <div className="betting-section">
        <button onClick={() => placeBet(100)}>Bet 100</button>
        <button onClick={() => placeBet(500)}>Bet 500</button>
        <button onClick={() => placeBet(1000)}>Bet 1000</button>
        <button onClick={() => placeBet(5000)}>Bet 5000</button>
      </div>
      <div className="game-controls">
        <button onClick={deal}>Deal</button>
        <button onClick={hit}>Hit</button>
        <button onClick={stand}>Stand</button>
      </div>
      <p>Bet Amount: {betAmount}</p>
      <p>Total Balance: {totalBalance}</p>
      <div className="player-section">
        <h2>Player: ({calculateHandValue(playerHand)})</h2>
        <div className="player-hand">
          {playerHand.map((card, index) => (
            <Card key={index} suit={card.suit} rank={card.rank} />
          ))}
        </div>
      </div>
      <div className="dealer-section">
        <h2>Dealer: ({calculateHandValue(dealerHand)})</h2>
        <div className="dealer-hand">
          {dealerHand.map((card, index) => (
            <Card key={index} suit={card.suit} rank={card.rank} />
          ))}
        </div>
      </div>
      {gameOver && (
        <div className="end-game-prompt">
          <p>{gameResult}</p>
        </div>
      )}
    </div>
  );
};

export default Blackjack;