// Style imports
import "./avatarButton.scss";

// Library imports
import { Avatar, IconButton } from "@mui/material";

export default function AvatarButton({
  index,
  updateValue,
  nextStep,
  firstName,
  avatarSrc,
}) {
  function handleClick() {
    updateValue("friend", firstName);
    nextStep();
  }

  return (
    <div
      key={index}
      data-testid="avatar-button-container"
      onClick={() => handleClick()}
    >
      <IconButton>
        <Avatar
          src={avatarSrc}
          style={{
            margin: "10px",
            width: "60px",
            height: "60px",
          }}
        />
      </IconButton>
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
