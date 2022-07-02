// Style imports
import "./iou.scss";

// Library imports
import { Component, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Iou({ user }) {
  const [state, setState] = useState({
    step: 1,
  });

  const params = new URLSearchParams(window.location.search);
  const affiliation = params.get("affiliation");

  function getPageContent() {
    switch (step) {
      case 0:
        window.location = "/dashboard/diagnostics";
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
          <AmountQuestion
            nextStep={nextStep}
            prevStep={prevStep}
            updateValue={updateValue}
          />
        );
      case 3:
        return (
          <TitleDescQuestion
            nextStep={nextStep}
            prevStep={prevStep}
            updateValue={updateValue}
          />
        );
      case 4:
        return <div>Submit a transaction</div>;
      default:
        return <LoadingScreen />;
    }
  }
  return <div>{getPageContent()}</div>;
}
