import React from "react";
import "./Plans.css";
import ModalContext from "../../context/modalContext/ModalContext";

const enPlans = [
  {
    title: "Plan 1",
    price: "20",
    description: [
      "10 users included",
      "2 GB of storage",
      "Help center access",
      "Email support",
    ],
    buttonText: "Recharge Now",
  },
  {
    title: "Plan 2",
    price: "150",
    description: [
      "10 users included",
      "2 GB of storage",
      "Help center access",
      "Email support",
    ],
    buttonText: "Recharge Now",
  },
  {
    title: "Plan 3",
    price: "540",
    description: [
      "10 users included",
      "2 GB of storage",
      "Help center access",
      "Email support",
    ],
    buttonText: "Recharge Now",
  },
  {
    title: "Plan 4",
    price: "1110",
    description: [
      "50 users included",
      "30 GB of storage",
      "Help center access",
      "Phone & email support",
    ],
    buttonText: "Recharge Now",
  },
];
const arPlans = [
  {
    title: "الخطة 1",
    price: "20",
    description: [
      "10 مستخدمين متاحين",
      "2 جيجابايت مساحة تحزين",
      "إمكانية دخول مركز المساعدة",
      "دعم البريد",
    ],
    buttonText: "اشحن الآن",
  },
  {
    title: "الخطة 2",
    price: "150",
    description: [
      "10 مستخدمين متاحين",
      "2 جيجابايت مساحة تحزين",
      "إمكانية دخول مركز المساعدة",
      "دعم البريد",
    ],
    buttonText: "اشحن الآن",
  },
  {
    title: "الخطة 3",
    price: "540",
    description: [
      "10 مستخدمين متاحين",
      "2 جيجابايت مساحة تحزين",
      "إمكانية دخول مركز المساعدة",
      "دعم البريد",
    ],
    buttonText: "اشحن الآن",
  },
  {
    title: "Plan 4",
    price: "1110",
    description: [
      "50 مستخدمين متاحين",
      "30 جيجابايت مساحة تحزين",
      "إمكانية دخول مركز المساعدة",
      "دعم البريد والهاتف",
    ],
    buttonText: "اشحن الآن",
  },
];

export default function Plans() {
  const { modalState } = React.useContext(ModalContext);
  let plans = modalState.language === "ar" ? arPlans : enPlans;

  return (
    <div className="plansDiv">
      <div className="plansHeader">
        <h1>
          {modalState.language === "ar"
            ? "اختر الخطة المناسبة"
            : "Choose Desired Plans"}
        </h1>
      </div>
      <div
        className="plans"
        style={{ direction: modalState.language === "ar" ? "rtl" : "ltr" }}
      >
        {plans.map((plan) => (
          <div key={plan.price} className="eachPlan">
            <div className="eachPlanHeader">{plan.title}</div>
            <div className="eachPlanBody">
              <div className="price">${plan.price}</div>
              <div className="description">
                {plan.description.map((des, index) => (
                  <p key={index}>{des}</p>
                ))}
              </div>
            </div>
            <div className="eachPlanFooter">
              <button>{plan.buttonText}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
