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
  const [state, setState] = useState({
    step: 1,
    Affiliation: "",
    Type: "",
  });

  // go back to the previous step
  function prevStep() {
    // console.log("moving to previous step");
    const { step } = state;
    setState({ step: step - 1 });
  }

  // proceed to the next step
  function nextStep() {
    // console.log("moving to next step");
    const { step } = state;
    setState({ step: step + 1 });
  }

  // handle input
  function updateValue(key, value) {
    const items = state;
    items[key] = value;
    console.log("before");
    console.log(state);
    // setState({ items });
    console.log("after");
    console.log(state);
  }

  console.log(state.items);
  switch (state.step) {
    case 0:
      window.location = "/dashboard";
    case 1:
      return (
        <AffiliationQuestion nextStep={nextStep} updateValue={updateValue} />
      );
    case 2:
      return <TypeQuestion prevStep={prevStep} updateValue={updateValue} />;
    case 3:
      const nextPage =
        "/dashboard/new-transaction/" +
        (state.Type === "Communal" ? "communal" : "iou");
      console.log(nextPage);
      window.location = nextPage;
    default:
      return <div>error</div>;
  }
}
