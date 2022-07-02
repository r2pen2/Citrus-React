// Style imports
import "./iou.scss";

// Library imports
import { Component, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Component imports
import LoadingScreen from "../../../miscellaneous/loadingScreen/LoadingScreen";
import WhomQuestion from "./whomQuestion/WhomQuestion";

export default function Iou({ user }) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState({
    friend: "",
  });

  // go back to the previous step
  function prevStep() {
    setStep(step - 1);
  }

  // proceed to the next step
  function nextStep() {
    setStep(step + 1);
  }

  // handle input
  function updateValue(key, value) {
    const newState = state;
    newState[key] = value;
    setState(newState);
  }

  // const params = new URLSearchParams(window.location.search);
  // const affiliation = params.get("affiliation");

  function getPageContent() {
    switch (step) {
      case 0:
        window.location = "/dashboard/new-transaction/diagnostics";
        break;
      case 1:
        return (
          <WhomQuestion
            nextStep={nextStep}
            prevStep={prevStep}
            updateValue={updateValue}
          />
        );
      case 2:
        return (
          <div>amount?</div>
          // <AmountQuestion
          //   nextStep={nextStep}
          //   prevStep={prevStep}
          //   updateValue={updateValue}
          // />
        );
      case 3:
        return (
          <div>title? description?</div>
          // <TitleDescQuestion
          //   nextStep={nextStep}
          //   prevStep={prevStep}
          //   updateValue={updateValue}
          // />
        );
      case 4:
        return <div>Submit a transaction</div>;
      default:
        return <LoadingScreen />;
    }
  }
  return <div>{getPageContent()}</div>;
}
