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
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

export default function InfoButton({ informationText }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        sx={{ backgroundColor: "white", color: "black" }}
        aria-label="help-button"
        onClick={handleClickOpen}
        size="large"
      >
        <QuestionMarkIcon></QuestionMarkIcon>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>{informationText}</DialogContentText>
          <DialogActions>
            <Button sx={{ color: "black" }} size="large" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
