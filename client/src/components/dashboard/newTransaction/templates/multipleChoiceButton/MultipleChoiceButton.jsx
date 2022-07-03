// Style imports
import multipleChoiceButton from "./multipleChoiceButton.scss";

// Library imports
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

export default function MultipleChoiceButton({
  index,
  choice,
  field,
  updateValue,
  nextStep,
  size = "large",
  avatar = NULL,
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
        sx={[getSize(size), getStyle(), getColor(index)]}
        data-testid="multiple-choice-button-card"
        className="multiple-choice-button"
      >
        <CardActionArea sx={getActionAreaStyle(size)}>
          <CardContent sx={{ padding: "0px" }}>
            <Typography sx={{ fontSize: getFontSize(size) }}>
              {choice}
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

function getActionAreaStyle(size) {
  const cardHeight = size === "large" ? "12vh" : "6vh";
  return {
    textAlign: "center",
    height: cardHeight,
  };
}

function getSize(size) {
  if (size === "large") {
    return {
      width: "50vw",
      height: "12vh",
    };
  } else {
    return {
      width: "40vw",
      height: "6vh",
    };
  }
}

function getFontSize(size) {
  if (size === "large") {
    return 24;
  } else {
    return 20;
  }
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
  };
}
