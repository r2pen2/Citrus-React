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
  const options = ["Group", "IOU"];
  const informationText =
    "Select Group if this transaction is with a group of friends. Select IOU if it's with just one.";

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
