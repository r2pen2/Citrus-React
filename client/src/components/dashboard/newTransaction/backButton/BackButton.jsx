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
      <Fab
        color="background"
        aria-label="back-button"
        style={{ border: "none" }}
        // onClick={() => {
        //   this.props.goBack();
        // }}
        href={priorHref}
      >
        <ArrowBackIosIcon></ArrowBackIosIcon>
      </Fab>
    </div>
  );
}
