// Style imports
import "./oweCard.scss";

// Library imports
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Stack,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";

// API imports
import formatter from "../../../../api/formatter";

// Component imports
import ColoredCard from "../../../resources/surfaces/ColoredCard";

export default function OweCard({ credit }) {
  return (
    <div
      data-testid={"owe-card-" + (credit.positive ? "positive" : "negative")}
      className="owe-card-container"
    >
      <Typography sc={{ fontSize: 14 }} color="text-secondary" gutterBottom>
        {credit.positive ? "Owe Me" : "I Owe"} ❯
      </Typography>
      <div className="card-wrapper" data-testid="owe-card-card-element">
        <ColoredCard color={credit.positive ? "rgba(176, 200, 86, 0.8)" : "rgba(234, 66, 54, 0.5)"} data-testid="owe-card-card-element">
          <CardActionArea>
            <CardContent onClick={() => {window.location = "/dashboard/owe?dir=" + (credit.positive ? "in" : "out")}}>
              <Typography variant="h5" component="div" color="white">
                {formatter.format(credit.amount)}
              </Typography>
              <Stack direction="row" alignItems="center">
                <GroupsIcon fontSize="large" sx={{ color: "white" }} />
                <Typography
                  variant="subtitle1"
                  component="div"
                  marginLeft="5px"
                  marginTop="2px"
                  color="white"
                >
                  {credit.positive ? "From" : "To"} {credit.numPeople} people
                </Typography>
              </Stack>
            </CardContent>
          </CardActionArea>
        </ColoredCard>
      </div>
    </div>
  );
}
