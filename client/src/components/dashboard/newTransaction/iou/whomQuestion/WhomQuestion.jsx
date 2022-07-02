// Style imports
import "./whomQuestion.scss";

// Library imports
import { Stack, Typography } from "@mui/material";

// Component imports
import MultipleChoiceButton from "../../templates/multipleChoiceButton/MultipleChoiceButton";
import BackButton from "../../templates/backButton/BackButton";
import InfoButton from "../../templates/infoButton/InfoButton";

export default function WhomQuestion({ nextStep, prevStep, updateValue }) {
  const topThreeFriends = ["Joe", "Oliver", "Leo"];

  return (
    <div>
      {/* <div style={{ marginTop: "40px" }}></div> */}
      <div style={{ marginLeft: "30px", marginTop: "50px" }}>
        <BackButton onClick={prevStep}></BackButton>
      </div>
      <Stack spacing={5} marginTop="1vh" alignItems="center">
        <Typography variant="h3" fontFamily="fredokaOne">
          {"With whom?"}
        </Typography>
        {topThreeFriends.map(function (friend, index) {
          return (
            <MultipleChoiceButton
              index={index}
              choice={friend}
              field="friend"
              updateValue={updateValue}
              nextStep={nextStep}
              size="small"
            />
          );
        })}
        <div style={{ height: "1vh" }}></div>
        {/* <InfoButton informationText={informationText}></InfoButton> */}
      </Stack>
    </div>
  );
}
