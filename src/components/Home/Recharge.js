import React from "react";
import "./Recharge.css";
import img from "../../Images/draw.png";
import axios from "axios";
import { message } from "antd";
import Loader from "react-loader-spinner";
import Payment from "../Payment";
import ErrorMsg from "../ErrorMsg";
import { Modal as MDL } from "antd";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import AppConst from "../../constants";
import PhoneInput from "./PhoneInput";
import one from "../../Images/1.jpg";
import four from "../../Images/4.jpg";
import five from "../../Images/5.jpg";
import thirteen from "../../Images/13.jpg";
import seventeen from "../../Images/17.jpg";
import eighteen from "../../Images/18.jpg";
import topup from "../../Images/topup.jpg";
import inertnet from "../../Images/internet.jpg";
import mobile from "../../Images/mobile.jpg";
import mdollor from "../../Images/m-dollor.jpg";
import loading from "../../Images/loading.gif";
import ModalContext from "../../context/modalContext/ModalContext";
import { Button } from "@material-ui/core";
import { AddShoppingCart } from "@material-ui/icons";
export default class Home extends React.Component {
  static contextType = ModalContext;
  constructor(props) {
    super(props);
    localStorage.setItem("operatorid", "");
    this.state = {
      isLoading: false,
      apiTypes: false,
      packageQuery: false,
      displayError: "",
      typeId: "1",
      operatorid: "",
      paymentTypes: {},
      paymentName: "Yemen Mobile",
      rechargeType: 1,
      packageType: true,
      isCoupon: true,
      offerModal: {},
      offerRenewModal: {},
      package: false,
      isAgree: true,
      total: 0,
      rate: 0,
      amount: 0,
      currency: "USD",
      balanceAmount: "",
      couponName: "",
      offerOperators: {},
      fees: {},
      invoiceList: {
        mobile: "",
        msidn: "",
        paymentName: "Yemen Mobile",
        amount: 0,
        fee: 0,
        total: 0,
        coupon_amount: 0,
        coupon_name: "",
      },
      editNo: false,
      openPayment: false,
      invoice: false,
      selectedOfferIndex: -1,
      reachargeSuccess: false,
      reachargeMessage: "Recharge Successfully",
      step: 0,
    };
  }
  componentDidMount() {
    this.setState({ isLoading: true });
    axios
      .get(AppConst.API_URL + "mobile/payment-types")
      .then((res) => {
        this.setState({ isLoading: false });
        if (res.data.status) {
          this.setState({ paymentTypes: res.data.result });
        } else {
          message.error(res.data.error_txt);
        }
      })
      .catch((err) => {
        message.error("Error getting payment types!");
      });
    axios.get(AppConst.API_URL + "mobile/usd-rate").then((res) => {
      this.setState({ rate: res.data.result[0].value });
    });
    axios.get(AppConst.API_URL + "mobile/api-types").then((res) => {
      this.setState({ fees: res.data.result });
    });
    if (
      localStorage.getItem("mobile") == null ||
      localStorage.getItem("mobile") == undefined
    ) {
      this.setState({ editNo: false });
    } else {
      this.getMobileInfo();
      this.setState({ editNo: true });
    }
  }

  agreeBtn() {
    let isAgree = this.state.isAgree;
    this.setState({ isAgree: !isAgree });
  }
  getMobileInfo() {
    let mobile = localStorage.getItem("mobile");
    let { apiTypes, rechargeType, typeId, invoiceList } = this.state;
    if (mobile.indexOf("+967") != -1) {
      apiTypes = true;
      this.setState({ apiTypes, amount: 0, isLoading: true, editNo: true });
    } else {
      apiTypes = false;
      this.setState({ apiTypes, amount: 0, isLoading: true, editNo: true });
    }
    if (apiTypes) {
      let carrier = mobile.substring(4, 6);
      if (carrier == 70) {
        typeId = 17;
        rechargeType = 1;
        invoiceList.paymentName = "Y Telecom";
      } else if (carrier == 71) {
        typeId = 18;
        rechargeType = 1;
        invoiceList.paymentName = "Sabafon";
      } else if (carrier == 73) {
        typeId = 13;
        rechargeType = 1;
        invoiceList.paymentName = "MTN";
      } else if (carrier == 77) {
        typeId = 1;
        rechargeType = 1;
        invoiceList.paymentName = "Yemen Mobile";
      } else {
        let carrier = mobile.substring(4, 5);
        if (carrier == 0) {
          typeId = 5;
          rechargeType = 2;
          invoiceList.paymentName = "ADSL";
        } else {
          typeId = 4;
          rechargeType = 1;
          invoiceList.paymentName = "Land Line";
        }
      }
      this.setState({
        balanceAmount: "",
        typeId,
        rechargeType,
        invoiceList,
        selectedOfferIndex: -1,
        isLoading: false,
        packageQuery: false,
      });
      axios
        .post(AppConst.API_URL + "mobile/yemen-recharge", {
          serviceType: typeId,
          rechargeType: this.state.rechargeType,
          mobile: mobile.replace("+967", ""),
          package: this.state.package,
        })
        .then((res) => {
          this.setState({ isLoading: false, packageQuery: false });
          if (res.data.status) {
            if (res.data.result.length > 0) {
              this.setState({
                offerModal: res.data.result,
                balanceAmount: "",
                selectedOfferIndex: -1,
              });
            } else {
              this.setState({
                offerModal: [{}],
                balanceAmount: "",
                selectedOfferIndex: -1,
              });
              message.error("Package offer not found");
            }
          } else {
            message.error(res.data.error_txt);
          }
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          message.error("Error getting mobile information!");
        });
    } else {
      let form = {
        mobile: mobile,
        operatorid: localStorage.getItem("operatorid"),
      };
      axios
        .post(AppConst.API_URL + "mobile/offers/get", form)
        .then((res) => {
          this.setState({ isLoading: false });
          if (res.data.error_code === "0") {
            this.setState({ offerModal: res.data, packageQuery: true });
          } else {
            message.error(res.data.error_txt);
          }
        })
        .catch((err) => {
          this.setState({ isLoading: false, packageQuery: true });
          message.error("Error getting mobile information!");
        });
    }
  }
  getPackageQuery = (e) => {
    this.setState({ amount: 0, isLoading: true });
    axios
      .post(AppConst.API_URL + "mobile/yemen-offers", {
        serviceType: this.state.typeId,
        rechargeType: this.state.rechargeType,
        mobile: localStorage.getItem("mobile").replace("+967", ""),
      })
      .then((res) => {
        if (res.data.status) {
          if (res.data.result.length > 0) {
            this.setState({
              offerRenewModal: res.data.result,
              isLoading: false,
              packageQuery: true,
              balanceAmount: "",
              selectedOfferIndex: -1,
            });
          } else {
            this.setState({
              offerRenewModal: [{}],
              isLoading: false,
              packageQuery: false,
              balanceAmount: "",
              selectedOfferIndex: -1,
            });
            message.error("Package offer not found");
          }
        } else {
          message.error(res.data.error_txt);
        }
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        message.error("Error getting mobile information!");
      });
  };
  setMobileTypeId = (e) => {
    let { paymentName, paymentTypes, rechargeType, invoiceList } = this.state;
    let typeId = parseInt(e.target.value);
    if (typeId == 17) {
      rechargeType = 1;
      invoiceList.paymentName = "Y Telecom";
    } else if (typeId == 18) {
      rechargeType = 1;
      invoiceList.paymentName = "Sabafon";
    } else if (typeId == 13) {
      rechargeType = 1;
      invoiceList.paymentName = "MTN";
    } else if (typeId == 1) {
      rechargeType = 1;
      invoiceList.paymentName = "Yemen Mobile";
    } else if (typeId == 5) {
      rechargeType = 2;
      invoiceList.paymentName = "ADSL";
    } else if (typeId == 4) {
      rechargeType = 1;
      invoiceList.paymentName = "Land Line";
    }
    paymentTypes.map((itm, key) => {
      if (itm.id === typeId) {
        invoiceList.paymentName = itm.name;
        this.setState({
          amount: 0,
          invoiceList,
          typeId: typeId,
          package: false,
          packageQuery: false,
          paymentName,
        });
        axios
          .post(AppConst.API_URL + "mobile/yemen-recharge", {
            serviceType: typeId,
            rechargeType: this.state.rechargeType,
            mobile: localStorage.getItem("mobile").replace("+967", ""),
            package: this.state.package,
          })
          .then((res) => {
            this.setState({ isLoading: false, packageQuery: false });
            if (res.data.status) {
              if (res.data.result.length > 0) {
                this.setState({
                  offerModal: res.data.result,
                  balanceAmount: "",
                  selectedOfferIndex: -1,
                });
              } else {
                this.setState({
                  offerModal: [{}],
                  balanceAmount: "",
                  selectedOfferIndex: -1,
                });
                message.error("Package offer not found");
              }
            } else {
              message.error(res.data.error_txt);
            }
          })
          .catch((err) => {
            this.setState({ isLoading: false });
            message.error("Error getting mobile information!");
          });
      }
    });
  };
  openInvoice = (e) => {
    if (this.state.amount > 0) {
      let { invoice, invoiceList } = this.state;
      let mobile = localStorage.getItem("mobile").replace("+", "");
      let user = localStorage.getItem("user");
      invoiceList.mobile = localStorage.getItem("mobile").replace("+", "");
      invoiceList.msidn = user != null ? JSON.parse(user).mobile : mobile;
      invoiceList.coupon_amount = 0;
      invoiceList.coupon_name = "";
      invoiceList.total =
        parseFloat(invoiceList.amount) + parseFloat(invoiceList.fee);
      this.setState({
        invoice: !invoice,
        invoiceList,
        isAgree: true,
        isCoupon: true,
      });
    } else {
      message.error("Pleae select amount !");
    }
  };
  openActiveOffer = (e) => {
    let { invoiceList, typeId, rechargeType } = this.state;
    console.log(invoiceList);
    this.setState({ isLoading: true });
    let paymentTypes = typeId;
    if (typeId == 13 && rechargeType == 2) {
      paymentTypes = 14;
    }
    axios
      .post(AppConst.API_URL + "mobile/yemen-active", {
        mobile: localStorage.getItem("mobile").replace("+967", ""),
        serviceType: paymentTypes,
        offer_id: invoiceList.offer_id,
      })
      .then((res) => {
        this.setState({ isLoading: false });
        if (res.data.status) {
          this.setState({
            reachargeSuccess: true,
            reachargeMessage: res.data.message,
            editNo: false,
            mobile: "",
          });
          var self = this;
          setTimeout(() => {
            self.setState({
              reachargeSuccess: false,
              reachargeMessage: "",
              offerModal: {},
            });
          }, 1000);
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        this.setState({ isLoading: false });
      });
  };
  setAmount = (e) => {
    let { invoiceList, rate, fees, apiTypes } = this.state;
    let APIfee = 0;
    if (apiTypes) {
      APIfee = fees[0].fee;
    } else {
      APIfee = fees[1].fee;
    }
    let amt = parseFloat(e.target.value);
    let fee = (amt * APIfee * rate).toFixed(4);
    let total = ((parseFloat(amt) + parseFloat(fee)) * rate).toFixed(4);
    invoiceList.amount = amt;
    invoiceList.fee = fee;
    invoiceList.receive = amt;
    invoiceList.total = total;
    invoiceList.product = "Mobile Recharge (TOP-UP)";
    this.setState({ amount: e.target.value, invoiceList });
  };
  setInv = (key, packageType) => {
    let {
      invoiceList,
      offerModal,
      offerRenewModal,
      amount,
      fees,
      rate,
      apiTypes,
    } = this.state;
    if (packageType == false) {
      offerModal = offerRenewModal;
    }
    let APIfee = 0,
      fee = 0;
    if (apiTypes) {
      APIfee = fees[0].fee;
      fee = (offerModal[key].amount_usd * APIfee).toFixed(2);
      amount = offerModal[key].amount_local;
      invoiceList.receive = amount;
      invoiceList.fee = fee;
      invoiceList.amount = offerModal[key].amount_usd;
      invoiceList.total = offerModal[key].seller_price;
      invoiceList.product = offerModal[key].description;
      invoiceList.offer_id = offerModal[key].offer_id;
    } else {
      APIfee = parseFloat(fees[1].fee);
      amount = parseFloat(offerModal.local_info_value_list.split(",")[key]);
      let amt = parseFloat(offerModal.retail_price_list.split(",")[key]);
      fee = (amt * APIfee).toFixed(4);
      invoiceList.amount = amt;
      invoiceList.fee = fee;
      invoiceList.receive = offerModal.local_info_amount_list.split(",")[key];
      invoiceList.total = (parseFloat(amt) + parseFloat(fee)).toFixed(4);
      invoiceList.product = "Mobile Recharge (TOP-UP)";
      invoiceList.offer_id = "";
    }
    this.setState({
      selectedOfferIndex: key,
      invoiceList,
      amount,
      packageType,
    });
  };

  setRecharge = (value) => {
    var rechargeType = parseInt(value);
    this.setState({ rechargeType: value, package: false, packageQuery: false });
    axios
      .post(AppConst.API_URL + "mobile/yemen-recharge", {
        serviceType: this.state.typeId,
        rechargeType: rechargeType,
        mobile: localStorage.getItem("mobile").replace("+967", ""),
        package: this.state.package,
      })
      .then((res) => {
        this.setState({ isLoading: false });
        if (res.data.status) {
          if (res.data.result.length > 0) {
            this.setState({
              offerModal: res.data.result,
              balanceAmount: "",
              selectedOfferIndex: -1,
            });
          } else {
            this.setState({
              offerModal: [{}],
              balanceAmount: "",
              selectedOfferIndex: -1,
            });
            message.error("Package offer not found");
          }
        } else {
          message.error(res.data.error_txt);
        }
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        message.error("Error getting mobile information!");
      });
  };

  getAnyQuery = (e) => {
    this.setState({ isLoading: true });
    let { rechargeType, typeId } = this.state;
    let paymentTypes = typeId;
    if (typeId == 13 && rechargeType == 2) {
      paymentTypes = 14;
    }
    axios
      .post(AppConst.API_URL + "mobile/yemen-balance", {
        mobile: localStorage.getItem("mobile").replace("+967", ""),
        serviceType: paymentTypes,
      })
      .then((res) => {
        this.setState({ isLoading: false });
        if (res.data.status) {
          let balanceAmount = "";
          if (this.state.typeId === 1 || this.state.typeId === 17) {
            balanceAmount = res.data.data[0];
          } else if (this.state.typeId === 5) {
            balanceAmount =
              res.data.data[1] + "       Expiry Date: " + res.data.data[2];
          } else {
            balanceAmount = res.data.data[0];
          }
          this.setState({ balanceAmount });
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        message.error("Error getting mobile information!");
      });
  };
  setMobileOperators(offerOperators, key) {
    this.setState({ offerOperators: {} });
    localStorage.setItem("operatorid", offerOperators.split(",")[key]);
    this.getMobileInfo();
  }

  getMobileOperators() {
    this.setState({ isLoading: true });
    axios
      .post(AppConst.API_URL + "mobile/operators", {
        countryid: this.state.offerModal.countryid,
      })
      .then((res) => {
        this.setState({ isLoading: false });
        if (res.data.error_code === "0") {
          this.setState({ offerOperators: res.data });
        } else {
          message.error(res.data.error_txt);
        }
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        message.error("Error getting mobile Operators!");
      });
  }
  applyCoupon() {
    let { invoiceList, isCoupon } = this.state;
    invoiceList.coupon_amount = 0;
    invoiceList.coupon_name = "";
    this.setState({ isCoupon: false, invoiceList, couponName: "" });
  }
  setCouponName = (e) => {
    this.setState({ couponName: e.target.value });
  };
  getCoupon() {
    let { invoiceList, couponName } = this.state;
    if (couponName != "") {
      this.setState({ isLoading: true });
      axios
        .get(AppConst.API_URL + "mobile/coupons/" + couponName)
        .then((res) => {
          console.log(res);
          if (res.data.status == true) {
            if (res.data.result.length > 0) {
              let cpn = res.data.result[0];
              if (cpn.rate_type == "1") {
                if (cpn.rate > invoiceList.total) {
                  invoiceList.total = invoiceList.total - cpn.rate;
                  invoiceList.coupon_amount = cpn.rate;
                  invoiceList.coupon_name = couponName;
                  this.setState({ isLoading: false, invoiceList });
                } else {
                  message.error("Coupon not applicable!");
                }
              } else {
                let coupon_amount = (
                  (invoiceList.total * cpn.rate) /
                  100
                ).toFixed(4);
                invoiceList.total = invoiceList.total - coupon_amount;
                invoiceList.coupon_amount = coupon_amount;
                invoiceList.coupon_name = couponName;
                this.setState({ isLoading: false, invoiceList });
                console.log(invoiceList);
              }
            } else {
              this.setState({ isLoading: false });
              message.error("Please enter valid promo code");
            }
          } else {
            message.error(res.data.error_txt);
          }
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          message.error("Error getting coupon!");
        });
    } else {
      message.error("Please enter coupon code!");
    }
  }
  editMobile() {
    this.setState({ offerModal: {}, balanceAmount: "", editNo: false });
  }
  clickProceedBtn() {
    let {
      offerModal,
      apiTypes,
      invoiceList,
      total,
      currency,
      amount,
    } = this.state;
    if (amount > 0) {
      total = invoiceList.total;
      if (apiTypes) {
        if (invoiceList.coupon_amount > 0 && invoiceList.coupon_name != "") {
          this.initiateTopup();
          this.setState({ total, currency, invoice: false });
        } else {
          this.setState({ toggleMenu: true, total, currency, invoice: false });
        }
      } else {
        currency = offerModal.destination_currency;
        if (invoiceList.coupon_amount > 0 && invoiceList.coupon_name != "") {
          this.initiateTopup();
          this.setState({ total, currency, invoice: false });
        } else {
          this.setState({ toggleMenu: true, total, currency, invoice: false });
        }
      }
    } else {
      message.error("Pleae select amount !");
    }
  }
  initiateTopup() {
    this.setState({
      isLoading: true,
      openPayment: false,
      reachargeSuccess: false,
    });
    let {
      apiTypes,
      rechargeType,
      amount,
      packageType,
      typeId,
      currency,
      offerRenewModal,
      selectedOfferIndex,
      offerModal,
      invoiceList,
    } = this.state;
    if (apiTypes) {
      let mobile = localStorage
        .getItem("mobile")
        .replace("+967", "")
        .replace("+", "");
      let user = localStorage.getItem("user");
      let paymentTypes = typeId;
      if (typeId == 13 && rechargeType == 2) {
        paymentTypes = 14;
      }
      let form = {
        mobile: mobile,
        amount_local: amount,
        amount_usd: invoiceList.total,
        seller_price: invoiceList.amount,
        transaction_fee: invoiceList.fee,
        receive: invoiceList.receive,
        coupon_amount: invoiceList.coupon_amount,
        coupon_name: invoiceList.coupon_name,
        discount_margin: 0,
        paymentTypes: paymentTypes,
        name: "",
        offer_id: "",
        currency: currency,
        msidn: user !== null ? JSON.parse(user).mobile : mobile,
        apitypes: "Yemenpost",
      };
      if (selectedOfferIndex != -1) {
        if (packageType == false) {
          offerModal = offerRenewModal;
        }
        form = {
          mobile: mobile,
          amount_local: offerModal[selectedOfferIndex].amount_local,
          transaction_fee: invoiceList.fee,
          seller_price: invoiceList.amount,
          amount_usd: invoiceList.total,
          coupon_amount: invoiceList.coupon_amount,
          coupon_name: invoiceList.coupon_name,
          receive: invoiceList.receive,
          discount_margin: offerModal[selectedOfferIndex].discount_margin,
          paymentTypes: paymentTypes,
          currency: currency,
          name: offerModal[selectedOfferIndex].name,
          offer_id: offerModal[selectedOfferIndex].offer_id,
          msidn: user !== null ? JSON.parse(user).mobile : mobile,
          apitypes: "Yemenpost",
        };
      }
      let url = "mobile/yemen-topup";
      if (!packageType) {
        url = "mobile/yemen-renew";
      }
      axios
        .post(AppConst.API_URL + url, form)
        .then((res) => {
          this.setState({ isLoading: false });
          if (res.data.status) {
            this.setState({
              reachargeSuccess: true,
              reachargeMessage: res.data.message,
              mobile: "",
              packageQuery: false,
            });
            var self = this;
            setTimeout(() => {
              self.setState({
                reachargeSuccess: false,
                reachargeMessage: "",
                editNo: false,
                offerModal: {},
              });
            }, 1000);
            message.success(res.data.reachargeMessage);
          } else {
            message.error(res.data.message);
          }
        })
        .catch((err) => {
          this.setState({ isLoading: false });
        });
    } else {
      axios
        .post(AppConst.API_URL + "mobile/topup", {
          mobile: localStorage.getItem("mobile"),
          msidn:
            localStorage.getItem("user") !== null
              ? JSON.parse(localStorage.getItem("user")).mobile
              : localStorage.getItem("mobile"),
          product: offerModal.product_list.split(",")[selectedOfferIndex],
          apitypes: "Airtime",
          coupon_amount: invoiceList.coupon_amount,
          coupon_name: invoiceList.coupon_name,
        })
        .then((res) => {
          this.setState({ isLoading: false });
          if (res.data.status) {
            this.setState({
              reachargeSuccess: true,
              reachargeMessage: res.data.message,
              editNo: false,
              mobile: "",
            });
            var self = this;
            setTimeout(() => {
              self.setState({
                reachargeSuccess: false,
                reachargeMessage: "",
                offerModal: {},
              });
            }, 1000);
          } else {
            message.error(res.data.message);
          }
        })
        .catch((err) => {
          this.setState({ isLoading: false });
        });
    }
  }

  render() {
    const { modalState } = this.context;
    const arabic = modalState.language === "ar";
    let {
      balanceAmount,
      couponName,
      isCoupon,
      rechargeType,
      reachargeMessage,
      isAgree,
      packageType,
      offerRenewModal,
      invoice,
      invoiceList,
      packageQuery,
      apiTypes,
      typeId,
      offerModal,
      total,
      currency,
      paymentTypes,
      offerOperators,
      displayError,
      isLoading,
      selectedOfferIndex,
    } = this.state;
    return (
      <React.Fragment>
        {displayError.length > 0 ? <ErrorMsg text="" /> : null}
        <MDL
          className={arabic ? "arabic" : ""}
          footer={false}
          visible={
            this.state.reachargeSuccess ||
            this.state.toggleMenu ||
            this.state.invoice
          }
          onCancel={() => {
            this.setState({
              reachargeSuccess: false,
              toggleMenu: false,
              invoice: false,
              isAgree: false,
            });
          }}
          title={""}
        >
          {this.state.reachargeSuccess && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircleOutlineRoundedIcon
                style={{ color: "green", fontSize: "100px" }}
                fontSize="100px"
                color="green"
              />
              <span style={{ color: "green", fontSize: "2em" }}>
                {reachargeMessage}
              </span>
            </div>
          )}
          {this.state.invoice == true && (
            <>
              <div>
                <br></br>
                <h2 id="simple-modal-title">
                  {arabic ? "تأكيد الطلب" : "Order Confirmation"}
                </h2>
                <hr style={{ width: "100%", float: "left" }} />
                <p>
                  <span className="invoice-item">
                    {arabic ? "أرسل إلى:" : "Send To:"}
                  </span>
                  <span className="invoice-item-right">
                    {invoiceList.mobile}
                  </span>
                </p>
                <p>
                  <span className="invoice-item">
                    {arabic ? "الشبكة:" : "Operator:"}
                  </span>
                  <span className="invoice-item-right">
                    {apiTypes
                      ? this.state.invoiceList.paymentName
                      : offerModal.operator}
                  </span>{" "}
                </p>
                <p>
                  <span className="invoice-item">
                    {arabic ? "الدولة:" : "Country:"}
                  </span>
                  <span className="invoice-item-right">
                    {" "}
                    {apiTypes ? "Yemen" : offerModal.country}
                  </span>
                </p>
                <hr style={{ width: "100%", float: "left" }} />
                <p>
                  <span className="invoice-item">
                    {arabic ? "الاستلام:" : "Receive:"}
                  </span>
                  <span className="invoice-item-right">
                    {apiTypes ? "YER" : offerModal.local_info_currency}{" "}
                    {invoiceList.receive}
                  </span>
                </p>
                <hr style={{ width: "100%", float: "left" }} />
                <p>
                  <span className="invoice-item">
                    {arabic ? "المنتج:" : "Product : "}
                  </span>
                  <span className="invoice-item-right">
                    {invoiceList.product}
                  </span>
                </p>
                <p>
                  <span className="invoice-item">
                    {arabic ? "السعر:" : "Amount :"}
                  </span>
                  <span className="invoice-item-right">
                    USD ${invoiceList.amount}
                  </span>
                </p>
                <p>
                  <span className="invoice-item">
                    {arabic ? "العمولة:" : "Process Fee :"}
                  </span>
                  <span className="invoice-item-right">
                    USD ${invoiceList.fee}
                  </span>{" "}
                </p>
                {invoiceList.coupon_name != "" && (
                  <p>
                    <span className="invoice-item">
                      {arabic ? "الخصم" : "Applied Amount"}
                    </span>
                    <span className="invoice-item-right">
                      ${invoiceList.coupon_amount}
                    </span>{" "}
                  </p>
                )}
                <p>
                  <span className="invoice-item">
                    {arabic ? "المجموع:" : "Total :"}
                  </span>
                  <span className="invoice-item-right">
                    USD ${invoiceList.total}
                  </span>
                </p>
                <hr style={{ width: "100%", float: "left" }} />
                <div className="clearflex"></div>
                {isCoupon == true && invoiceList.coupon_name == "" && (
                  <p
                    onClick={() => {
                      this.applyCoupon();
                    }}
                    style={{
                      textAlign: "center",
                      fontSize: 13,
                      color: "#27a1f7f2",
                      cursor: "pointer",
                    }}
                  >
                    {arabic ? "لديك كود للخصم؟" : "Have promo code?"}
                  </p>
                )}
                {isCoupon == false && invoiceList.coupon_name == "" && (
                  <>
                    <input
                      type="text"
                      className="coupon-input"
                      title="Enter coupon code"
                      onChange={this.setCouponName}
                      placeholder={
                        arabic ? "ادخل كود الخصم" : "Enter promo code"
                      }
                    />
                    <button
                      disabled={couponName == ""}
                      type="button"
                      style={{
                        marginRight: arabic ? "15px" : "",
                      }}
                      onClick={() => {
                        this.getCoupon();
                      }}
                    >
                      {isLoading ? (
                        <div style={{ height: 25, width: 120 }}>
                          <img
                            src={loading}
                            alt="loading"
                            height={18}
                            width={18}
                          />
                        </div>
                      ) : arabic ? (
                        "تفعيل كود الخصم"
                      ) : (
                        "Apply promo code"
                      )}
                    </button>
                  </>
                )}
                {invoiceList.coupon_name != "" && (
                  <p
                    style={{
                      fontSize: 13,
                      color: "#27a1f7f2",
                      cursor: "pointer",
                    }}
                  >
                    <span className="invoice-item">
                      {arabic ? "تم تفعيل كود الخصم" : "Applied promo code"}
                    </span>
                    <span className="invoice-item-right">
                      {invoiceList.coupon_name}
                    </span>{" "}
                  </p>
                )}
                <div className="clearflex"></div>
                <hr style={{ width: "100%", float: "left" }} />
                <strong>
                  <input
                    onChange={() => {
                      this.agreeBtn();
                    }}
                    type="checkbox"
                  />{" "}
                  {arabic
                    ? 'انا أوافق على أني لا استطيع إلغاء العملية أو تغير رقم الهاتف الخاص بالعملية بمجرد أن تظهر حالة العملية ك"كعملية تامة"'
                    : 'I agree that I can\'t cancel the payment OR Modify the phone number to whom the service is sent to once its status shows"Completed"'}
                </strong>
                <div className="clearflex"></div>
                <Button
                  variant="contained"
                  disabled={isAgree}
                  className="proceedbtn"
                  type="button"
                  style={{
                    width: "fit-content",
                  }}
                  onClick={() => {
                    this.clickProceedBtn();
                  }}
                >
                  {isLoading ? (
                    <div style={{ height: 40, width: 160 }}>
                      <img src={loading} alt="loading" height={30} width={30} />
                    </div>
                  ) : arabic ? (
                    "اتمم العملية (ادفع)"
                  ) : (
                    "Checkout (Pay)"
                  )}
                </Button>
              </div>
            </>
          )}
          {this.state.toggleMenu && (
            <Payment
              currency={currency}
              total={total}
              processTopup={() => this.initiateTopup()}
            />
          )}
        </MDL>

        <div
          id="topuptoday"
          className={arabic ? "continar arabic" : "continar"}
        >
          <h2 className="modalSpan">
            <img className="img-mobile" src={mobile} alt="mobile" />
            {arabic ? "اشحن رصيد إلى: " : "Send Recharge To:"}
          </h2>
          {this.state.editNo ? (
            <>
              <>
                <div className="send-details">
                  <p>
                    <span className="sum-label">
                      {arabic ? "الرقم:" : "Number: "}
                    </span>
                    <span className="view-mobile">
                      {localStorage.getItem("mobile")}
                    </span>{" "}
                    <img
                      width="16"
                      onClick={() => {
                        this.editMobile();
                      }}
                      style={{
                        float: arabic ? "left" : "right",
                        cursor: "pointer",
                      }}
                      src={img}
                      alt="edit"
                    />
                  </p>
                  {apiTypes ? null : (
                    <>
                      <p>
                        <span className="sum-label">
                          {arabic ? "الدولة:" : "Countrt: "}
                        </span>
                        <span className="view-mobile">
                          {apiTypes ? (
                            "Yemen"
                          ) : (
                            <>
                              {" "}
                              {offerModal.country}{" "}
                              <img
                                width="16"
                                onClick={() => {
                                  this.editMobile();
                                }}
                                style={{
                                  float: arabic ? "left" : "right",
                                  cursor: "pointer",
                                }}
                                src={img}
                                alt="edit"
                              />
                            </>
                          )}
                        </span>
                      </p>
                    </>
                  )}
                  {apiTypes ? (
                    <div>
                      {apiTypes && typeId != 13 && typeId != 18 ? (
                        <p>
                          {" "}
                          <span className="sum-label">
                            {arabic ? "الرصيد:" : "Balance:"}
                          </span>{" "}
                          <span
                            className="view-mobile"
                            style={{ color: "#069625" }}
                          >
                            {balanceAmount}
                          </span>{" "}
                          <>
                            <button
                              type="button"
                              style={{
                                float: "right",
                                cursor: "pointer",
                                marginRight: 10,
                                boxShadow: "#cccccc 0px 0px 10px",
                              }}
                              onClick={this.getAnyQuery}
                            >
                              {isLoading ? (
                                <div style={{ height: 25, width: 225 }}>
                                  <img
                                    src={loading}
                                    alt="loading"
                                    height={18}
                                    width={18}
                                  />
                                </div>
                              ) : (
                                "Check Balance(الرصيد الحالي)"
                              )}
                            </button>
                          </>{" "}
                          <div className="clearflex"></div>
                        </p>
                      ) : null}
                      <p>
                        <span className="sum-label">
                          {arabic ? "اختر مقدم الخدمة:" : "Choose Carrier:"}
                        </span>
                        <select
                          className="sum-input-payment"
                          onChange={this.setMobileTypeId}
                          name="payment_types"
                        >
                          {paymentTypes.length > 0
                            ? paymentTypes.map((item, key) => {
                                return (
                                  <option
                                    selected={
                                      item.id === typeId ? "selected" : ""
                                    }
                                    key={key}
                                    value={item.id}
                                  >
                                    {item.name}
                                  </option>
                                );
                              })
                            : null}
                        </select>
                        {typeId === 1 && (
                          <img className="img-carrier" src={one} alt="one" />
                        )}
                        {typeId === 4 && (
                          <img className="img-carrier" src={four} alt="four" />
                        )}
                        {typeId === 5 && (
                          <img className="img-carrier" src={five} alt="five" />
                        )}
                        {typeId === 13 && (
                          <img
                            className="img-carrier"
                            src={thirteen}
                            alt="thirteen"
                          />
                        )}
                        {typeId === 17 && (
                          <img
                            className="img-carrier"
                            src={seventeen}
                            alt="seventeen"
                          />
                        )}
                        {typeId === 18 && (
                          <img
                            className="img-carrier"
                            src={eighteen}
                            alt="eighteen"
                          />
                        )}
                      </p>
                      {offerModal.length > 0 && typeId != 4 && typeId != 5 && (
                        <p>
                          <span className="sum-label">
                            {arabic ? "اختر الخدمة:" : "Choose Service:"}
                          </span>
                          <div className="service-div">
                            {typeId != 5 && (
                              <div
                                onClick={() => this.setRecharge(1)}
                                className="service"
                                style={{
                                  boxShadow:
                                    rechargeType === 1
                                      ? "0px 1px 7px rgb(255, 177, 3)"
                                      : "0px 1px 2px rgb(131, 93, 9)",
                                }}
                              >
                                <img
                                  className="img-service"
                                  src={topup}
                                  alt="Top-Up"
                                />
                                <span className="names">Top-UP</span>
                              </div>
                            )}
                            <div
                              onClick={() => this.setRecharge(2)}
                              className="service"
                              style={{
                                boxShadow:
                                  rechargeType === 2
                                    ? "0px 1px 7px rgb(255, 177, 3)"
                                    : "0px 1px 2px rgb(131, 93, 9)",
                              }}
                            >
                              <img
                                className="img-service"
                                src={inertnet}
                                alt="Inertnet"
                              />
                              <span className="names">
                                {arabic ? "انترنت" : "INTERNET"}
                              </span>
                            </div>
                          </div>
                          {/* <select className="sum-input" onChange={this.setRecharge} name="recharge_type" >
                                                {typeId != 5 && (<option selected={1 === offerModal[0].recharge_type ? 'selected' : ''} value="1">Top-UP</option>)}
                                                <option selected={2 === offerModal[0].recharge_type ? 'selected' : ''} value="2">Bundle</option>
                                            </select> */}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p>
                        <span className="sum-label">
                          {" "}
                          {arabic ? "الشبكة:" : "Operator: "}
                        </span>
                        <span className="view-mobile">
                          {offerModal.operator}
                        </span>{" "}
                        <img
                          width="16"
                          onClick={() => {
                            this.getMobileOperators();
                          }}
                          style={{
                            float: arabic ? "left" : "right",
                            cursor: "pointer",
                          }}
                          src={img}
                          alt="edit"
                        />
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flexFlow: "wrap",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {Object.keys(offerOperators).length > 0
                          ? offerOperators.operator
                              .split(",")
                              .map((itm, key) => {
                                return (
                                  <div
                                    onClick={() =>
                                      this.setMobileOperators(
                                        offerOperators.operatorid,
                                        key
                                      )
                                    }
                                    style={{
                                      width: "25%",
                                      height: "60px",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      display: "flex",
                                      flexDirection: "column",
                                      boxShadow:
                                        selectedOfferIndex === key
                                          ? "0px 1px 7px rgb(255, 177, 3)"
                                          : "0px 1px 2px rgb(131, 93, 9)",
                                      borderRadius: "15px",
                                      margin: "2%",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: "100%",
                                        textAlign: "center",
                                      }}
                                    >
                                      {itm}
                                    </span>
                                  </div>
                                );
                              })
                          : null}
                      </div>
                    </div>
                  )}
                  <p>
                    <span className="sum-label">
                      {arabic ? "الرصيد:" : "Amount:"}
                    </span>
                    <input
                      type="text"
                      className="sum-input"
                      readOnly
                      title="Amount in  YER"
                      onChange={this.setAmount}
                      placeholder="Enter recharge amount"
                      value={this.state.amount}
                      name="amount"
                    />
                  </p>
                  <p>
                    {apiTypes && rechargeType == 2 && typeId == 5 ? (
                      <>
                        <button
                          type="button"
                          style={{
                            float: "right",
                            cursor: "pointer",
                            marginBottom: 20,
                            marginTop: 20,
                          }}
                          onClick={this.getPackageQuery}
                        >
                          {" "}
                          {isLoading ? (
                            <div style={{ height: 25, width: 230 }}>
                              <img
                                src={loading}
                                alt="loading"
                                height={18}
                                width={18}
                              />
                            </div>
                          ) : (
                            "CURRENT BAGAT (الباقات الحالية)."
                          )}
                        </button>
                        {/* <button type="button" style={{ float: 'right', cursor: "pointer", marginBottom: 20, marginTop: 20 }} onClick={this.openInvoice}>{invoice === false ? "Invoice Open" : "Invoice Close"}</button> */}
                      </>
                    ) : null}
                  </p>
                </div>
                <div className="clearflex"></div>
                <h2 className="modalSpan">
                  <img className="img-mobile" src={mdollor} alt="mdollor" />
                  {arabic ? "اختر الباقة:" : "Choose Product:"}
                  <Button
                    disabled={this.state.amount == 0}
                    variant="contained"
                    className={
                      arabic ? "proceedbtn btn-left" : "proceedbtn btn-right"
                    }
                    type="button"
                    onClick={this.openInvoice}
                  >
                    {isLoading ? (
                      <div style={{ height: 40, width: 150 }}>
                        <img
                          src={loading}
                          alt="loading"
                          height={30}
                          width={30}
                        />
                      </div>
                    ) : packageType ? (
                      arabic ? (
                        "اشتر الآن"
                      ) : (
                        "BUY NOW"
                      )
                    ) : arabic ? (
                      "تجديد"
                    ) : (
                      "RENEW"
                    )}
                  </Button>
                  {rechargeType == 2 &&
                    typeId != 13 &&
                    localStorage.getItem("user") != null && (
                      <button
                        disabled={this.state.amount == 0}
                        className="proceedbtn btn-right"
                        type="button"
                        onClick={this.openActiveOffer}
                      >
                        {isLoading ? (
                          <div style={{ height: 40, width: 150 }}>
                            <img
                              src={loading}
                              alt="loading"
                              height={30}
                              width={30}
                            />
                          </div>
                        ) : (
                          "ACTIVE NOW"
                        )}
                      </button>
                    )}
                  <div className="clearflex"></div>
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexFlow: "wrap",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    maxHeight: 300,
                    minHeight: 100,
                    overflowY: "auto",
                  }}
                  className="special-container"
                >
                  {apiTypes ? (
                    <>
                      {offerModal.length > 0
                        ? offerModal.map((itm, key) => {
                            return (
                              <div
                                key={key}
                                onClick={() => this.setInv(key, true)}
                                className="package"
                                style={{
                                  boxShadow:
                                    selectedOfferIndex === key
                                      ? "0px 1px 7px rgb(255, 177, 3)"
                                      : "0px 1px 2px rgb(131, 93, 9)",
                                }}
                              >
                                <span
                                  style={{
                                    color: "deepblue",
                                    fontSize: "1.3em",
                                  }}
                                >
                                  YER {itm.amount_local}
                                </span>
                                <span
                                  style={{
                                    color: "deepblue",
                                    fontSize: "1.3em",
                                  }}
                                >
                                  USD {itm.amount_usd}
                                </span>
                                <span style={{ textAlign: "center" }}>
                                  {itm.description}
                                </span>
                              </div>
                            );
                          })
                        : null}
                    </>
                  ) : (
                    <>
                      {Object.keys(offerModal).length > 0
                        ? offerModal.product_list.split(",").map((itm, key) => {
                            return (
                              <div
                                key={key}
                                onClick={() => this.setInv(key, true)}
                                className="package"
                                style={{
                                  boxShadow:
                                    selectedOfferIndex === key
                                      ? "0px 1px 7px rgb(255, 177, 3)"
                                      : "0px 1px 2px rgb(131, 93, 9)",
                                }}
                              >
                                <span
                                  style={{
                                    color: "deepblue",
                                    fontSize: "1.3em",
                                  }}
                                >
                                  {offerModal.local_info_currency} {itm}
                                </span>
                                <span>
                                  USD{" "}
                                  {offerModal.retail_price_list.split(",")[key]}
                                </span>
                                <span>
                                  Talk Time:{" "}
                                  {offerModal.local_info_amount_list.split(",")[
                                    key
                                  ] +
                                    " " +
                                    offerModal.local_info_currency}
                                </span>
                              </div>
                            );
                          })
                        : null}
                    </>
                  )}
                </div>
                {packageQuery && offerRenewModal.length > 0 && (
                  <>
                    <h2 className="modalSpan">Active Offers</h2>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexFlow: "wrap",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        maxHeight: 300,
                        minHeight: 100,
                        overflowY: "auto",
                      }}
                    >
                      {offerRenewModal.length > 0
                        ? offerRenewModal.map((itm, key) => {
                            return (
                              <div
                                key={key}
                                onClick={() => this.setInv(key, false)}
                                className="package"
                                style={{
                                  boxShadow:
                                    selectedOfferIndex === key
                                      ? "0px 1px 7px rgb(255, 177, 3)"
                                      : "0px 1px 2px rgb(131, 93, 9)",
                                }}
                              >
                                <span
                                  style={{
                                    color: "deepblue",
                                    fontSize: "1.3em",
                                  }}
                                >
                                  YER {itm.amount_local}
                                </span>
                                <span
                                  style={{
                                    color: "deepblue",
                                    fontSize: "1.3em",
                                  }}
                                >
                                  USD {itm.amount_usd}
                                </span>
                                <span style={{ textAlign: "center" }}>
                                  {itm.description}
                                </span>
                              </div>
                            );
                          })
                        : null}
                    </div>
                  </>
                )}
              </>
              <div className="proceed-div"></div>
              <div className="clearflex"></div>
            </>
          ) : (
            <>
              <div className="search-no">
                <PhoneInput
                  lang={modalState.language}
                  onChange={this.setValue}
                />
                <Button
                  type="button"
                  variant="contained"
                  startIcon={<AddShoppingCart />}
                  className={arabic ? "proceedbtn btn-left" : "proceedbtn"}
                  disabled={isLoading}
                  onClick={this.getMobileInfo.bind(this)}
                >
                  {isLoading ? (
                    <div style={{ height: 40, width: 150 }}>
                      <img src={loading} alt="loading" height={30} width={30} />
                    </div>
                  ) : arabic ? (
                    "تقديم"
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
              <div className="clearflex"></div>
            </>
          )}
        </div>
      </React.Fragment>
    );
  }
}
