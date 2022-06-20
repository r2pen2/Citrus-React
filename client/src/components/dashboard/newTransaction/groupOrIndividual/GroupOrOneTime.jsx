// Style imports
import "./groupOrOneTime.scss";

// Library imports
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

// Component imports
import BinaryChoice from "../binaryChoice/BinaryChoice";

export default function GroupOrOneTimeBox() {
  return (
    <div>
      <Stack>
        <Stack
          direction="row"
          spacing={5}
          marginTop="50px"
          justifyContent="center"
        >
          <BinaryChoice side="left" text="Group"></BinaryChoice>
          <BinaryChoice side="right" text="One-time"></BinaryChoice>
        </Stack>
        <Stack direction="row" spacing={5}>
          <
        </Stack>
      </Stack>
    </div>
  );
}
