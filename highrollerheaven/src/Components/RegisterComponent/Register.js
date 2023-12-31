import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import bcrypt from "bcryptjs";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../RegisterComponent/Register.css";
import hrhLogo from "../../hrhLogo.png";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
  const navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [nonRepeatedName, setNonRepeatedName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const isUsernameTaken = users.some(
      (existingUser) => existingUser.username === user
    );
    if (isUsernameTaken) {
      setErrMsg("Username already taken.");
      setValidName(false);
      setNonRepeatedName(false);
    } else {
      setErrMsg(""); // Clear the error message if the username is not taken
      setValidName(USER_REGEX.test(user));
      setNonRepeatedName(true);
    }
  }, [user, users]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  useEffect(() => {}, [users]);

  const getMongoData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/getCustomers");
      // Assuming the response data is an array of users
      setUsers(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMongoData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    setSuccess(true); //success being true

    //PLACE API STUFF HERE
    addUserData(user, pwd);
    navigate("/login");
  };

  const addUserData = async (username, password) => {
    try {
      const saltRounds = 10;
      // Hash the password asynchronously
      const passwordHashed = await bcrypt.hash(password, saltRounds);
      const userData = {
        username: username,
        password: passwordHashed,
        balance: 500,
        refillBalanceTime: 0,
      };

      const response = await axios.post(
        "http://localhost:3001/addCustomers",
        userData
      );
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <>
      <h2 className="logo-text">
        <img
          src={hrhLogo}
          alt="High Roller Heaven Logo"
          className="logo-left"
        />
        <span className="outline-text">High Roller Heaven</span>
        <img
          src={hrhLogo}
          alt="High Roller Heaven Logo"
          className="logo-right"
        />
      </h2>
      <div className="register">
        {success ? (
          <section>
            <h1>Success!</h1>
          </section>
        ) : (
          <section>
            <div className="container">
              <div className="screen">
                <div className="screen__content">
                  <p
                    ref={errRef}
                    className={errMsg ? "errmsg" : "offscreen"}
                    aria-live="assertive"
                  >
                    {errMsg}
                  </p>
                  <h1>Register</h1>
                  <form onSubmit={handleSubmit} className="login">
                    <div className="login__field">
                      <label htmlFor="username">
                        Username:
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={validName ? "valid" : "hide"}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className={validName || !user ? "hide" : "invalid"}
                        />
                      </label>
                      <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                        aria-invalid={validName ? "false" : "true"}
                        aria-describedby="uidnote"
                        onFocus={() => setUserFocus(true)}
                        onBlur={() => setUserFocus(false)}
                      />
                      <p
                        id="uidnote"
                        className={
                          userFocus && user && !validName && nonRepeatedName
                            ? "instructions"
                            : "offscreen"
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        4 to 24 characters.
                        <br />
                        Must begin with a letter.
                        <br />
                        Letters, numbers, underscores, hyphens allowed.
                      </p>

                      <p
                        id="uidnote"
                        className={
                          userFocus && user && !validName && !nonRepeatedName
                            ? "instructions"
                            : "offscreen"
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Name Already taken, Please choose another
                      </p>

                      <label htmlFor="password">
                        Password:
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={validPwd ? "valid" : "hide"}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className={validPwd || !pwd ? "hide" : "invalid"}
                        />
                      </label>
                      <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby="pwdnote"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                      />
                      <p
                        id="pwdnote"
                        className={
                          pwdFocus && !validPwd ? "instructions" : "offscreen"
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 24 characters.
                        <br />
                        Must include uppercase and lowercase letters, a number
                        and a special character.
                        <br />
                        Allowed special characters:{" "}
                        <span aria-label="exclamation mark">!</span>{" "}
                        <span aria-label="at symbol">@</span>{" "}
                        <span aria-label="hashtag">#</span>{" "}
                        <span aria-label="dollar sign">$</span>{" "}
                        <span aria-label="percent">%</span>
                      </p>

                      <label htmlFor="confirm_pwd">
                        Confirm Password:
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={validMatch && matchPwd ? "valid" : "hide"}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className={
                            validMatch || !matchPwd ? "hide" : "invalid"
                          }
                        />
                      </label>
                      <input
                        type="password"
                        id="confirm_pwd"
                        onChange={(e) => setMatchPwd(e.target.value)}
                        value={matchPwd}
                        required
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby="confirmnote"
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                      />
                      <p
                        id="confirmnote"
                        className={
                          matchFocus && !validMatch
                            ? "instructions"
                            : "offscreen"
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input field.
                      </p>

                      <button
                        disabled={
                          !validName || !validPwd || !validMatch ? true : false
                        }
                      >
                        Sign Up
                      </button>
                    </div>
                  </form>
                  <p>
                    Already have an account?
                    <br />
                    <span className="line">
                      <Link to="/login">Sign In</Link>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Register;
