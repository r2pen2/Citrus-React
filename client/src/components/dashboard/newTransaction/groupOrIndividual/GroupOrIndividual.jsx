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
          sx={[getSize(), getCardStyle("left")]}
          data-testid="group-or-individual-testid"
        >
          <CardActionArea sx={getSize()}>
            <CardContent>
              <Typography
                variant="subtitle1"
                component="div"
                marginLeft="5px"
                marginTop="2px"
                color="white"
                sx={{ fontSize: 36 }}
              >
                Group
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card
          variant="outlined"
          sx={[getSize(), getCardStyle("right")]}
          data-testid="group-or-individual-testid"
        >
          <CardActionArea style={getSize()}>
            <CardContent textAlign="center">
              <Typography
                variant="subtitle1"
                component="div"
                marginLeft="5px"
                marginTop="2px"
                color="white"
                sx={{ fontSize: 36 }}
              >
                Individual
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Stack>
    </div>
  );
}

function getSize() {
  return {
    width: "40vw",
    height: "70vh",
  };
}
function getCardStyle(side) {
  return {
    backgroundColor:
      side === "left" ? "rgba(176, 200, 86, 0.8)" : "rgba(234, 66, 54, 0.5)",
    borderRadius: "50px",
    textAlign: "center",
  };
}
