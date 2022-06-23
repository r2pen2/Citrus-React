// Library imports
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function NavArrow({ direction }) {
  return (
    <Card
      variant="outlined"
      sx={[getSize(), getCardStyle()]}
      data-testid="nav-arrow-testid"
    >
      <CardActionArea sx={getSize()}>
        <CardContent textAlign="center">{getArrow({ direction })}</CardContent>
      </CardActionArea>
    </Card>
  );
}

function getArrow({ direction }) {
  const arrow =
    direction === "forward" ? (
      <ArrowForwardIosIcon></ArrowForwardIosIcon>
    ) : (
      <ArrowBackIosIcon></ArrowBackIosIcon>
    );
  return arrow;
}
function getSize() {
  return {
    width: "20vw",
    height: "10vh",
  };
}
function getCardStyle() {
  return {
    backgroundColor: "white",
    borderRadius: "50px",
    textAlign: "center",
  };
}
