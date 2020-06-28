import React from "react";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import ModalContext from "../context/modalContext/ModalContext";
import "./Footer.css";

const footers = [
  {
    title: "Company",
    description: ["Team", "History", "Contact us", "Locations"],
  },
  {
    title: "Features",
    description: [
      "Cool stuff",
      "Random feature",
      "Team feature",
      "Developer stuff",
      "Another one",
    ],
  },
  {
    title: "Resources",
    description: [
      "Resource",
      "Resource name",
      "Another resource",
      "Final resource",
    ],
  },
  {
    title: "Legal",
    description: ["Privacy policy", "Terms of use"],
  },
];

const arFooters = [
  {
    title: "الشركة",
    description: ["الفريق", "التاريخ", "تواصل معنا", "موقعنا"],
  },
  {
    title: "المميزات",
    description: [
      "مميزات رائعة",
      "مميزات عشوائية",
      "ميزة الفريق",
      "مميزات المطورين",
      "شئ آخر",
    ],
  },
  {
    title: "المصادر",
    description: ["مصدر", "اسم المصدر", "مصدر آخر", "مصدر أخير"],
  },
  {
    title: "الشئون القانونية",
    description: ["سياسة الخصوصية", "شروط الأستخدام"],
  },
];

export default function Footer() {
  const { modalState } = React.useContext(ModalContext);
  let data = modalState.language === "ar" ? arFooters : footers;
  function Copyright() {
    return (
      <Typography
        variant="h6"
        color="textSecondary"
        align="center"
        style={{ direction: modalState.language === "ar" ? "rtl" : "ltr" }}
      >
        {modalState.language === "ar" ? "حقوق النشر © " : "Copyright © "}
        <Link color="inherit" href="#" style={{ textDecoration: "none" }}>
          {modalState.language === "ar" ? "موقعك" : "Your Website"}
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }
  return (
    <div className="footerDiv">
      <div
        className="footers"
        style={{ direction: modalState.language === "ar" ? "rtl" : "ltr" }}
      >
        {data.map((footer) => (
          <div key={footer.title} className="eachFooter">
            <p>{footer.title}</p>
            <div className="footerDetails">
              <ul>
                {footer.description.map((des, index) => (
                  <li key={index}>{des}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div className="copyright">{Copyright()}</div>
    </div>
  );
}
