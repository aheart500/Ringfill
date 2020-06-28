import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home/Home";
import Recharge from "./components/Home/Recharge";
import Account from "./components/Account/Account";
import Transactions from "./components/Account/transactions";
import TransactionDetails from "./components/Account/transaction_details";
import ModalState from "./context/modalContext/ModalState";
import UserState from "./context/userContext/UserState";

function App() {
  return (
    <UserState>
      <ModalState>
        <Router>
          <Navbar
            onRef={(rf) => {
              console.log("rrr", rf);
            }}
          />
          <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute exact path="/account" component={Account} />
            <PrivateRoute exact path="/recharge" component={Recharge} />
            <PrivateRoute
              exact
              path="/account/transactions"
              component={Transactions}
            />
            <PrivateRoute
              exact
              path="/account/transactions/:id"
              component={TransactionDetails}
            />
          </Switch>
          <Footer />
        </Router>
      </ModalState>
    </UserState>
  );
}

export default App;
