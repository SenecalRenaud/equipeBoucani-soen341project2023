import React, { useContext, useEffect, useState } from "react";
import "./SignInForm.css";
import CommentAPIService from "../BACKEND_DEBUG/CommentAPIService";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useCookies } from 'react-cookie';
import { useUserContext } from "../../context/UserContext";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

const SignInForm = () => {
  const navigate = useNavigate(); //for Antoine UserContext : Smart loading and error handling
  const location = useLocation(); //for Antoine UserContext : Smart loading and error handling
  // Antoine's single Context x Reducer user stateful information storage ! Efficient!
  // If certain information are accessed often, one could redesign into small contexts
  // for improved relative performance.
  const { state, dispatch } = useUserContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
      setPassword("");
    }
  }, [location.state]);
  useEffect(() => {
    handleError();
  }, [state]);
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleError = () => {
    console.log("HANDLE ERROR:");
    console.log(state);
    setLoading(state.loading);
    if (state.errorMsg) {
      alert(`SIGN IN ERROR: ${state.errorMsg}`);
      if (
        state.errorMsg.includes("INVALID_PASSWORD") ||
        state.errorMsg.includes("TOO_MANY_ATTEMPTS_TRY_LATER")
      ) {
        navigate("/signin", { state: { email } });
      } else {
        navigate("/signin");
      }
    }
    return null;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setLoading(true); //used to be 'true'
    // setTimeout( () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    CommentAPIService.UserSignIn(dispatch, formData)
      .then((data) => {
        //manually dispatch LOGIN SUCCESS WITH DATA here if needed
        console.log("HANDLING SIGN-IN IN SETTIMEOUT");
        // handleError()
        // setLoading(state.loading)
      })
      .catch((err) => {
        // dispatch({ type: 'REDUXACTION_LOGIN_ERROR', error: err })

        console.log("HANDLING ERROR IN SIGNIN TIMEOUT");
        // handleError()
        // setLoading(state.loading)
      });

    //setLoading(false)

    // }, 1500);
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="sign-in-container">
          <div className="sign-in-card">
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email-input">Email</label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <label htmlFor="password-input">Password</label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <p>
                {" "}
                <span style={{ textDecoration: "underline", color: "grey" }}>
                  <Link to="/forgotpassword"> Forgot your password? </Link>
                </span>{" "}
              </p>
              <button className="sign-in-button" type="submit">
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}
      ;
    </>
  );
};

export default SignInForm;
