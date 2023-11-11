import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faDice, faUser } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  console.log(location.state.userAccount);
  const userId = location.state.userAccount;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showText, setShowText] = useState(false);

  const handleHamburgerClick = () => {
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);

    if (!isExpanded) {
      // If the navbar is currently collapsed (and about to expand),
      // wait for the transition to finish before showing the text
      setTimeout(() => {
        setShowText(true);
      }, 100);
    } else {
      setShowText(false);
    }
  };

  const navigateToHome = (userId) => {
    navigate("/home", { replace: true, state: { userAccount: userId } });
  };

  const navigateToSlots = (userId) => {
    navigate("/slot", { replace: true, state: { userAccount: userId } });
  };

  return (
    <>
      <div className="top-navbar">
        <Link to="/login">Logout</Link>
      </div>
      <button className="hamburger-btn" onClick={handleHamburgerClick}>
        ☰
      </button>
      <nav className={`navbar ${isExpanded ? "expanded" : "collapsed"}`}>
        <div className="navbar-menu">
          <ul className={`menu-list ${showText ? "show" : ""}`}>
            <li>
              <div className="nav-link" onClick={() => navigateToHome(userId)}>
                <FontAwesomeIcon icon={faHome} />
                <span> Home</span>
              </div>
            </li>
            <li>
              <div className="nav-link" onClick={() => navigateToSlots(userId)}>
                <FontAwesomeIcon icon={faDice} />
                <span> Slots</span>
              </div>
            </li>
            <li>
              <Link to="/account">
                <FontAwesomeIcon icon={faUser} />
                <span> Account</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
