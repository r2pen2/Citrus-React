// Style imports
import "./whomQuestion.scss";

// Library imports
import { Stack, Typography } from "@mui/material";

// Component imports
import AvatarButton from "../../templates/avatarButton/AvatarButton";
import BackButton from "../../templates/backButton/BackButton";

export default function WhomQuestion({
  nextStep,
  prevStep,
  updateValue,
  possibleFriends,
}) {
  function generateAvatarButtons(possibleFriends, updateValue, nextStep) {
    function generateRow(rowContents, rowNum, updateValue, nextStep) {
      let rowComponent = rowContents.map((friend, colNum) => {
        return (
          <p>{friend.firstName}</p>
          // <AvatarButton
          //   index={friend.id}
          //   updateValue={updateValue}
          //   nextStep={nextStep}
          //   firstName={friend.firstName}
          //   avatarSrc={friend.avatarSrc}
          // />
        );
      });

      return rowComponent;
    }

    const avatarsPerRow = 2;
    const numFriends = possibleFriends.length;
    const numRows = Math.round(numFriends / avatarsPerRow);

    var rows = [],
      size = avatarsPerRow;

    while (possibleFriends.length > 0)
      rows.push(possibleFriends.splice(0, size));

    // const testArray = ["a", "b", "c"];
    let arrayOutput = rows.map((row, rowNum) => {
      // return generateRow(rowContents, rowNum, updateValue, nextStep);
      console.log(row[0].firstName);
      return <div>{row[0].firstName}</div>;
      // return <div>{val}</div>;
    });

    return arrayOutput;
  }

  return (
    <div>
      <div style={{ marginLeft: "30px", marginTop: "50px" }}>
        <BackButton onClick={prevStep}></BackButton>
      </div>
      <Stack spacing={"3vh"} marginTop="1vh" alignItems="center">
        <Typography variant="h3" fontFamily="fredokaOne">
          {"With whom?"}
        </Typography>
        {generateAvatarButtons(possibleFriends, updateValue, nextStep)}
      </Stack>
    </div>
  );
}
