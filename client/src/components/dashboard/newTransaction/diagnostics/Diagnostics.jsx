// Style imports
import "./diagnostics.scss";

// Library imports

// Component imports
import AffiliationQuestion from "./affiliationQuestion/AffiliationQuestion";
import TypeQuestion from "./communalOrIou/CommunalOrIou";

export default function Diagnostics({ user }) {
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
  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  };

  //
  const { step } = this.state;
  const { affiliation, type } = this.state;
  const values = { affiliation, type };

  switch (step) {
    case 1:
      return (
        <AffiliationQuestion
          nextStep={this.nextStep}
          handleChange={this.handleChange}
          values={values}
        />
      );
    case 2:
      return (
        <TypeQuestion
          nextStep={this.nextStep}
          handleChange={this.handleChange}
          values={values}
        />
      );
    default:
  }
}
