// Style imports
import "./forwardButton.scss";

// library imports
import { IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function ForwardButton({ onClick }) {
  return (
    <div>
      <IconButton
        onClick={onClick}
        sx={{
          backgroundColor: "citrusGreen.main",
          color: "black",
        }}
        size="large"
      >
        <ArrowForwardIcon />
      </IconButton>
    </div>
  );
}
