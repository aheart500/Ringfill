import React, { useContext, useState, useEffect } from "react";
import img from "../../Images/logo.png";
import "./Register.css";
import { FaTimes } from "react-icons/fa";
import ModalContext from "../../context/modalContext/ModalContext";
import UserContext from "../../context/userContext/UserContext";
import SuccessMsg from "../SuccessMsg";
import ErrorMsg from "../ErrorMsg";
import { GoogleLogin } from "react-google-login";
export default function Register() {
  const { closeReg, openLogin, modalState } = useContext(ModalContext);
  const { userState, userRegistration, clearMsg } = useContext(UserContext);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [confirm_email, setConfirmEmail] = useState("");
  const [mobile, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const data =
    modalState.language === "ar"
      ? [
          "الأسم الأول",
          "الأسم الأخير",
          "البريد الإلكتروني",
          "تأكيد البريد الإلكتروني",
          "الهاتف",
          "كلمة المرور",
          "التسجيل",
          "تسجيل",
          "عندك حساب بالفعل؟",
          "ادخل من هنا",
        ]
      : [
          "First Name",
          "Last Name",
          "Email",
          "Email Confirm",
          "Mobile",
          "Password",
          "Register",
          "Submit",
          "Already have an account?",
          "Login here",
        ];
  useEffect(() => {
    if (userState.isLoggedIn) {
      clearMsg();
      closeReg();
    } else {
      clearMsg();
    }
  }, [userState.isLoggedIn]);

  const onlyDigits = (e) => {
    if (
      parseInt(e.target.value.charAt(e.target.value.length - 1)) >= 0 &&
      parseInt(e.target.value.charAt(e.target.value.length - 1)) <= 9 &&
      e.target.value.length <= 10
    ) {
      setMobileNumber(e.target.value);
    } else if (e.target.value.length === 0) {
      setMobileNumber("");
    }
  };
  const responseGoogle = (response) => {
    console.log(response);
    if (!response.error) {
      userRegistration(
        response.profileObj.givenName,
        response.profileObj.familyName,
        response.profileObj.email,
        "",
        response.profileObj.googleId
      );
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
    if (email == confirm_email) {
      userRegistration(first_name, last_name, email, mobile, password);
    } else {
      getErrorMsg("Email and Confirm Email should be same");
    }
  };

  return (
    <div className="registerFormDiv">
      <div className="header">
        <div className="logo">
          <img src={img} alt="logo" />
        </div>
        <h2>{data[6]}</h2>
        <div className="close">
          <button
            onClick={() => {
              clearMsg();
              closeReg();
            }}
          >
            <FaTimes />
          </button>
        </div>
      </div>
      <div className="registerForm">
        {getSuccessMsg(userState.successMsg)}
        {getErrorMsg(userState.errorMsg)}
        <form onSubmit={(e) => submit(e)}>
          <div
            className="fields"
            style={{ direction: modalState.language === "ar" ? "rtl" : "ltr" }}
          >
            <input
              type="text"
              name="first_name"
              placeholder={data[0]}
              value={first_name}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <input
              type="text"
              name="last_name"
              placeholder={data[1]}
              value={last_name}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            <input
              type="email"
              name="email"
              placeholder={data[2]}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="email"
              name="confirm_email"
              placeholder={data[3]}
              value={confirm_email}
              onChange={(e) => {
                setConfirmEmail(e.target.value);
              }}
            />
            <input
              type="text"
              name="mobile"
              placeholder={data[4]}
              value={mobile}
              onChange={onlyDigits}
            />
            <input
              type="password"
              name="password"
              placeholder={data[5]}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="formBtn">
            <button type="submit">{data[7]}</button>
            <GoogleLogin
              clientId="72355634900-tgqajj681jcvhd3cu25gbibrktkfetp1.apps.googleusercontent.com"
              buttonText="Signup"
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
          {data[8]}{" "}
          <button
            onClick={() => {
              clearMsg();
              closeReg();
              openLogin();
            }}
          >
            {data[9]}
          </button>
        </h4>
      </div>
    </div>
  );
}
