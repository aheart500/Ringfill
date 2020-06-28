import React, { useReducer } from "react";
import UserContext from "./UserContext";
import UserReducer from "./UserReducer";
import AppConst from "../../constants";
import {
  USER_REGISTRATION,
  USER_LOGIN,
  USER_LOGOUT,
  USER_RECHARGE,
  SET_SUCCESS_MSG,
  SET_ERROR_MSG,
  CLEAR_MSG,
  SET_USER,
} from "./../types";
import axios from "axios";

export default function UserState(props) {
  const initialState = {
    loggedInUser: {
      first_name: "",
      last_name: "",
      email: "",
      mobile: "",
    },
    isLoggedIn: false,
    successMsg: "",
    errorMsg: "",
  };

  if (localStorage.getItem("user") !== null) {
    initialState.loggedInUser = JSON.parse(localStorage.getItem("user"));
    initialState.isLoggedIn = true;
  }

  const [state, dispatch] = useReducer(UserReducer, initialState);

  const userRegistration = (first_name, last_name, email, mobile, password) => {
    if (first_name && email && mobile && password) {
      const newUser = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        mobile: mobile,
        password: password,
      };
      axios
        .post(AppConst.API_URL + "user/register", newUser)
        .then((res) => {
          if (res.data.success) {
            dispatch({
              type: USER_REGISTRATION,
              payload: res.data.message,
            });
          } else {
            setErrorMsg(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (!first_name) {
      setErrorMsg("Name Required");
    } else if (!mobile) {
      setErrorMsg("Mobile Number Required");
    } else if (!password) {
      setErrorMsg("Password Required");
    }
  };

  const userLogin = (mobile, password) => {
    if (mobile && password) {
      const user = {
        mobile: mobile,
        password: password,
      };
      axios
        .post(AppConst.API_URL + "user/login", user)
        .then((res) => {
          if (res.data.success) {
            dispatch({
              type: USER_LOGIN,
              payload: res.data.message,
            });
            setUser(res.data.user);
          } else {
            setErrorMsg(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (!mobile) {
      setErrorMsg("Mobile Number Required");
    } else if (!password) {
      setErrorMsg("Password Required");
    }
  };

  const userLogout = () => {
    localStorage.clear();
    dispatch({
      type: USER_LOGOUT,
    });
  };
  const userRecharge = () => {
    localStorage.clear();
    dispatch({
      type: USER_RECHARGE,
    });
  };
  const setSuccessMsg = (message) => {
    dispatch({
      type: SET_SUCCESS_MSG,
      payload: message,
    });
  };

  const setErrorMsg = (message) => {
    dispatch({
      type: SET_ERROR_MSG,
      payload: message,
    });
  };

  const clearMsg = () => {
    dispatch({
      type: CLEAR_MSG,
    });
  };

  const setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({
      type: SET_USER,
      payload: user,
    });
  };

  return (
    <UserContext.Provider
      value={{
        userState: state,
        userRegistration,
        userLogin,
        userLogout,
        clearMsg,
        setUser,
        userRecharge,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
