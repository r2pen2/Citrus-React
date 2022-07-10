// Style imports
import "./avatarButton.scss";

// Library imports
import { Avatar, IconButton } from "@mui/material";
import { useState } from "react";

// when we integrate backend, will just take user
export default function AvatarButton({ index, firstName, avatarSrc, size }) {
  const [selected, setSelected] = useState(false);
  function handleClick() {
    if (selected === true) {
      setSelected(false);
    } else {
      setSelected(true);
    }
  }

  function getButtonStyle(size) {
    const margin =
      size === "small" ? "10px" : size === "medium" ? "15px" : "20px";
    const diameter =
      size === "small" ? "60px" : size === "medium" ? "80px" : "100px";

    return {
      margin: margin,
      height: diameter,
      width: diameter,
    };
  }

  function getAvatarStyle(size, selected) {
    const margin =
      size === "small" ? "10px" : size === "medium" ? "15px" : "20px";
    const diameter =
      size === "small" ? "60px" : size === "medium" ? "80px" : "100px";
    const borderWidth = selected === true ? "10px" : "0px";
    return {
      margin: margin,
      height: diameter,
      width: diameter,
      border: "solid",
      borderWidth: borderWidth,
      borderColor: "citrusGreen",
    };
  }

  return (
    <div
      key={index}
      data-testid="avatar-button-container"
      onClick={() => handleClick()}
    >
      <IconButton style={getButtonStyle(size)}>
        <Avatar src={avatarSrc} style={getAvatarStyle(size, selected)} />
      </IconButton>
    </div>
  );
}
