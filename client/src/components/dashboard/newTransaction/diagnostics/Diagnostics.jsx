// Style imports
import "./diagnostics.scss";

// Library imports
import { Component, useState } from "react";

// Component imports
import AffiliationQuestion from "./affiliationQuestion/AffiliationQuestion";
import TypeQuestion from "./typeQuestion/TypeQuestion";
import LoadingScreen from "../../../miscellaneous/loadingScreen/LoadingScreen";

export default function Diagnostics({ user }) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState({
    type: "",
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
    console.log(state);
    const newState = state;
    newState[key] = value;
    setState(newState);
    console.log(state);
  }

  function getPageContent() {
    switch (step) {
      case 0:
        window.location = "/dashboard";
        break;
      case 1:
        return (
          <TypeQuestion
            nextStep={nextStep}
            prevStep={prevStep}
            updateValue={updateValue}
          />
        );
      case 2:
        const nextPage =
          "/dashboard/new-transaction/" + state.type.toLowerCase();
        window.location = nextPage;
      default:
        return <LoadingScreen />;
    }
  }
  return <div>{getPageContent()}</div>;
}
