// Style imports
import "./typeQuestion.scss";

// Library imports
import { Fab, Stack } from "@mui/material";

// Component imports
import MultipleChoiceButton from "../../templates/multipleChoiceButton/MultipleChoiceButton";
import BackButton from "../../templates/backButton/BackButton";
import InfoButton from "../../templates/infoButton/InfoButton";

// nextStep={nextStep}
// updateValue={updateValue}
// values={values}

export default function AffiliationQuestion({
  nextStep,
  prevStep,
  updateValue,
}) {
  // const priorPage = "/dashboard";
  // const nextPage = "/dashboard/new-transaction/transaction-or-iou";
  const informationText =
    'Select "Communal" if this transaction involves three or more people. Select "IOU" if not.';

  var options = ["Communal", "IOU"];

  return (
    <div>
      <div style={{ marginTop: "50px" }}></div>
      <div style={{ marginLeft: "30px", marginTop: "2vh" }}>
        <BackButton onClick={prevStep}></BackButton>
      </div>
      <Stack spacing={5} marginTop="5vh" alignItems="center">
        {options.map(function (option, index) {
          return (
            <MultipleChoiceButton
              index={index}
              choice={option}
              field="Type"
              updateValue={updateValue}
              nextStep={nextStep}
            />
          );
        })}
        <div style={{ height: "1vh" }}></div>
        <InfoButton informationText={informationText}></InfoButton>
      </Stack>
    </div>
  );
}
