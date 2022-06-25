// Style imports
import "./diagnostics.scss";

// Library imports
import { Component } from "react";

// Component imports
import AffiliationQuestion from "./affiliationQuestion/AffiliationQuestion";
import TypeQuestion from "./typeQuestion/TypeQuestion";

class Diagnostics extends Component {
  state = {
    step: 1,
    Affiliation: "",
    Type: "",
  };

  // go back to the previous step
  prevStep = () => {
    const { step } = this.state;
    this.setState({ step: step - 1 });
  };

  // proceed to the next step
  nextStep = () => {
    const { step } = this.state;
    this.setState({ step: step + 1 });
  };

  // handle input
  updateValue = (key, value) => {
    const items = [...this.state.items];
    items[key] = value;
    this.setState({ items });
  };

  render() {
    const { step } = this.state;
    const { affiliation, type } = this.state;
    const values = { affiliation, type };
    switch (step) {
      case 0:
        window.location = "/dashboard";
      case 1:
        return (
          <AffiliationQuestion
            nextStep={this.nextStep}
            updateValue={this.updateValue}
            values={values}
          />
        );
      case 2:
        return (
          <TypeQuestion
            prevStep={this.prevStep}
            updateValue={this.updateValue}
            values={values}
          />
        );
      case 3:
        const nextPage =
          "/dashboard/new-transaction/" +
          (this.state.Type === "Communal" ? "communal" : "iou");
        window.location = nextPage;
      default:
    }
  }
}

export default Diagnostics;
