import React from "react";
import "./WhyUs.css";
import { FaLaptop, FaTv, FaPaperPlane } from "react-icons/fa";
import ModalContext from "../../context/modalContext/ModalContext";

const enData = [
  {
    icon: "Tv",
    title: "Fully Customizable",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    icon: "PaperPlane",
    title: "Gorgeous design",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    icon: "Laptop",
    title: "Well documented",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    icon: "Laptop",
    title: "Responsive Design",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];
const arData = [
  {
    icon: "Tv",
    title: "سهل التعديل",
    description:
      "هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما سيلهي القارئ عن التركيز على الشكل الخارجي للنص أو شكل توضع الفقرات في الصفحة التي يقرأها.",
  },
  {
    icon: "PaperPlane",
    title: "تصميم رائع",
    description:
      "هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما سيلهي القارئ عن التركيز على الشكل الخارجي للنص أو شكل توضع الفقرات في الصفحة التي يقرأها.",
  },
  {
    icon: "Laptop",
    title: "توثيق كامل",
    description:
      "هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما سيلهي القارئ عن التركيز على الشكل الخارجي للنص أو شكل توضع الفقرات في الصفحة التي يقرأها.",
  },
  {
    icon: "Laptop",
    title: "تصميم متجاوب",
    description:
      "هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما سيلهي القارئ عن التركيز على الشكل الخارجي للنص أو شكل توضع الفقرات في الصفحة التي يقرأها.",
  },
];

const returnIcon = (icon) => {
  switch (icon) {
    case "Tv":
      return <FaTv />;
    case "PaperPlane":
      return <FaPaperPlane />;
    case "Laptop":
      return <FaLaptop />;
    default:
      return null;
  }
};

export default function WhyUs() {
  const { modalState } = React.useContext(ModalContext);
  const data = modalState.language === "ar" ? arData : enData;
  return (
    <div>
      <div
        className="whyUsDiv"
        style={{ direction: modalState.language === "ar" ? "rtl" : "ltr" }}
      >
        <div className="whyUsHeader">
          <h1>
            {modalState.language === "ar" ? "لماذا نحن؟" : "Why choose us?"}
          </h1>
        </div>
        <div className="whyUs">
          {data.map((d, index) => (
            <div key={index} className="eachWhyUs">
              <div className="eachWhyUsHeader">
                <div>{returnIcon(d.icon)}</div>
              </div>
              <div className="eachWhyUsBody">
                <h2>{d.title}</h2>
                <p>{d.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
