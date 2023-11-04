import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faDice, faUser } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
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
              <Link to="/">
                <FontAwesomeIcon icon={faHome} />
                <span> Home</span>
              </Link>
            </li>
            <li>
              <Link to="/games">
                <FontAwesomeIcon icon={faDice} />
                <span> Games</span>
              </Link>
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
