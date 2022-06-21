// Style imports
import "./groupOrOneTime.scss";

// Library imports
import { Fab, Stack } from "@mui/material";

// Component imports
import MultipleChoiceButton from "../MultipleChoiceButton";
import BackButton from "../BackButton";
import InfoButton from "../InfoButton";

export default function GroupOrOneTimeBox() {
  const informationText =
    'Select "Group" if this transaction is part of a group. Select "One-time" if not.';

  return (
    <div>
      <div style={{ marginLeft: "30px", marginTop: "50px" }}>
        <BackButton></BackButton>
      </div>
      <Stack spacing={5} marginTop="100px" alignItems="center">
        {/* <Stack
          direction="row"
          spacing={5}
          marginTop="50px"
          justifyContent="center"
        > */}
        <MultipleChoiceButton order={1} text="Group"></MultipleChoiceButton>
        <MultipleChoiceButton order={2} text="One-time"></MultipleChoiceButton>
        {/* </Stack> */}
        {/* <Stack direction="row" spacing={5} justifyContent="center"> */}
        {/* <NavArrow direction="back"></NavArrow> */}
        <div style={{ height: "10px" }}></div>
        <InfoButton informationText={informationText}></InfoButton>
        {/* <NavArrow direction="forward"></NavArrow> */}
        {/* </Stack> */}
      </Stack>
    </div>
  );
}
