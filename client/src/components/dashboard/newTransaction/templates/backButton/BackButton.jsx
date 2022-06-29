// Library imports
import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Fab,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export default function BackButton({ onClick }) {
  return (
    <div data-testid="back-button-container">
      <Button
        aria-label="back-button"
        sx={{ backgroundColor: "white", color: "black" }}
        onClick={onClick}
        data-testid="back-button-button"
      >
        <ArrowBackIosIcon
          color="black"
          data-testid="back-button-icon"
        ></ArrowBackIosIcon>
      </Button>
    </div>
  );
}