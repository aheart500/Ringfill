import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Table, Modal } from "antd";
import axios from "axios";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ModalContext from "../../context/modalContext/ModalContext";
import "./style.css";
import AppConst from "../../constants";
var dateFormat = require("dateformat");

class transactions extends Component {
  static contextType = ModalContext;
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      transView: {},
      isLoading: false,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    axios
      .post(AppConst.API_URL + "mobile/transactions", {
        id: JSON.parse(localStorage.getItem("user")).id,
        msidn: JSON.parse(localStorage.getItem("user")).mobile,
      })
      .then((res) => {
        this.setState({ isLoading: false });
        if (res.data.status) {
          this.setState({ transactions: res.data.result });
        }
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  }
  transModal(row, ind) {
    if (row.operator == "17") {
      row.operator = "Y Telecom";
    } else if (row.operator == "18") {
      row.operator = "Sabafon";
    } else if (row.operator == "13" || row.operator == "14") {
      row.operator = "MTN";
    } else if (row.operator == "1") {
      row.operator = "Yemen Mobile";
    } else if (row.operator == "5") {
      row.operator = "ADSL";
    } else if (row.operator == "4") {
      row.operator = "Land Line";
    }
    this.setState({ transView: row, trans: true });
  }
  render() {
    const { modalState } = this.context;
    const arabic = modalState.language === "ar";
    let { transactions, isLoading, transView } = this.state;
    const colmns = arabic
      ? [
          {
            title: "كود المعاملة",
            key: "transactionid",
            dataIndex: "transactionid",
          },
          {
            title: "التاريخ",
            render: (txt, row, ind) => (
              <>{dateFormat(row.created, "mm/dd/yyyy h:MM TT")}</>
            ),
          },

          {
            title: "رقم المستلم",
            key: "destination_msisdn",
            dataIndex: "destination_msisdn",
          },
          {
            title: "السعر",
            key: "retail_price",
            dataIndex: "retail_price",
          },
          {
            title: "التكلفة",
            key: "wholesale_price",
            dataIndex: "wholesale_price",
          },
          {
            title: "الحالة",
            render: (txt, row, ind) => (
              <>
                {row.status == 0
                  ? "ناجحة"
                  : row.status == 1
                  ? "تم التوصيل"
                  : row.status == 3
                  ? "لم تتم"
                  : "فشل"}
              </>
            ),
            key: "status",
            dataIndex: "status",
          },
          {
            title: "التفاصيل",
            render: (txt, row, ind) => (
              <>
                <a
                  type="primary"
                  className="mr-1"
                  size="small"
                  onClick={(e) => this.transModal(row, ind)}
                >
                  عرض
                </a>
              </>
            ),
          },
        ]
      : [
          {
            title: "TRX ID",
            key: "transactionid",
            dataIndex: "transactionid",
          },
          {
            title: "DATE",
            render: (txt, row, ind) => (
              <>{dateFormat(row.created, "mm/dd/yyyy h:MM TT")}</>
            ),
          },

          {
            title: "DEST. NO.",
            key: "destination_msisdn",
            dataIndex: "destination_msisdn",
          },
          {
            title: "AMOUNT USD",
            key: "retail_price",
            dataIndex: "retail_price",
          },
          {
            title: "COST PRICE",
            key: "wholesale_price",
            dataIndex: "wholesale_price",
          },
          {
            title: "STATUS",
            render: (txt, row, ind) => (
              <>
                {row.status == 0
                  ? "Success"
                  : row.status == 1
                  ? "Delivered"
                  : row.status == 3
                  ? "Not Complete"
                  : "Failure"}
              </>
            ),
            key: "status",
            dataIndex: "status",
          },
          {
            title: "Actions",
            render: (txt, row, ind) => (
              <>
                <a
                  type="primary"
                  className="mr-1"
                  size="small"
                  onClick={(e) => this.transModal(row, ind)}
                >
                  View
                </a>
              </>
            ),
          },
        ];
    return (
      <div style={{ padding: "2em", direction: arabic ? "rtl" : "ltr" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <h2
            style={{
              width: "100%",
              fontSize: 16,
              backgroundColor: "#ffce60",
              padding: 10,
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
          >
            {arabic ? "المعاملات" : "Transactions"}
          </h2>
        </div>
        {isLoading ? (
          <Loader type="TailSpin" color="yellow" height={30} width={80} />
        ) : (
          <div className={arabic ? "arabic" : ""}>
            {transactions.length > 0 ? (
              <>
                <Table columns={colmns} dataSource={transactions} bordered />
                <Modal
                  visible={this.state.trans}
                  onCancel={() => {
                    this.setState({ transView: {}, trans: false });
                  }}
                  footer={[]}
                >
                  <div id="transprint" className={arabic ? "arabic" : ""}>
                    <h2 style={{ textAlign: "center" }}>
                      <strong>
                        {arabic ? "تفاصيل العملية" : "TRANSACTION INFORMATION"}
                      </strong>
                    </h2>
                    <p className="lbl-lft-p">
                      <span className="lbl-lft">
                        {arabic ? "كود العملية" : "Transaction ID"}
                      </span>
                      {transView.transactionid}{" "}
                    </p>
                    <p className="lbl-lft-p">
                      <span className="lbl-lft">
                        {arabic ? "الحالة" : "Status"}
                      </span>
                      {transView.status == 0 ? "Success" : "Failure"}{" "}
                    </p>
                    <p className="lbl-lft-p">
                      <span className="lbl-lft">
                        {arabic ? "التاريخ" : "Date"}
                      </span>
                      {transView.created}{" "}
                    </p>
                    <p className="lbl-lft-p">
                      <span className="lbl-lft">
                        {arabic ? "الدولة" : "Country"}
                      </span>
                      {transView.country}{" "}
                    </p>
                    <p className="lbl-lft-p">
                      <span className="lbl-lft">
                        {arabic ? "الشبكة" : "operator"}
                      </span>
                      {transView.operator}{" "}
                    </p>
                    <p className="lbl-lft-p">
                      <span className="lbl-lft">
                        {arabic ? "رقم المستلم" : "Destination No."}
                      </span>
                      {transView.destination_msisdn}{" "}
                    </p>
                    <p className="lbl-lft-p">
                      <span className="lbl-lft">
                        {arabic ? "نوع الباقة" : "Product Type"}
                      </span>
                      {"TopUp"}{" "}
                    </p>
                    <p className="lbl-lft-p">
                      <span className="lbl-lft">
                        {arabic ? "تفاصيل" : "TopUp Details"}
                      </span>
                      {transView.actual_product_sent}{" "}
                    </p>
                    <p className="lbl-lft-p">
                      <span className="lbl-lft">
                        {arabic ? "الرصيد المستلم" : "Amount Receive"}
                      </span>
                      {transView.product_requested}{" "}
                    </p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <a onClick={() => window.print()}>
                      {arabic ? "اطبع الفاتورة" : "Print Receipt"}
                    </a>
                  </div>
                  <div className="clearboth"></div>
                </Modal>
              </>
            ) : (
              <span>
                {arabic ? "لا توجد معاملات!" : "No transactions found!"}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
}
//  transactions.map(item=>{
//       return <div className="transaction" onClick={()=>{this.props.history.push("/account/transactions/"+item.transactionid)}}>{item.transactionid}</div>
// })
export default withRouter(transactions);
