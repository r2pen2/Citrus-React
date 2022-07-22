// Library imports
import { Stack, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";

// Component imports
import BackButton from "../backButton/BackButton";
import Breadcrumbs from "../../../../resources/Breadcrumbs";

export default function AmountQuestion({
  nextStep,
  prevStep,
  updateValue,
  friendName,
}) {
  return (
    <div>
      <div style={{ marginLeft: "30px", marginTop: "50px" }}>
        <BackButton
          onClick={() => {
            prevStep();
          }}
        ></BackButton>
      </div>
      <Stack spacing={"3vh"} marginTop="1vh" alignItems="center">
        <Typography variant="h3" fontFamily="fredokaOne">
          {"How much?"}
        </Typography>
        <div>
          <Breadcrumbs path="Dashboard/New transaction/Amount" />
          <h1>Enter amount page</h1>
          <h2>Needs implementation</h2>
          <a href="https://github.com/r2pen2/Citrus-React/issues/109">
            Github: Implement Dashboard/New transaction/Amount #109
          </a>
          <ul>
            <li>
              <div>Page needs an amount entry box</div>
            </li>
            <li>
              <div>Page needs keypad to add numbers</div>
            </li>
            <li>
              <div>Page needs a forward button</div>
            </li>
          </ul>
        </div>
      </Stack>
    </div>
  );
}
