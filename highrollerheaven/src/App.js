import logo from "./logo.svg";
import "./App.css";
import Register from "./Components/RegisterComponent/Register";
import Login from "./Components/LoginComponent/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/register" element={<Register />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/" element={<Register />}></Route>
      </Routes>
    </div>
  );
}

export default App;
