// Style imports
import "./AffiliationQuestion.scss";

// Library imports
import { Fab, Stack } from "@mui/material";

// Component imports
import MultipleChoicePage from "../../templates/multipleChoicePage/MultipleChoicePage";

export default function AffiliationQuestion({
  nextStep,
  prevStep,
  updateValue,
}) {
  const field = "Affiliation";
  const options = ["Group", "None"];
  const informationText =
    'Select "Group" if this transaction is part of a group. Select "One-time" if not.';

  return (
    <MultipleChoicePage
      field={field}
      options={options}
      informationText={informationText}
      nextStep={nextStep}
      prevStep={prevStep}
      updateValue={updateValue}
    />
  );
}
