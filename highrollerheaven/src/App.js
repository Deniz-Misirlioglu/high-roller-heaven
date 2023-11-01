import logo from "./logo.svg";
import "./App.css";
import Register from "./Components/RegisterComponent/Register";
import Login from "./Components/LoginComponent/Login";
import Home from "./Components/HomeComponent/Home";
import Navbar from "./Components/NavBarComponent/Navbar";
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
        <Route path="/home" element={<SomePathLayout />} />
      </Routes>
    </div>
  );
}

function SomePathLayout() {
  return (
    <>
      <Navbar />
      <Home />
    </>
  );
}

export default App;
