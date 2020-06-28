import React, { Component } from "react";

import { message, Button } from "antd";
import axios from "axios";
import { withRouter, Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import { Collapse } from 'antd';
import Loader from 'react-loader-spinner';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
const { Panel } = Collapse;


const cookies = new Cookies();

class Payment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      paypalMode: true,
      cardInfo: {},
      disabled: false,
      completed:false
    }
  }

  makePayment() {
    this.setState({completed:true})
    this.props.processTopup();

  }

  render() {
    let { cardInfo } = this.state;
    const client = {
      sandbox: 'Ad19iPRGbCIVyqRQpuj4mulYeGdiEnfNgpYFaYnDawaflTkQ140oTuuUFoX3CUqLzaHAe1RvwF5jHzPp',
    }
    const onSuccess = (payment) => {
      // Congratulation, it came here means everything's fine!
      console.log("The payment was succeeded!", payment);
      message.success('The payment was succeeded!', 1)
      
      this.makePayment()
      // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
    }

    const onCancel = (data) => {
      // User pressed "cancel" or close Paypal's popup!
      message.error('The payment was cancelled!', 1)
      console.log('The payment was cancelled!', data);
      // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
    }

    const onError = (err) => {
      message.error('Error while proceeding with payment', 1)
      // The main Paypal's script cannot be loaded or somethings block the loading of that script!
      console.log("Error!", err);
      // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
      // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
    }

    let env = 'sandbox'; // you can set here to 'production' for production
    let currency = 'USD'; // or you can set this value from your props or state
    
    if(this.state.completed){
    return(<React.Fragment><div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',width:'100%'}}><Loader type="TailSpin" color="orange" height={50} width={90} /><b>Initiating Reacharge...</b></div></React.Fragment>)
    }
    else
    return (
      <React.Fragment>
        <div id="wrapper">
          <div className="clearfix" />
          <div id="titlebar" className="gradient">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <h2>Checkout</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-xl-6 col-lg-6 content-right-offset">
                <div className="boxed-widget summary margin-top-0">
                  {/* <div className="boxed-widget-headline">
                    <h3>Summary</h3>
                  </div>
                  <div className="boxed-widget-inner">
                    <ul>
                      <li>
                        Standard Plan <span>${payInfo.serviceId ? parseFloat(payInfo.vendorInfo[0].jobs[payInfo.vendorInfo[0].jobs.findIndex(x => x.name === payInfo.serviceId)].price) : null}</span>
                      </li>
                      <li>
                        VAT (20%) <span>${payInfo.serviceId ? parseInt(payInfo.vendorInfo[0].jobs[payInfo.vendorInfo[0].jobs.findIndex(x => x.name === payInfo.serviceId)].price) * 20 / 100 : null}</span>
                      </li>
                      <li className="total-costs">
                        Final Price <span>${payInfo.serviceId ? parseInt(payInfo.vendorInfo[0].jobs[payInfo.vendorInfo[0].jobs.findIndex(x => x.name === payInfo.serviceId)].price) + parseInt(payInfo.vendorInfo[0].jobs[payInfo.vendorInfo[0].jobs.findIndex(x => x.name === payInfo.serviceId)].price) * 20 / 100 : null}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="checkbox margin-top-30" style={{ paddingLeft: '30px', paddingBottom: '30px' }}>
                    <input type="checkbox" id="two-step" />
                    <label for="two-step">
                      <span className="checkbox-icon" /> I agree to the{" "}
                      <a href="#">Terms and Conditions</a>
                    </label>
                  </div> */}
                 
                  {true ? <div style={{ paddingLeft: '30px', paddingBottom: '30px' }}><PaypalExpressBtn env={env} client={client} currency={currency} total={parseInt(this.props.total)} onError={onError} onSuccess={onSuccess} onCancel={onCancel} /></div>
                    :
                    <React.Fragment >
                      <div className="payment margin-top-30" style={{ paddingLeft: '30px', paddingBottom: '30px' }}>
                        <div className="payment-tab payment-tab-active">
                          <div className="payment-tab-trigger">
                            <label>Credit / Debit Card</label>
                            <img
                              className="payment-logo"
                              src="myimg/IHEKLgm.png"
                              alt=""
                            />
                          </div>
                          <div className="payment-tab-content">
                            <div className="row payment-form-row">
                              <div className="col-md-6">
                                <div className="card-label">
                                  <input
                                    id="nameOnCard"
                                    name="nameOnCard"
                                    required
                                    type="text"
                                    placeholder="Cardholder Name"
                                    value={cardInfo.name}
                                    onChange={(e) => { cardInfo.name = e.target.value; this.setState({ cardInfo }) }}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="card-label">
                                  <input
                                    id="cardNumber"
                                    name="cardNumber"
                                    placeholder="Credit Card Number"
                                    required
                                    type="text"
                                    onBlur={(e) => { e.target.value.length !== 16 ? message.error('Invalid Card Number', 0.5) : console.log(''); this.setState({ cardInfo }) }}
                                    value={cardInfo.number}
                                    onChange={(e) => { e.target.value.length > 16 ? message.error("Invalid Card Number", 0.9) : cardInfo.number = e.target.value; this.setState({ cardInfo }) }}
                                  />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="card-label">
                                  <input
                                    id="expiryDate"
                                    placeholder="Expiry Month"
                                    required
                                    type="text"
                                    value={cardInfo.month}
                                    onChange={(e) => { e.target.value.length > 2 || parseInt(e.target.value) > 12 ? message.error("Invalid month", 0.9) : cardInfo.month = e.target.value; this.setState({ cardInfo }) }}
                                  />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="card-label">
                                  <label for="expiryDate">Expiry Year</label>
                                  <input
                                    id="expirynDate"
                                    placeholder="Expiry Year"
                                    type="text"
                                    required
                                    value={cardInfo.year}
                                    onChange={(e) => { e.target.value.length > 2 ? message.error("Invalid year", 0.9) : cardInfo.year = e.target.value; this.setState({ cardInfo }) }}

                                  />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="card-label">
                                  <input
                                    id="cvv"
                                    required
                                    type="text"
                                    placeholder="CVV"
                                    value={cardInfo.cvv}
                                    onChange={(e) => { e.target.value.length > 3 ? message.error("Invalid cvv", 0.9) : cardInfo.cvv = e.target.value; this.setState({ cardInfo }) }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                      <a

                        onClick={(e) => { e.preventDefault(); this.state.disabled === false ? this.makePayment() : console.log("") }}
                        href="#"
                        className="button big ripple-effect margin-top-40 margin-bottom-65"
                      >
                        Proceed Payment
                </a>
                    </React.Fragment>}
                </div>
                <br />
              </div>
              <div className="col-xl-6 col-lg-6 margin-top-0 margin-bottom-60">


              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}


export default withRouter(Payment);