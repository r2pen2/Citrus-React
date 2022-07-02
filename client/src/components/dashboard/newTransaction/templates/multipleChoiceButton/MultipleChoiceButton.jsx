// Style imports
import multipleChoiceButton from "./multipleChoiceButton.scss";

// Library imports
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

// index={index}
// choice={option}
// field="Affiliation"
// updateValue={updateValue}
// nextStep={nextStep}

export default function MultipleChoiceButton({
  index,
  choice,
  field,
  updateValue,
  nextStep,
}) {
  function handleClick() {
    updateValue(field.toLowerCase(), choice);
    nextStep();
  }

  return (
    <div
      key={index}
      data-testid="multiple-choice-button-container"
      onClick={() => handleClick()}
    >
      <Card
        variant="outlined"
        sx={[getSize(), getStyle(), getColor(index)]}
        data-testid="multiple-choice-button-card"
      >
        <CardActionArea sx={getActionAreaStyle()}>
          <CardContent sx={{ padding: "0px" }}>
            <Typography sx={{ fontSize: 24 }}>{choice}</Typography>
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
function getColor(index) {
  const yellow = "citrusYellow.main";
  const pink = "citrusPink.main";
  const green = "citrusGreen.main";
  const bgColor = index === 0 ? yellow : index === 1 ? pink : green;
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
