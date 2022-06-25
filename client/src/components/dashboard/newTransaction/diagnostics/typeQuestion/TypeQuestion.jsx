// Style imports
import "./typeQuestion.scss";

// Library imports
import { Stack } from "@mui/material";

// Component imports
import MultipleChoiceButton from "../../templates/multipleChoiceButton/MultipleChoiceButton";
import BackButton from "../../templates/backButton/BackButton";
import InfoButton from "../../templates/infoButton/InfoButton";

export default function TransactionOrIouBox() {
  const priorPage = "/dashboard/new-transaction/group-or-one-time";
  const nextPage = "/dashboard/new-transaction/transaction-or-iou";
  const informationText =
    "A transaction involves 3 or more people; an IOU is between you and one other person.";

  return (
    <div>
      <div style={{ marginTop: "50px" }}></div>
      <div style={{ marginLeft: "30px", marginTop: "2vh" }}>
        <BackButton priorHref={priorPage}></BackButton>
      </div>
      <Stack spacing={5} marginTop="5vh" alignItems="center">
        <MultipleChoiceButton
          order={1}
          text="Transaction"
          href={nextPage}
        ></MultipleChoiceButton>
        <MultipleChoiceButton
          order={2}
          text="IOU"
          href={nextPage}
        ></MultipleChoiceButton>
        <div style={{ height: "1vh" }}></div>
        <InfoButton informationText={informationText}></InfoButton>
      </Stack>
    </div>
  );
}
