// Style imports
import "./groupOrOneTime.scss";

// Library imports
import { Fab, Stack } from "@mui/material";

// Component imports
import MultipleChoiceButton from "../../templates/multipleChoiceButton/MultipleChoiceButton";
import BackButton from "../../templates/backButton/BackButton";
import InfoButton from "../../templates/infoButton/InfoButton";

export default function AffiliationQuestion() {
  const priorPage = "/dashboard";
  const nextPage = "/dashboard/new-transaction/transaction-or-iou";
  const informationText =
    'Select "Group" if this transaction is part of a group. Select "One-time" if not.';

  return (
    <div>
      <div style={{ marginTop: "50px" }}></div>
      <div style={{ marginLeft: "30px", marginTop: "2vh" }}>
        <BackButton priorHref={priorPage}></BackButton>
      </div>
      <Stack spacing={5} marginTop="5vh" alignItems="center">
        <MultipleChoiceButton
          order={1}
          text="Group"
          href={nextPage}
        ></MultipleChoiceButton>
        <MultipleChoiceButton
          order={2}
          text="One-time"
          href={nextPage}
        ></MultipleChoiceButton>
        <div style={{ height: "1vh" }}></div>
        <InfoButton informationText={informationText}></InfoButton>
      </Stack>
    </div>
  );
}
