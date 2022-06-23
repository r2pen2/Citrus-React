// Library imports
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
// import theme from "../../../assets/style/theme";

export default function MultipleChoiceButton({ order, text, href }) {
  return (
    <div>
      <Card
        variant="outlined"
        sx={[getSize(), getStyle(), getColor({ order })]}
        data-testid="group-or-individual-testid"
        // aria-label="Testing testing"
        backgroundColor="primary.main"
      >
        <CardActionArea sx={getSize()} href={href}>
          <CardContent textAlign="center">
            <Typography
              variant="subtitle1"
              component="div"
              marginLeft="5px"
              marginTop="2px"
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
  const yellow = "citrusYellow.main";
  const pink = "citrusPink.main";
  const green = "citrusGreen.main";
  const bgColor = order === 1 ? yellow : order === 2 ? pink : green;
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
