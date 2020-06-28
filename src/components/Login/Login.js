import React, { useContext, useState, useEffect } from "react";
import img from "../../Images/logo.png";
import "./Login.css";
import { FaTimes } from "react-icons/fa";
import ModalContext from "../../context/modalContext/ModalContext";
import SuccessMsg from "../SuccessMsg";
import ErrorMsg from "../ErrorMsg";
import UserContext from "../../context/userContext/UserContext";
import { useHistory } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
export default function Login(props) {
  const { closeLogin, openReg, modalState } = useContext(ModalContext);
  const { userState, userLogin, clearMsg } = useContext(UserContext);
  const [mobile, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const data =
    modalState.language === "ar"
      ? [
          "الدخول",
          "رقم الهاتف",
          "كلمة المرور",
          "دخول",
          "لا تملك حساب؟",
          "سجل من هنا",
        ]
      : [
          "Login",
          "Mobile Number",
          "Password",
          "Submit",
          "Don't have an account?",
          "Register here",
        ];
  const history = useHistory();

  useEffect(() => {
    if (userState.isLoggedIn) {
      setTimeout(() => {
        clearMsg();
        closeLogin();
        history.push("/account");
      }, 1000);
    } else {
      clearMsg();
    }
  }, [userState.isLoggedIn]);

  const onlyDigits = (e) => {
    if (
      parseInt(e.target.value.charAt(e.target.value.length - 1)) >= 0 &&
      parseInt(e.target.value.charAt(e.target.value.length - 1)) <= 9 &&
      e.target.value.length <= 13
    ) {
      setMobileNumber(e.target.value);
    } else if (e.target.value.length === 0) {
      setMobileNumber("");
    }
  };

  const getSuccessMsg = (message) => {
    if (message) {
      return <SuccessMsg text={message}></SuccessMsg>;
    }
    return null;
  };

  const getErrorMsg = (message) => {
    if (message) {
      return <ErrorMsg text={message}></ErrorMsg>;
    }
    return null;
  };

  const submit = (e) => {
    e.preventDefault();
    userLogin(mobile, password);
  };
  const responseGoogle = (response) => {
    console.log(response);
    if (!response.error) {
      userLogin("", response.profileObj.googleId);
    }
  };
  return (
    <div className="loginFormDiv">
      <div className="header">
        <div className="logo">
          <img src={img} alt="logo" />
        </div>
        <h2>{data[0]}</h2>
        <div className="close">
          <button
            onClick={() => {
              closeLogin();
            }}
          >
            <FaTimes />
          </button>
        </div>
      </div>
      <div className="loginForm">
        {getSuccessMsg(userState.successMsg)}
        {getErrorMsg(userState.errorMsg)}
        <form onSubmit={(e) => submit(e)}>
          <div className="fields">
            <label htmlFor="mn">{data[1]}</label>
            <input type="text" id="mn" value={mobile} onChange={onlyDigits} />
            <label htmlFor="pass">{data[2]}</label>
            <input
              type="password"
              id="pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="formBtn">
            <button type="submit">{data[3]}</button>
            <GoogleLogin
              clientId="72355634900-tgqajj681jcvhd3cu25gbibrktkfetp1.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
            />
          </div>
        </form>
      </div>
      <div
        className="footer"
        style={{ direction: modalState.language === "ar" ? "rtl" : "ltr" }}
      >
        <h4>
          {data[4]}{" "}
          <button
            onClick={() => {
              closeLogin();
              openReg();
            }}
          >
            {data[5]}
          </button>
        </h4>
      </div>
    </div>
  );
}
