// Style imports
import "./iou.scss";

// Library imports
import { Component, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Component imports
import LoadingScreen from "../../../resources/loadingScreen/LoadingScreen";
import WhomQuestion from "./whomQuestion/WhomQuestion";
import AmountQuestion from "../templates/amountQuestion/AmountQuestion";

export default function Iou({ user }) {
  const [step, setStep] = useState(1);
  const [friendName, setFriendName] = useState("");
  const [friendId, setFriendId] = useState("");
  const [amount, setAmount] = useState(0);

  // go back to the previous step
  function prevStep() {
    setStep(step - 1);
  }

  // proceed to the next step
  function nextStep() {
    setStep(step + 1);
  }

  // if ID is specified and f
  function getPageContent() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if ((id !== null) & (friendId === "")) {
      setFriendId(id);
      setFriendName("updated name via shortcut");
      setStep(2);
    }

    switch (step) {
      case 0:
        window.location = "/dashboard/new-transaction/diagnostics";
        break;
      case 1:
        return (
          <WhomQuestion
            nextStep={nextStep}
            prevStep={prevStep}
            currentFriendName={friendName}
            setFriendName={setFriendName}
            setFriendId={setFriendId}
          />
        );
      case 2:
        return (
          <AmountQuestion
            nextStep={nextStep}
            prevStep={prevStep}
            setAmount={setAmount}
            friendName={friendName}
          />
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
