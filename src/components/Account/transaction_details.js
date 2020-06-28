import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import AppConst from "../../constants";
import ModalContext from "../../context/modalContext/ModalContext";
class transaction_details extends Component {
  static contextType = ModalContext;
  constructor(props) {
    super(props);
    this.state = {
      details: {},
      isLoading: false,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    axios
      .get(
        AppConst.API_URL + "mobile/transactions/" + this.props.match.params.id
      )
      .then((dta) => {
        this.setState({ isLoading: !true });
        this.setState({ details: dta.data });
      })
      .catch((err) => {
        this.setState({ isLoading: !true });
        console.log(err);
      });
  }

  render() {
    console.log(this.state.details);
    const { modalState } = this.context;
    const arabic = modalState.language === "ar";
    const { details } = this.state;
    return (
      <div>
        <h2 style={{ margin: "1em 2em" }}>
          {arabic ? "تفاصيل العملية" : "Transaction Details"}
        </h2>
        <br />
        {this.state.isLoading ? (
          <Loader type="TailSpin" style={{ margin: "2em" }} color="#FFCE60" />
        ) : (
          <div
            style={{
              margin: "1em 2.5em",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>
              <span className="label">{arabic ? "التكلفة:" : "Amount:"}</span>{" "}
              {details.actual_product_sent + " " + details.destination_currency}
            </span>
            <span>
              <span className="label">{arabic ? "الشبكة:" : "Operator:"}</span>{" "}
              {details.operator}
            </span>
            <span>
              <span className="label">
                {arabic ? "السعر المستلم:" : "Received:"}
              </span>{" "}
              {details.local_info_amount}
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(transaction_details);
