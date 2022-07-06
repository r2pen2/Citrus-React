// Style imports
import "./diagnostics.scss";

// Library imports
import { Component, useState } from "react";

// Component imports
import AffiliationQuestion from "./affiliationQuestion/AffiliationQuestion";
import TypeQuestion from "./typeQuestion/TypeQuestion";
import LoadingScreen from "../../../resources/loadingScreen/LoadingScreen";

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
    const newState = state;
    newState[key] = value;
    setState(newState);
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
