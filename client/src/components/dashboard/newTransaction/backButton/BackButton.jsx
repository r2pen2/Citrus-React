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

export default function BackButton({ priorHref }) {
  return (
    <div>
      <Button
        aria-label="back-button"
        sx={{ backgroundColor: "white", color: "black" }}
        href={priorHref}
      >
        <ArrowBackIosIcon color="black"></ArrowBackIosIcon>
      </Button>
    </div>
  );
}
