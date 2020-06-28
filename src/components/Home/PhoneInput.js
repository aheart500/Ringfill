import React, { useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
export default function Example({ lang }) {
  const [value, setValue] = useState("");
  if (value !== undefined && value !== "") {
    localStorage.setItem("mobile", value);
  }

  return (
    <PhoneInput
      placeholder={
        lang === "ar" ? "ادخل رقم الهاتف" : "Enter number with country code"
      }
      className={lang === "ar" ? "arPhoneInput" : ""}
      flags={flags}
      value={value}
      onChange={setValue}
      onKeyPress={(e) => {
        if (e.key === "Enter") window.location.href = "/recharge";
      }}
    />
  );
}
