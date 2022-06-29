// Style imports
import "./iou.scss";

// Library imports
import { Component, useState } from "react";

// Component imports
// import AffiliationQuestion from "./affiliationQuestion/AffiliationQuestion";
// import TypeQuestion from "./typeQuestion/TypeQuestion";

// class Diagnostics extends Component {
//   // state = {
//   //   step: 1,
//   //   Affiliation: "",
//   //   Type: "",
//   // };
// }
export default function Iou({ user, affiliation }) {
  const [state, setState] = useState({
    step: 1,
    // Affiliation: "",
    // Type: "",
  });

  // go back to the previous step
  function prevStep() {
    const { step } = state;
    setState({ step: step - 1 });
  }

  // proceed to the next step
  function nextStep() {
    const { step } = state;
    setState({ step: step + 1 });
  }

  // handle input
  function updateValue(key, value) {
    const items = state;
    items[key] = value;
    // console.log("before");
    // console.log(state);
    // setState({ items });
    // console.log("after");
    // console.log(state);
  }

  switch (state.step) {
    case 0:
      window.location = "/dashboard";
    case 1:
      return <dif>insert IOU form affiliated with {affiliation}</dif>;
    // case 2:
    //   return (
    //     <TypeQuestion
    //       nextStep={nextStep}
    //       prevStep={prevStep}
    //       updateValue={updateValue}
    //     />
    //   );
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
