import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthorizedUserContext from "../Authentication/AuthorizeUser";
import bcrypt from "bcryptjs";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../LoginComponent/Login.css";
import hrhLogo from '../../hrhLogo.png';

const Login = () => {
  const { setAuth } = useContext(AuthorizedUserContext);
  const navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  var userId = "";

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const getMongoData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/getCustomers");

      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const mongoData = await getMongoData();

      const foundUser = mongoData.find(
        (userName) => userName.username === user
      );
      console.log(pwd);
      if (foundUser) {
        const isMatch = await bcrypt.compare(pwd, foundUser.password);
        if (isMatch) {
          setAuth({ user, pwd });
          setUser("");
          setPwd("");
          setSuccess(true);
          const userId = foundUser._id;
          console.log(userId + "THIS IS USEER ID");
          navigate("/home", { replace: true, state: { userAccount: userId } });
        }
      }
      else{
        alert("Incorrect Login Information");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <>
      <h2 className="logo-text">
        <img src={hrhLogo} alt="High Roller Heaven Logo" className="logo-left" />
        <span className="outline-text">
          High Roller Heaven
        </span>
        <img src={hrhLogo} alt="High Roller Heaven Logo" className="logo-right" />
      </h2>
      <div className="login">
        {success ? (
          <section>
            <h1>You are logged in!</h1>
            <br />
            <p>
              <a href="#">Go to Home</a>
            </p>
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
                  <h1>Sign In</h1>
                  <form onSubmit={handleSubmit} className="login">
                    <div className="login__field">
                      <label htmlFor="username">Username:</label>
                      <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                      />

                      <label htmlFor="password">Password:</label>
                      <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                      />
                      <button>Sign In</button>
                    </div>
                  </form>
                  <p>
                    Need an Account?
                    <br></br>
                    <span className="line">
                      <Link to="/Register">Register</Link>
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

export default Login;
