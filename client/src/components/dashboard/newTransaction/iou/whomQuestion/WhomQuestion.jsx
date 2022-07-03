// Style imports
import "./whomQuestion.scss";

// Library imports
import { Stack, Typography } from "@mui/material";

// Component imports
import MultipleChoiceButton from "../../templates/multipleChoiceButton/MultipleChoiceButton";
import BackButton from "../../templates/backButton/BackButton";

export default function WhomQuestion({
  nextStep,
  prevStep,
  updateValue,
  possibleFriends,
}) {
  return (
    <div>
      <div style={{ marginLeft: "30px", marginTop: "50px" }}>
        <BackButton onClick={prevStep}></BackButton>
      </div>
      <Stack spacing={"3vh"} marginTop="1vh" alignItems="center">
        <Typography variant="h3" fontFamily="fredokaOne">
          {"With whom?"}
        </Typography>
        {possibleFriends.map(function (friend, index) {
          return (
            <MultipleChoiceButton
              index={friend.id}
              choice={friend.firstName}
              field="friend"
              updateValue={updateValue}
              nextStep={nextStep}
              size="small"
              avatar={friend.avatar}
            />
          );
        })}
      </Stack>
    </div>
  );
}
