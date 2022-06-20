import * as React from "react";

// Library imports
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
      <Card
        variant="outlined"
        sx={[getSize(), getCardStyle()]}
        data-testid="nav-arrow-testid"
        onClick={handleClickOpen}
      >
        <CardActionArea sx={getSize()}>
          <CardContent>
            <QuestionMarkIcon></QuestionMarkIcon>
          </CardContent>
        </CardActionArea>
      </Card>
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

function getSize() {
  return {
    width: "20vw",
    height: "10vh",
  };
}
function getCardStyle() {
  return {
    backgroundColor: "grey",
    borderRadius: "50px",
    textAlign: "center",
  };
}
