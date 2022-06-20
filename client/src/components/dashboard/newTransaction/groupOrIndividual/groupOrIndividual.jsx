// Style imports
// import "./grouporindividual.scss";

// Library imports
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

// Component imports
import QuestionBox from "../questionBox/QuestionBox";

export default function GroupOrIndividualBox() {
  return (
    <div>
      <Stack
        direction="row"
        spacing={5}
        marginTop="50px"
        justifyContent="center"
      >
        <Card
          variant="outlined"
          sx={getLeftCardStyle()}
          data-testid="owe-card-card-element"
        >
          <CardActionArea>
            <CardContent>
              <Stack direction="row" alignItems="center">
                <Typography
                  variant="subtitle1"
                  component="div"
                  marginLeft="5px"
                  marginTop="2px"
                  color="white"
                >
                  Group
                </Typography>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>

        <div className="binary-choice-button left">
          <Typography>Group</Typography>
        </div>
      </Stack>
    </div>
  );
}

{
  /* <Card className="binary-choice-button right" variant="outlined">
<CardActionArea>
  <CardContent>
    <Typography>Individual</Typography>
  </CardContent>
</CardActionArea>
</Card> */
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
