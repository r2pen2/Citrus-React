// Style imports
import "./whomQuestion.scss";

// Library imports
import { Grid, Stack, Typography } from "@mui/material";

// Component imports
import AvatarButton from "../../../../resources/avatarButton/AvatarButton";
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

  // function generateAvatarButtons(possibleFriends, updateValue, nextStep) {
  //   function generateRow(rowContents, rowNum, updateValue, nextStep) {
  //     let rowComponent = rowContents.map((friend, colNum) => {
  //       return (
  //         <p>{friend.firstName}</p>
  //         // <AvatarButton
  //         //   index={friend.id}
  //         //   updateValue={updateValue}
  //         //   nextStep={nextStep}
  //         //   firstName={friend.firstName}
  //         //   avatarSrc={friend.avatarSrc}
  //         // />
  //       );
  //     });

  //     return rowComponent;
  //   }

  //   const avatarsPerRow = 2;
  //   const numFriends = possibleFriends.length;
  //   const numRows = Math.round(numFriends / avatarsPerRow);

  //   var rows = [],
  //     size = avatarsPerRow;

  //   while (possibleFriends.length > 0)
  //     rows.push(possibleFriends.splice(0, size));

  //   const testArray = ["a", "b", "c"];
  //   let arrayOutput = rows.map((rowContent, index) => {
  //     // return generateRow(rowContents, rowNum, updateValue, nextStep);
  //     console.log(rowContent[0].firstName);
  //     // return <div>{row[0].firstName}</div>;
  //     return <div>{rowContent[0].firstName}</div>;
  //   });

  //   return arrayOutput;
  // }

  function generateAvatarButtons(possibleFriends, updateValue, nextStep) {
    return (
      <div>
        <Grid container spacing={2}>
          <Grid
            item
            xs={6}
            // direction="column"
            // display="flex"
            // justifyContent="center"
          >
            <AvatarButton
              index={possibleFriends[0].id}
              firstName={possibleFriends[0].firstName}
              avatarSrc={possibleFriends[0].avatarSrc}
              size="large"
            />
          </Grid>
          <Grid item xs={6}>
            <AvatarButton
              index={possibleFriends[1].id}
              firstName={possibleFriends[1].firstName}
              avatarSrc={possibleFriends[1].avatarSrc}
              size="large"
            />
          </Grid>
          <Grid item xs={6}>
            <AvatarButton
              index={possibleFriends[2].id}
              updateValue={updateValue}
              nextStep={nextStep}
              firstName={possibleFriends[2].firstName}
              avatarSrc={possibleFriends[2].avatarSrc}
              size="large"
            />
          </Grid>
        </Grid>
      </div>
    );
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
