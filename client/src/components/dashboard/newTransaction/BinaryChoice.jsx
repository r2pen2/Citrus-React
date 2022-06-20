// Library imports
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

export default function BinaryChoice({ side, text }) {
  return (
    <div>
      <Card
        variant="outlined"
        sx={[getSize(), getCardStyle({ side })]}
        data-testid="group-or-individual-testid"
        aria-label="Testing testing"
      >
        <CardActionArea sx={getSize()}>
          <CardContent textAlign="center">
            <Typography
              variant="subtitle1"
              component="div"
              marginLeft="5px"
              marginTop="2px"
              color="white"
              sx={{ fontSize: 36 }}
            >
              {text}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}

// onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}
// const handleMouseOver = () => {
//   set;
// };

function getSize() {
  return {
    width: "40vw",
    height: "40vh",
  };
}
function getCardStyle({ side }) {
  const bgColor =
    side === "left" ? "rgba(176, 200, 86, 0.8)" : "rgba(234, 66, 54, 0.5)";
  return {
    backgroundColor: bgColor,
    borderRadius: "50px",
    textAlign: "center",
  };
}
