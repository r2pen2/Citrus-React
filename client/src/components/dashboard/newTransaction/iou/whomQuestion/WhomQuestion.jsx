// Style imports
import "./whomQuestion.scss";

// Library imports
import { Stack, Typography } from "@mui/material";

// Component imports
import AvatarSelector from "../../../../resources/avatarSelector/AvatarSelector";
import BackButton from "../../templates/backButton/BackButton";

export default function WhomQuestion({
  nextStep,
  prevStep,
  updateValue,
  possibleFriends,
}) {
  // to be implemented on forward button click
  // function handleClick() {
  //   updateValue("friend", firstName);
  //   nextStep();
  // }

  return (
    <div>
      <div style={{ marginLeft: "30px", marginTop: "50px" }}>
        <BackButton onClick={prevStep}></BackButton>
      </div>
      <Stack spacing={"3vh"} marginTop="1vh" alignItems="center">
        <Typography variant="h3" fontFamily="fredokaOne">
          {"With whom?"}
        </Typography>
        <AvatarSelector possibleFriends={possibleFriends}></AvatarSelector>
      </Stack>
    </div>
  );
}
