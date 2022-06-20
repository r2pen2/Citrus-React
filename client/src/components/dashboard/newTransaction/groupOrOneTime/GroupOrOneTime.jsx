// Style imports
import "./groupOrOneTime.scss";

// Library imports
import { Stack, Typography } from "@mui/material";

// Component imports
import BinaryChoice from "../BinaryChoice";
import NavArrow from "../NavArrow";
import InfoButton from "../InfoButton";

export default function GroupOrOneTimeBox() {
  const informationText =
    'Select "Group" if this transaction is part of a group. Select "One-time" if not.';

  return (
    <div>
      <Stack spacing={5}>
        <Stack
          direction="row"
          spacing={5}
          marginTop="50px"
          justifyContent="center"
        >
          <BinaryChoice side="left" text="Group"></BinaryChoice>
          <BinaryChoice side="right" text="One-time"></BinaryChoice>
        </Stack>
        <Stack direction="row" spacing={5} justifyContent="center">
          <NavArrow direction="back"></NavArrow>
          <InfoButton informationText={informationText}></InfoButton>
          <NavArrow direction="forward"></NavArrow>
        </Stack>
      </Stack>
    </div>
  );
}
