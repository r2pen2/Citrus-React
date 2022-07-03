// Style imports
import "./iou.scss";

// Library imports
import { Component, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Component imports
import LoadingScreen from "../../../miscellaneous/loadingScreen/LoadingScreen";
import WhomQuestion from "./whomQuestion/WhomQuestion";
// import JoePic from "../../../../assets/images/pfp/Joe.png";
// import LeoPic from "../../../../assets/images/pfp/Leo.png";
// import OliverPic from "../../../../assets/images/pfp/Oliver.png";

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

  // example data for listing friend options
  const bestFriendsExample = [
    {
      id: 1,
      firstName: "Joe",
      avatar: JoePic,
    },
    {
      id: 2,
      firstName: "Leo",
      avatar: JoePic,
    },
    {
      id: 3,
      firstName: "Oliver",
      avatar: JoePic,
    },
  ];

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
            possibleFriends={bestFriendsExample}
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
