// Style imports
import "./groupOrOneTime.scss";

// Library imports
import { Fab, Stack } from "@mui/material";

// Component imports
import MultipleChoiceButton from "../multipleChoiceButton/MultipleChoiceButton";
import BackButton from "../backButton/BackButton";
import InfoButton from "../infoButton/InfoButton";

export default function GroupOrOneTimeBox() {
  const priorPage = "/dashboard";
  const nextPage = "/dashboard/new-transaction/transaction-or-iou";
  const informationText =
    'Select "Group" if this transaction is part of a group. Select "One-time" if not.';

  return (
    <div>
      <div style={{ marginLeft: "30px", marginTop: "50px" }}>
        <BackButton priorHref={priorPage}></BackButton>
      </div>
      <Stack spacing={5} marginTop="100px" alignItems="center">
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
        <div style={{ height: "10px" }}></div>
        <InfoButton informationText={informationText}></InfoButton>
      </Stack>
    </div>
  );
}
