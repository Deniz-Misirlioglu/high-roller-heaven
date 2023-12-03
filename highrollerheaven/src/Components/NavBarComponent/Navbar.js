import { Link } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faDice, faUser } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import hrhLogo from "../../hrhLogo.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state.userAccount;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showText, setShowText] = useState(false);
  const [user, setUser] = useState("");
  const [mongoData, setMongoData] = useState([]);

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
  const navigateToBlackJack = (userId) => {
    navigate("/blackjack", { replace: true, state: { userAccount: userId } });
  };
  const navigateToRoulette = (userId) => {
    navigate("/roulette", { replace: true, state: { userAccount: userId } });
  };
  const navigateToHilo = (userId) => {
    navigate("/hilo", { replace: true, state: { userAccount: userId } });
  };

  return (
    <>
      {user && (
        <>
          <div className="top-navbar">
            <img src={hrhLogo} alt="High Roller Heaven Logo" className="logo" />
            <div className="user-name">{user.username}</div>
            <img src={hrhLogo} alt="High Roller Heaven Logo" className="logo" />
            <Link to="/login" className="rigthalign">
              Logout
            </Link>
          </div>
          <button className="hamburger-btn" onClick={handleHamburgerClick}>
            ☰
          </button>
          <nav className={`navbar ${isExpanded ? "expanded" : "collapsed"}`}>
            <div className="navbar-menu">
              <ul className={`menu-list ${showText ? "show" : ""}`}>
                <li>
                  <div
                    className="nav-link"
                    onClick={() => navigateToHome(userId)}
                  >
                    <FontAwesomeIcon icon={faHome} />
                    <span> Home</span>
                  </div>
                </li>
                <li>
                  <div
                    className="nav-link"
                    onClick={() => navigateToSlots(userId)}
                  >
                    S<span>lots</span>
                  </div>
                </li>
                <li>
                  <div
                    className="nav-link"
                    onClick={() => navigateToBlackJack(userId)}
                  >
                    B<span>lackjack</span>
                  </div>
                </li>
                <li>
                  <div
                    className="nav-link"
                    onClick={() => navigateToRoulette(userId)}
                  >
                    R<span>oulette</span>
                  </div>
                </li>
                <li>
                  <div
                    className="nav-link"
                    onClick={() => navigateToHilo(userId)}
                  >
                    H<span>iLo</span>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </>
      )}
    </>
  );
};

export default Navbar;
