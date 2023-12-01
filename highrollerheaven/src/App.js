import logo from "./logo.svg";
import "./App.css";
import Register from "./Components/RegisterComponent/Register";
import Login from "./Components/LoginComponent/Login";
import Home from "./Components/HomeComponent/Home";
import Navbar from "./Components/NavBarComponent/Navbar";
import Slot from "./Components/SlotComponent/Slot";
import Roulette from "./Components/RouletteComponent/Roulette";
import Blackjack from "./Components/BlackjackComponent/Blackjack";
import HiLo  from "./Components/HiLo/HiLo";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Fragment,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/register" element={<Register />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/" element={<Register />}></Route>
        <Route path="/home" element={<NavBarHome />} />
        <Route exact path="/navbar" element={<Navbar />}></Route>
        <Route exact path="/slot" element={<NavbarSlot />}></Route>
        <Route exact path="/roulette" element={<NavbarRoulette />}></Route>
        <Route exact path="/blackjack" element={<NavBarBlackjack />}></Route>
        <Route exact path="/hilo" element={<NavBarHilo />}></Route>
      </Routes>
    </div>
  );
}

function NavBarHome() {
  return (
    <>
      <Navbar />
      <Home />
    </>
  );
}

function NavbarSlot() {
  return (
    <>
      <Navbar />
      <Slot />
    </>
  );
}

function NavbarRoulette() {
  return (
    <>
      <Navbar />
      <Roulette />
    </>
  );
}

function NavBarBlackjack() {
  return (
    <>
      <Navbar />
      <Blackjack />
    </>
  );
}

function NavBarHilo() {
  return (
    <>
      <Navbar />
      <HiLo />
    </>
  );
}

export default App;
