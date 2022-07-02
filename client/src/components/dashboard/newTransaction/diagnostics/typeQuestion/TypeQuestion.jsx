// Style imports
import "./typeQuestion.scss";

// Library imports
import { Fab, Stack } from "@mui/material";

// Component imports
import MultipleChoicePage from "../../templates/multipleChoicePage/MultipleChoicePage";

export default function AffiliationQuestion({
  nextStep,
  prevStep,
  updateValue,
}) {
  const field = "Type";
  const options = ["Communal", "IOU"];
  const informationText =
    'Select "Communal" if this transaction involves three or more people. Select "IOU" if not.';

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
