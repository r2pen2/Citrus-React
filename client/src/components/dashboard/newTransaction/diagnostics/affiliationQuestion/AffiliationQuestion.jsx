// Style imports
import "./AffiliationQuestion.scss";

// Library imports
import { Fab, Stack } from "@mui/material";

// Component imports
import MultipleChoiceButton from "../../templates/multipleChoiceButton/MultipleChoiceButton";
import BackButton from "../../templates/backButton/BackButton";
import InfoButton from "../../templates/infoButton/InfoButton";

export default function AffiliationQuestion({
  nextStep,
  handleChange,
  values,
}) {
  // const priorPage = "/dashboard";
  // const nextPage = "/dashboard/new-transaction/transaction-or-iou";
  const informationText =
    'Select "Group" if this transaction is part of a group. Select "One-time" if not.';

  const options = [
    {
      id: 1,
      choice: "Group",
    },
    {
      id: 2,
      choice: "None",
    },
  ];
  return (
    <div>
      <div style={{ marginTop: "50px" }}></div>
      <div style={{ marginLeft: "30px", marginTop: "2vh" }}>
        <BackButton priorHref="/dashboard"></BackButton>
      </div>
      <Stack spacing={5} marginTop="5vh" alignItems="center">
        {options.map((option, oIndex) => (
          <MultipleChoiceButton
            order={oIndex}
            text={option}
            updateValue={handleChange("affiliation")}
            nextStep={nextStep()}
          />
        ))}
        {/* <MultipleChoiceButton
          order={1}
          text="Group"
          choice={choice}
        ></MultipleChoiceButton>
        <MultipleChoiceButton
          order={2}
          text="One-time"
          onClick={nextPage}
        ></MultipleChoiceButton> */}
        <div style={{ height: "1vh" }}></div>
        <InfoButton informationText={informationText}></InfoButton>
      </Stack>
    </div>
  );
}
