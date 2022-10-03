// Style imports
import "./avatarButton.scss";

// Library imports
import { Avatar, Box, IconButton, Typography } from "@mui/material";

// API imports
import { Debugger } from "../../../../api/debugger";

// when we integrate backend, will just take user
export default function AvatarButton({
  index,
  firstName,
  avatarSrc,
  size,
  selectedFriendName,
  setSelectedFriendName,
  setSelectedFriendId,
}) {
  const isSelected = selectedFriendName === firstName;

  function handleClick() {
    Debugger.log("selected friend: " + selectedFriendName);
    Debugger.log("this person: " + firstName);
    if (isSelected) {
      setSelectedFriendName("");
      setSelectedFriendId("");
    } else {
      setSelectedFriendName(firstName);
      setSelectedFriendId(index);
    }
  }

  function getButtonSize(size) {
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

  function getAvatarStyle(size, isSelected) {
    const margin =
      size === "small" ? "10px" : size === "medium" ? "15px" : "20px";
    const diameter =
      size === "small" ? "60px" : size === "medium" ? "90px" : "120px";
    const borderWidth = isSelected ? "10px" : "0px";
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
      <Box textAlign="center">
        <IconButton style={getButtonSize(size)}>
          <Avatar src={avatarSrc} style={getAvatarStyle(size, isSelected)} />
        </IconButton>
      </Box>
      <Typography className="avatar-button-label">{firstName}</Typography>
    </div>
  );
}
