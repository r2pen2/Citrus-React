// Style imports
import "./diagnostics.scss";

// Library imports
import { Component, useState } from "react";

// Component imports
import AffiliationQuestion from "./affiliationQuestion/AffiliationQuestion";
import TypeQuestion from "./typeQuestion/TypeQuestion";

// class Diagnostics extends Component {
//   // state = {
//   //   step: 1,
//   //   Affiliation: "",
//   //   Type: "",
//   // };
// }
export default function Diagnostics({ user }) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState({
    Affiliation: "",
    Type: "",
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
    console.log(
      "Everything before: Affiliation - " +
        state.Affiliation +
        "; Type - " +
        state.Type
    );

    const newState = state;
    newState[key] = value;
    setState(newState);

    console.log(
      "Everything after: Affiliation - " +
        state.Affiliation +
        "; Type - " +
        state.Type
    );

    // console.log("before");
    // console.log(state);
    // setState({ items });
    // console.log("after");
    // console.log(state);
  }
  function getPageContent() {
    switch (step) {
      case 0:
        window.location = "/dashboard";
        break;
      case 1:
        return (
          <AffiliationQuestion
            nextStep={nextStep}
            prevStep={prevStep}
            updateValue={updateValue}
          />
        );
      case 2:
        return (
          <TypeQuestion
            nextStep={nextStep}
            prevStep={prevStep}
            updateValue={updateValue}
          />
        );
      case 3:
        const nextPage =
          "/dashboard/new-transaction/" +
          (state.Type === "Communal" ? "communal" : "iou");
        window.location = nextPage;
        break;
      default:
        return <div>loading...</div>;
    }
  }
  return <div>{getPageContent()}</div>;
}
