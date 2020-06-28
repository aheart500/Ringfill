import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { message, Tabs, Empty } from "antd";
import "./style.css";
import Loader from "react-loader-spinner";
import AppConst from "../../constants";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ModalContext from "../../context/modalContext/ModalContext";
const { TabPane } = Tabs;

export default class Account extends React.Component {
  static contextType = ModalContext;
  constructor(props) {
    super(props);
    this.state = {
      account: {},
      transactions: [],
      contacts: [],
      bannerInmage: "",
      contact: {
        first_name: "",
        last_name: "",
        email: "",
        dob: "",
        mobile: "",
      },
      user: JSON.parse(localStorage.getItem("user")),
      isLoading: false,
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    axios
      .post(AppConst.API_URL + "mobile/transactions", {
        id: JSON.parse(localStorage.getItem("user"))?.id,
        msidn: JSON.parse(localStorage.getItem("user"))?.mobile,
      })
      .then((res) => {
        if (res.data.status) {
          this.setState({ transactions: res.data.result });
        }
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
    axios
      .get(AppConst.API_URL + "user/banners")
      .then((res) => {
        if (res.data.status) {
          this.setState({ bannerInmage: res.data.result[0].imgUel });
        }
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
    this.getContacts();
  }
  getContacts = (e) => {
    axios
      .get(
        AppConst.API_URL +
          "user/contacts/" +
          JSON.parse(localStorage.getItem("user"))?.id
      )
      .then((res) => {
        this.setState({ isLoading: false });
        if (res.data.status) {
          this.setState({ contacts: res.data.result });
        }
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };
  setValue = (e) => {
    let user = this.state.user;
    user[e.target.name] = e.target.value;
    this.setState(user);
  };
  setContact = (e) => {
    let contact = this.state.contact;
    contact[e.target.name] = e.target.value;
    this.setState(contact);
  };
  saveContact = (e) => {
    let contact = this.state.contact;

    if (contact.name != "" && contact.mobile != "") {
      this.setState({ isLoading: true });
      contact.user_id = JSON.parse(localStorage.getItem("user")).id;
      axios
        .post(AppConst.API_URL + "user/addcontact", contact)
        .then((res) => {
          this.setState({ isLoading: false });
          if (res.status == 200) {
            message.success(res.data.message);
            this.getContacts();
          }
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          console.log(err);
        });
    } else {
      message.error("Please fill all field");
    }
  };
  updateProfile = (e) => {
    let user = this.state.user;
    localStorage.setItem("user", JSON.stringify(user));
    if (
      user.first_name != "" &&
      user.mobile != "" &&
      user.email != "" &&
      user.first_name != null &&
      user.mobile != null &&
      user.email != null
    ) {
      this.setState({ isLoading: true });
      let id = JSON.parse(localStorage.getItem("user")).id;
      axios
        .post(AppConst.API_URL + "user/update/" + id, user)
        .then((res) => {
          this.setState({ isLoading: false });
          if (res.status == 200) {
            message.success(res.data.message);
            window.location.reload();
          }
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          console.log(err);
        });
    } else {
      message.error("Please fill all field");
    }
  };
  render() {
    const { modalState } = this.context;
    const arabic = modalState.language === "ar";
    const fieldsText = arabic
      ? [
          "الأسم الأول",
          "الأسم الأحير",
          "رقم الهاتف",
          "البريد الإلكتروني",
          "العنوان",
          "المدينة",
          "الولاية",
          "الرقم البريدي",
          "الدولة",
        ]
      : [
          "First Name",
          "Last Name",
          "Mobile",
          "Email",
          "Address",
          "City",
          "State",
          "Zip code",
          "Country",
        ];
    return (
      <div className="">
        <img
          style={{ width: "80%", marginLeft: "10%" }}
          src={this.state.bannerInmage}
          alt=""
        />
        <Tabs
          defaultActiveKey="1"
          style={{
            position: "relative",
            left: "10%",
            width: "80%",
            textAlign: arabic ? "end" : "",
          }}
        >
          <TabPane
            tab={arabic ? "تفاصيل الحساب" : "Account Details"}
            style={{ textAlign: "left" }}
            key="1"
          >
            <div className="rows" style={{ direction: arabic ? "rtl" : "ltr" }}>
              {this.state.isLoading ? (
                <Loader
                  type="TailSpin"
                  style={{ marginLeft: "2em" }}
                  color="#FFCE60"
                />
              ) : (
                <>
                  <div></div>
                  <div className="rwd">
                    <h5 className="dn-mobile-hide">
                      {arabic
                        ? "إرسال رصيد لرقم جديد"
                        : "Let’s put someones phone back in action"}
                    </h5>
                    <a href="/" className="sent_top_up">
                      {arabic ? "إرسال" : "Sent top-up"}
                    </a>
                  </div>
                  <div className="rwd">
                    <span>
                      {" "}
                      {arabic ? "الطلبات السابقة" : "Purchases made"}
                    </span>{" "}
                    <span>{this.state.transactions.length}</span>
                    <Link to="/account/transactions" className="sent_top_up">
                      {arabic ? "اعرض القائمة" : "View List"}
                    </Link>
                  </div>
                  <div className="rwd">
                    <span>
                      {" "}
                      {arabic ? "الأرقام المحفوظة" : "Saved Numbers"}{" "}
                    </span>{" "}
                    <span>{this.state.contacts.length}</span>
                  </div>
                </>
              )}
            </div>
            <br />
          </TabPane>
          <TabPane
            tab={arabic ? "جهات الاتصال المفضلة" : "Favourite Contacts"}
            style={{ textAlign: "left" }}
            key="2"
          >
            <div className="row" style={{ paddingBottom: "2em" }}>
              <div
                className="add_contact"
                style={{
                  display: "flex",
                  flexDirection: arabic ? "row-reverse" : "row",
                }}
              >
                <input
                  type="text"
                  onChange={this.setContact}
                  placeholder={arabic ? "ادخل الاسم" : "Enter Name"}
                  style={{ textAlign: arabic ? "right" : "left" }}
                  name="name"
                />
                <input
                  type="date"
                  onChange={this.setContact}
                  placeholder="DOB"
                  style={{ textAlign: arabic ? "right" : "left" }}
                  name="dob"
                />
                <input
                  type="text"
                  onChange={this.setContact}
                  placeholder={arabic ? "ادخل رقم الهاتف" : '"Enter Mobile No"'}
                  style={{ textAlign: arabic ? "right" : "left" }}
                  name="mobile"
                />
                <button
                  style={{
                    margin: "0 auto",
                    color: "black",
                    cursor: "pointer",
                    width: 80,
                    padding: 6,
                  }}
                  onClick={this.saveContact}
                >
                  {arabic ? "احفظ" : "Save"}
                </button>
              </div>
              <span>
                {this.state.contacts.length > 0 ? (
                  <div>
                    <table
                      border="1"
                      style={{
                        width: "100%",
                        borderBlockColor: "#ececec",
                        marginTop: 50,
                      }}
                    >
                      <thead>
                        <tr>
                          <th>{arabic ? "الاسم" : "Name"}</th>
                          <th>{arabic ? "رقم الهاتف" : "Mobile No"}</th>
                          <th>DOB</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.contacts.map((item) => {
                          return (
                            <tr key={item.id}>
                              <td>{item.name}</td>
                              <td>{item.mobile}</td>
                              <td>{item.dob}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Empty
                    image="/emoty.png"
                    imageStyle={{
                      height: 250,
                    }}
                    description={
                      <span style={{ fontSize: "1.9em" }}>
                        {arabic
                          ? "كل الجهات المفضلة الخاصة بك ستظهر هنا"
                          : "All your favuorite contacts will appear here"}
                      </span>
                    }
                  />
                )}
              </span>
            </div>
          </TabPane>
          <TabPane
            tab={arabic ? "حسابي" : "My Profile"}
            style={{ textAlign: "left" }}
            key="3"
          >
            <div
              className="row"
              style={{
                paddingBottom: "2em",
              }}
            >
              <div className="loginForm">
                <div
                  className={arabic ? "col-6 arabic-fields" : "col-6"}
                  style={{ float: arabic ? "right" : "left" }}
                >
                  <div className="fields">
                    <label className="fieldlabels" htmlFor="mn">
                      {fieldsText[0]}
                    </label>
                    <input
                      value={this.state.user.first_name}
                      onChange={this.setValue}
                      placeholder={fieldsText[0]}
                      name="first_name"
                    />
                  </div>
                  <div className="fields">
                    <label className="fieldlabels" htmlFor="mn">
                      {fieldsText[1]}
                    </label>
                    <input
                      value={this.state.user.last_name}
                      onChange={this.setValue}
                      placeholder={fieldsText[1]}
                      name="last_name"
                    />
                  </div>
                  <div className="fields">
                    <label className="fieldlabels" htmlFor="mn">
                      {fieldsText[2]}
                    </label>
                    <input
                      readOnly
                      value={this.state.user.mobile}
                      placeholder={fieldsText[2]}
                      name="mobile"
                    />
                  </div>
                  <div className="fields">
                    <label className="fieldlabels" htmlFor="mn">
                      {fieldsText[3]}
                    </label>
                    <input
                      value={this.state.user.email}
                      onChange={this.setValue}
                      placeholder={fieldsText[3]}
                      name="email"
                    />
                  </div>
                  <div className="fields">
                    <label className="fieldlabels" htmlFor="mn">
                      {fieldsText[4]}
                    </label>
                    <input
                      value={this.state.user.address}
                      onChange={this.setValue}
                      placeholder={fieldsText[4]}
                      name="address"
                    />
                  </div>
                </div>
                <div className={arabic ? "col-6 arabic-fields" : "col-6"}>
                  <div className="fields">
                    <label className="fieldlabels" htmlFor="mn">
                      {fieldsText[5]}
                    </label>
                    <input
                      value={this.state.user.city}
                      onChange={this.setValue}
                      placeholder={fieldsText[5]}
                      name="city"
                    />
                  </div>
                  <div className="fields">
                    <label className="fieldlabels" htmlFor="mn">
                      {fieldsText[6]}
                    </label>
                    <input
                      value={this.state.user.state}
                      onChange={this.setValue}
                      placeholder={fieldsText[6]}
                      name="state"
                    />
                  </div>
                  <div className="fields">
                    <label className="fieldlabels" htmlFor="mn">
                      {fieldsText[7]}
                    </label>
                    <input
                      readOnly
                      value={this.state.user.zip_code}
                      placeholder={fieldsText[7]}
                      name="zip_code"
                    />
                  </div>
                  <div className="fields">
                    <label className="fieldlabels" htmlFor="mn">
                      {fieldsText[8]}
                    </label>
                    <input
                      value={this.state.user.country}
                      onChange={this.setValue}
                      placeholder={fieldsText[8]}
                      name="country"
                    />
                  </div>
                  <div
                    className="formBtn"
                    style={{ float: arabic ? "left" : "right" }}
                  >
                    <button onClick={this.updateProfile} type="submit">
                      {arabic ? "تحديث" : "Update"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
