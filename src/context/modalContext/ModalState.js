import React, { useReducer } from "react";
import ModalContext from "./ModalContext";
import ModalReducer from "./ModalReducer";
import {
  OPEN_LOGIN,
  CLOSE_LOGIN,
  OPEN_REG,
  CLOSE_REG,
  CHANGE_LANG,
} from "../types";

export default function ModalState(props) {
  const initialState = {
    loginModal: false,
    regModal: false,
    language: "en",
  };
  if (localStorage.getItem("lang") !== null) {
    initialState.language = JSON.parse(localStorage.getItem("lang"));
  }
  const [state, dispatch] = useReducer(ModalReducer, initialState);

  const openLogin = () => {
    dispatch({
      type: OPEN_LOGIN,
    });
  };

  const closeLogin = () => {
    dispatch({
      type: CLOSE_LOGIN,
    });
  };

  const openReg = () => {
    dispatch({
      type: OPEN_REG,
    });
  };

  const closeReg = () => {
    dispatch({
      type: CLOSE_REG,
    });
  };

  const changeLang = (lang) => {
    localStorage.setItem("lang", JSON.stringify(lang));
    dispatch({
      type: CHANGE_LANG,
      payload: lang,
    });
  };

  return (
    <div>
      <ModalContext.Provider
        value={{
          modalState: state,
          openLogin,
          closeLogin,
          openReg,
          closeReg,
          changeLang,
        }}
      >
        {props.children}
      </ModalContext.Provider>
    </div>
  );
}
