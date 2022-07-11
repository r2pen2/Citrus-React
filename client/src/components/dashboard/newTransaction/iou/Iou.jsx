// Style imports
import "./iou.scss";

// Library imports
import { Component, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Component imports
import LoadingScreen from "../../../resources/loadingScreen/LoadingScreen";
import WhomQuestion from "./whomQuestion/WhomQuestion";
import AmountQuestion from "../templates/amountQuestion/AmountQuestion";
import { faker } from "@faker-js/faker";

export default function Iou({ user }) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState({
    friend: {
      firstName: "",
      id: "",
    },
    amount: 0,
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
      avatarSrc: faker.image.animals(200, 200, true),
    },
    {
      id: 2,
      firstName: "Leo",
      avatarSrc: faker.image.animals(200, 200, true),
    },
    {
      id: 3,
      firstName: "Oliver",
      avatarSrc: faker.image.animals(200, 200, true),
    },
  ];

  // if ID is specified and f
  function getPageContent() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if ((id !== null) & (state.friend.id === "")) {
      const newFriend = state.friend;
      newFriend["id"] = id;
      updateValue("friend", newFriend);
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
            updateValue={updateValue}
            possibleFriends={bestFriendsExample}
          />
        );
      case 2:
        return (
          <AmountQuestion
            nextStep={nextStep}
            prevStep={prevStep}
            updateValue={updateValue}
            friendName={state.friend.firstName}
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
