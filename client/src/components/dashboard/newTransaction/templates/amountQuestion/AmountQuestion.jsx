// Library imports
import { Stack, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";

// Component imports
import BackButton from "../backButton/BackButton";

export default function AmountQuestion(
  nextStep,
  prevStep,
  updateValue,
  friendName
) {
  return (
    <div>
      <div style={{ marginLeft: "30px", marginTop: "50px" }}>
        <BackButton onClick={prevStep}></BackButton>
      </div>
      <Stack spacing={"3vh"} marginTop="1vh" alignItems="center">
        <Typography variant="h3" fontFamily="fredokaOne">
          {"How much?"}
        </Typography>
        <div>transaction with {friendName}</div>
      </Stack>
    </div>
  );
}
