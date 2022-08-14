// Style imports
import "./oweCard.scss";

// Library imports
import {
  CardContent,
  CardActionArea,
  Typography,
  Stack,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";

// API imports
import formatter from "../../../../api/formatter";

// Component imports
import { SectionTitle } from "../../../resources/Labels";
import { OutlinedCard } from "../../../resources/Surfaces";

export default function OweCard({ credit }) {
  return (
    <div
      data-testid={"owe-card-" + (credit.positive ? "positive" : "negative")}
      className="owe-card-container"
    >
      <SectionTitle title={credit.positive ? "Owe Me" : "I Owe"} />
      <div className="card-wrapper" data-testid="owe-card-card-element">
        <OutlinedCard borderWeight="2px" borderColor={credit.positive ? "rgba(176, 200, 86, 0.8)" : "rgba(234, 66, 54, 0.5)"} data-testid="owe-card-card-element">
          <CardActionArea>
            <CardContent onClick={() => {window.location = "/dashboard/owe?dir=" + (credit.positive ? "in" : "out")}}>
              <Typography variant="h5" component="div">
                {formatter.format(credit.amount)}
              </Typography>
              <Stack direction="row" alignItems="center">
                <GroupsIcon fontSize="large" />
                <Typography
                  variant="subtitle1"
                  component="div"
                  marginLeft="5px"
                  marginTop="2px"
                >
                  {credit.positive ? "From" : "To"} {credit.numPeople} people
                </Typography>
              </Stack>
            </CardContent>
          </CardActionArea>
        </OutlinedCard>
      </div>
    </div>
  );
}
