// Style imports
import "./iou.scss";

// Library imports
import { Component, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Component imports
import LoadingScreen from "../../../miscellaneous/loadingScreen/LoadingScreen";

export default function Iou({ user }) {
  const [step, setStep] = useState(1);

  const params = new URLSearchParams(window.location.search);
  const affiliation = params.get("affiliation");
  // console.log(affiliation);

  function getPageContent() {
    switch (step) {
      case 0:
        window.location = "/dashboard/new-transaction/diagnostics";
        break;
      case 1:
        return (
          <div>whom?</div>
          // <WhomQuestion
          //   nextStep={nextStep}
          //   prevStep={prevStep}
          //   updateValue={updateValue}
          // />
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
  return <div>IOU</div>;
}
