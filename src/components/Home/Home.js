import React from "react";
import "./Home.css";
import Flow from "./Flow";
import WhyUs from "./WhyUs";
import Loader from "react-loader-spinner";
import ErrorMsg from "../ErrorMsg";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import PhoneInput from "./PhoneInput";
import { Button } from "@material-ui/core";
import { AddShoppingCart } from "@material-ui/icons";
import ModalContext from "../../context/modalContext/ModalContext";

export default class Home extends React.Component {
  static contextType = ModalContext;

  constructor(props) {
    super(props);
    localStorage.setItem("operatorid", "");
    this.state = {
      isLoading: false,
      displayError: {},
    };
  }
  getMobileInfo() {
    window.location.href = "/recharge";
  }
  render() {
    let { displayError, isLoading } = this.state;
    const { modalState } = this.context;

    return (
      <React.Fragment>
        {displayError.length > 0 ? <ErrorMsg text="" /> : null}
        <div id="topuptoday" className="homeHeader">
          <PhoneInput lang={modalState.language} onChange={this.setValue} />
          <Button
            type="button"
            disabled={isLoading}
            onClick={this.getMobileInfo.bind(this)}
            variant="contained"
            startIcon={<AddShoppingCart />}
          >
            {isLoading ? (
              <Loader type="TailSpin" color="white" height={30} width={80} />
            ) : modalState.language === "ar" ? (
              "تقديم"
            ) : (
              "Submit"
            )}
          </Button>
        </div>

        <Flow />
        <WhyUs />
      </React.Fragment>
    );
  }
}
