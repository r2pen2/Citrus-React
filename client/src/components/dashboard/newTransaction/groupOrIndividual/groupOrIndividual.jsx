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
          sx={getCardStyle("left")}
          data-testid="group-or-individual-testid"
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

        <Card
          variant="outlined"
          sx={getCardStyle("right")}
          data-testid="group-or-individual-testid"
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
      </Stack>
    </div>
  );
}

function getCardStyle(side) {
  return {
    backgroundColor:
      side === "left" ? "rgba(176, 200, 86, 0.8)" : "rgba(234, 66, 54, 0.5)",
    width: "60%",
    borderRadius: "5px",
    marginBottom: "10px",
  };
}
