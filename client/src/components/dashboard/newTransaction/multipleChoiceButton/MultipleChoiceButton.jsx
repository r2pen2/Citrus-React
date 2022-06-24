// Style imports
import multipleChoiceButton from "./multipleChoiceButton.scss";

// Library imports
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

export default function MultipleChoiceButton({ order, text, href }) {
  return (
    <div className="owe-card-container">
      <Card
        // className="large-choice-card"
        variant="outlined"
        sx={[getSize(), getStyle(), getColor({ order })]}
        data-testid="multiple-choice-button-testid"
      >
        <CardActionArea href={href} sx={getActionAreaStyle()}>
          <CardContent sx={{ padding: "0px" }}>
            <Typography
              // variant="subtitle1"
              // component="div"
              // marginTop="2px"
              // align="center"
              // gutterBottom={true}
              sx={{ fontSize: 24 }}
            >
              {text}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}

function getContentStyle() {
  return {
    padding: "0px",
  };
}

function getActionAreaStyle() {
  return {
    textAlign: "center",
    paddingTop: "4.5vh",
    paddingBottom: "5vh",
    width: "50vw",
    height: "12vh",
  };
}

function getSize() {
  return {
    width: "50vw",
    height: "12vh",
    // paddingTop: "50px",
  };
}
function getColor({ order }) {
  const yellow = "citrusYellow.main";
  const pink = "citrusPink.main";
  const green = "citrusGreen.main";
  const bgColor = order === 1 ? yellow : order === 2 ? pink : green;
  return {
    backgroundColor: bgColor,
  };
}
function getStyle() {
  return {
    borderRadius: "20px",
    // textAlign: "center",
  };
}
