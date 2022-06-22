// Library imports
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

export default function MultipleChoiceButton({ order, text }) {
  return (
    <div>
      <Card
        variant="outlined"
        sx={[getSize(), getStyle(), getColor({ order })]}
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
              // color="white"
              sx={{ fontSize: 24 }}
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
    width: "55vw",
    height: "10vh",
  };
}
function getColor({ order }) {
  const yellow = "#EEEEEE";
  const red = "#F4A09A";
  const green = "#B0C856";
  const bgColor = order === 1 ? yellow : order === 2 ? red : green;
  return {
    backgroundColor: bgColor,
  };
}
function getStyle() {
  return {
    borderRadius: "20px",
    textAlign: "center",
  };
}
