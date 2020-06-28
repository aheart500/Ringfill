import React from "react";
import { FaPhone, FaLayerGroup, FaRegCheckCircle } from "react-icons/fa";
import "./Flow.css";
import ModalContext from "../../context/modalContext/ModalContext";
import Button from "@material-ui/core/Button";

export default function Flow() {
  const { modalState } = React.useContext(ModalContext);
  let data =
    modalState.language === "ar"
      ? ["اختر الرقم", "حدد الكمية", "أتمم الدفع", "أعلى الصفحة"]
      : [
          "Choose a Number",
          "Select Amount",
          "Complete Payment",
          "Top up Today",
        ];
  return (
    <div
      className="hiw"
      style={{ direction: modalState.language === "ar" ? "rtl" : "ltr" }}
    >
      <div className="hiw-1">
        <div className="card">
          <FaPhone className="phoneIcon"></FaPhone>
          <h1>{data[0]}</h1>
        </div>

        <div className="card">
          <FaLayerGroup />
          <h1>{data[1]}</h1>
        </div>
        <div className="card">
          <FaRegCheckCircle />
          <h1>{data[2]}</h1>
        </div>
      </div>

      <div className="hiw-2">
        <Button variant="contained" className="special-button">
          <a
            href="#topuptoday"
            style={{
              width: "fit-content",
              fontSize: "1rem",
              fontFamily: "Cairo",
            }}
          >
            {data[3]}
          </a>
        </Button>
      </div>
    </div>
  );
}
