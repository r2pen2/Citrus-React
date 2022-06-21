// Library imports
import * as React from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
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
      <Fab
        color="background"
        aria-label="help-button"
        onClick={handleClickOpen}
      >
        <QuestionMarkIcon></QuestionMarkIcon>
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>{informationText}</DialogContentText>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}

//     variant="outlined"
//     sx={[getSize(), getStyle()]}
//     data-testid="info-button-testid"

function getSize() {
  return {
    // width: "10vw",
    // height: "10vh",
  };
}

function getStyle() {
  return {
    // backgroundColor: "grey",
    // borderRadius: "100px",
    // textAlign: "center",
  };
}

<Fab
  //     variant="outlined"
  //     sx={[getSize(), getStyle()]}
  //     data-testid="info-button-testid"
  aria-label="help-button"
  //     onClick={handleClickOpen}
>
  {/* <CardActionArea sx={getSize()}> */}
  {/* <CardContent> */}
  <QuestionMarkIcon></QuestionMarkIcon>
  {/* </CardContent> */}
  {/* </CardActionArea> */}
</Fab>;
