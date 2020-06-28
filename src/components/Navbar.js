import React, { useContext } from "react";
import "./Navbar.css";
import img from "../Images/logo.png";
import Login from "./Login/Login";
import Register from "./Register/Register";
import { FaGlobe, FaCaretDown, FaBars, FaTimes } from "react-icons/fa";
import ModalContext from "../context/modalContext/ModalContext";
import UserContext from "../context/userContext/UserContext";
import { Link } from "react-router-dom";
const toggleLangDrop = (e) => {
  const langDrop = document.getElementsByClassName("languageDrop")[0];
  const langBtn = document.getElementsByClassName("languageBtn")[0];
  const caret = document.getElementsByClassName("caret")[0];

  if (langDrop.classList.contains("hidden")) {
    caret.style.transform = "rotate(180deg)";
    langBtn.style.backgroundColor = "var(--color2)";
    langBtn.style.color = "var(--color1)";
    langBtn.style.borderBottomRightRadius = "0";
    langDrop.classList.remove("hidden");
  } else {
    caret.style.transform = "rotate(0deg)";
    langBtn.style.backgroundColor = "var(--color1)";
    langBtn.style.color = "var(--color2)";
    langBtn.style.borderBottomRightRadius = "10px";
    langDrop.classList.add("hidden");
  }
};
const mToggleLangDrop = (e) => {
  const langDrop = document.getElementsByClassName("m-languageDrop")[0];
  const langBtn = document.getElementsByClassName("m-languageBtn")[0];
  const mCaret = document.getElementsByClassName("m-caret")[0];

  if (langDrop.classList.contains("hidden")) {
    mCaret.style.transform = "rotate(180deg)";
    langBtn.style.backgroundColor = "var(--color2)";
    langBtn.style.color = "var(--color1)";
    langBtn.style.borderBottomRightRadius = "0";
    langDrop.classList.remove("hidden");
  } else {
    mCaret.style.transform = "rotate(0deg)";
    langBtn.style.backgroundColor = "var(--color1)";
    langBtn.style.color = "var(--color2)";
    langBtn.style.borderBottomRightRadius = "10px";
    langDrop.classList.add("hidden");
  }
};

const getLanguage = (lang) => {
  switch (lang) {
    case "en":
      return "English";
    case "ar":
      return "العربية";
    default:
      return "English";
  }
};
const lang = (lang) => {
  if (lang === "ar") {
    return ["الشركة", "اتصال", "مساعدة", "الدخول", "التسجيل", "الخروج"];
  } else {
    return ["Company", "Contact", "Help", "Login", "Register", "Logout"];
  }
};
export default function Navbar(props) {
  const { modalState, openLogin, openReg, changeLang } = useContext(
    ModalContext
  );
  const { userState, userLogout } = useContext(UserContext);
  const menuRef = React.createRef();
  const toggleBtnRef = React.createRef();

  const cur = (lang) => {
    switch (lang) {
      case "en":
        return modalState.language === "en"
          ? { cursor: "not-allowed", disabled: true }
          : { cursor: "pointer", disabled: false };
      case "ar":
        return modalState.language === "ar"
          ? { cursor: "not-allowed", disabled: true }
          : { cursor: "pointer", disabled: false };

      default:
        return { cursor: "pointer" };
    }
  };

  const toggleMenu = (e) => {
    const toggleBtn = toggleBtnRef.current;
    const menu = menuRef.current;
    if (menu.classList.contains("closed")) {
      document.getElementsByTagName("body")[0].style.overflowY = "hidden";
      toggleBtn.style.display = "none";
      menu.classList.remove("closed");
      menu.classList.add("opened");
    } else {
      document.getElementsByTagName("body")[0].style.overflowY = "unset";
      toggleBtn.style.display = "flex";
      menu.classList.remove("opened");
      menu.classList.add("closed");
    }
  };
  const data = lang(modalState.language);

  return (
    <React.Fragment>
      <div
        className="navbar"
        style={{ direction: modalState.language === "ar" ? "rtl" : "ltr" }}
      >
        <div className="navLeftSide">
          <div className="logo">
            <Link to="/">
              <img src={img} alt="logo" />
            </Link>
          </div>
          <div>
            <button>
              <span>{data[0]}</span> <FaCaretDown></FaCaretDown>
            </button>
          </div>
          <div>
            <button>{data[1]}</button>
          </div>
          <div>
            <button>{data[2]}</button>
          </div>
        </div>
        <div className="navRightSide">
          <div style={{ position: "relative" }}>
            <button className="languageBtn">
              <FaGlobe />{" "}
              <span onClick={(e) => toggleLangDrop(e)}>
                {getLanguage(modalState.language)}
              </span>{" "}
              <FaCaretDown
                className="caret"
                onClick={(e) => toggleLangDrop(e)}
              ></FaCaretDown>
            </button>
            <div className="languageDrop hidden">
              <button
                className="languageBtn"
                style={{ cursor: cur("en").cursor }}
                onClick={(e) => {
                  toggleLangDrop(e);
                  changeLang("en");
                }}
                disabled={cur("en").disabled}
              >
                <span>English</span>
              </button>
              <button
                className="languageBtn"
                style={{ cursor: cur("ar").cursor }}
                onClick={(e) => {
                  toggleLangDrop(e);
                  changeLang("ar");
                }}
                disabled={cur("ar").disabled}
              >
                <span>العربية</span>
              </button>
            </div>
          </div>
          {!userState.isLoggedIn ? (
            <React.Fragment>
              <div>
                <button onClick={openLogin}>{data[3]}</button>
              </div>
              <div>
                <button onClick={openReg}>{data[4]}</button>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div>
                <Link to="/account">
                  <button>
                    {userState.loggedInUser.first_name +
                      " " +
                      userState.loggedInUser.last_name}
                  </button>
                </Link>
              </div>
              <div>
                <button onClick={userLogout}>{data[5]}</button>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="m-navbar">
        <div className="m-navLeftSide">
          <div className="m-logo">
            <Link to="/">
              <img src={img} alt="logo" />
            </Link>
          </div>
        </div>

        <div
          className="m-navRightSide"
          style={{ direction: modalState.language === "ar" ? "rtl" : "ltr" }}
        >
          <div className="m-toggle">
            <button
              ref={toggleBtnRef}
              className="m-toggler"
              onClick={(e) => toggleMenu(e)}
            >
              <FaBars />
            </button>
            {/* Menu Open */}
            <div ref={menuRef} className="m-toggleMenu closed">
              <div className="m-toggleMenuHeader">
                <div style={{ position: "relative" }}>
                  <button className="m-languageBtn">
                    <span>{getLanguage(modalState.language)}</span>{" "}
                    <FaCaretDown
                      className="m-caret"
                      onClick={(e) => mToggleLangDrop(e)}
                    ></FaCaretDown>
                  </button>
                  <div className="m-languageDrop hidden">
                    <button
                      className="m-languageBtn"
                      style={{ cursor: cur("en").cursor }}
                      onClick={(e) => {
                        mToggleLangDrop(e);
                        changeLang("en");
                      }}
                      disabled={cur("en").disabled}
                    >
                      <span>English</span>
                    </button>
                    <button
                      className="m-languageBtn"
                      style={{ cursor: cur("ar").cursor }}
                      onClick={(e) => {
                        mToggleLangDrop(e);
                        changeLang("ar");
                      }}
                      disabled={cur("ar").disabled}
                    >
                      <span>العربية</span>
                    </button>
                  </div>
                </div>
                <div className="close">
                  <button onClick={(e) => toggleMenu(e)}>
                    <FaTimes />
                  </button>
                </div>
              </div>
              <div style={{ border: "1px solid black" }}></div>
              <div className="m-toggleMenuBody">
                <ul>
                  <li>
                    <div>
                      <button>
                        <span>{data[0]}</span> <FaCaretDown></FaCaretDown>
                      </button>
                    </div>
                  </li>
                  <li>
                    <button>{data[1]}</button>
                  </li>
                  <li>
                    <button>{data[2]}</button>
                  </li>
                </ul>
              </div>
              <div className="m-toggleMenuFooter">
                {!userState.isLoggedIn ? (
                  <React.Fragment>
                    <button
                      onClick={() => {
                        toggleMenu();
                        openLogin();
                      }}
                    >
                      {data[3]}
                    </button>
                    <button
                      onClick={() => {
                        toggleMenu();
                        openReg();
                      }}
                    >
                      {data[4]}
                    </button>
                  </React.Fragment>
                ) : (
                  <button onClick={userLogout}>{data[5]}</button>
                )}
              </div>
            </div>
            {/* Menu End */}
          </div>
        </div>
      </div>

      {/* Login & Registration Modal */}
      {(() => {
        if (modalState.loginModal) {
          return (
            <div className="modalBack">
              <Login />
            </div>
          );
        } else if (modalState.regModal) {
          return (
            <div className="modalBack">
              <Register />
            </div>
          );
        } else {
          return null;
        }
      })()}
    </React.Fragment>
  );
}
