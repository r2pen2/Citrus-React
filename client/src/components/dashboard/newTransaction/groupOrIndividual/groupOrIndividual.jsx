// Style imports
// import "./grouporindividual.scss";

// Library imports
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

// Component imports
import QuestionBox from "../questionBox/QuestionBox";

// const GroupOrIndividual = (
//   <div>
//     <h1>Question text</h1>
//     <h5>some more text</h5>
//   </div>
// );

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

export default function GroupOrIndividualBox() {
  return (
    <div>
      <Stack
        direction="row"
        spacing={5}
        marginTop="50px"
        justifyContent="center"
      >
        <Card sx={getLeftCardStyle} variant="outlined">
          <CardActionArea>
            <CardContent>
              <Typography>Indi</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card sx={getRightCardStyle()} variant="outlined">
          <CardActionArea>
            <CardContent>
              <Typography>hello</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Stack>
    </div>
  );
}

function getLeftCardStyle() {
  return {
    backgroundColor: "rgba(176, 200, 86, 0.8)",
    width: "40%",
    borderRadius: "15px",
    marginBottom: "10px",
  };
}

function getRightCardStyle() {
  return {
    backgroundColor: "rgba(234, 66, 54, 0.5)",
    width: "40%",
    borderRadius: "15px",
    marginBottom: "10px",
  };
}

function getCardStyle() {
  return {
    widthi: "60%",
    borderRadius: "5px",
    marginBottom: "10px",
  };
}
// {
/* <div data-testid={"owe-card-" + (credit.positive ? "positive" : "negative")}>
<Typography sc={{ fontSize: 14}} color="text-secondary" gutterBottom>{credit.positive ? "Owe Me" : "I Owe"} ❯</Typography>
<Card variant="outlined" sx={getCardStyle(credit)} data-testid="owe-card-card-element">
    <CardActionArea>
        <CardContent>
            <Typography variant="h5" component="div" color="white">{formatter.format(credit.amount)}</Typography>
                <Stack direction="row" alignItems="center">
                    <GroupsIcon fontSize="large" sx={{ color: "white" }}/>
                    <Typography variant="subtitle1" component="div" marginLeft="5px" marginTop="2px" color="white">To {credit.numPeople} people</Typography>
                </Stack>
        </CardContent>
    </CardActionArea>
</Card>
</div> */
// }
