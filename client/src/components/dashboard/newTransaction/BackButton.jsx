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

export default function BackButton({ add_parameters }) {
  return (
    <div>
      <Fab color="background" aria-label="back-button">
        <ArrowBackIosIcon></ArrowBackIosIcon>
      </Fab>
    </div>
  );
}
