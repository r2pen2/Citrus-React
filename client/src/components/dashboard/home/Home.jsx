// Style imports
import "./home.scss";

// Library imports
import { Stack, Box, Button } from "@mui/material";

// Component imports
import OweCard from "./oweCard/OweCard";
import { TransactionList } from "../../resources/Transactions";
import AnalyticsPreview from "./analyticsPreview/AnalyticsPreview";
import { Breadcrumbs } from "../../resources/Navigation";
import { SectionTitle } from "../../resources/Labels";

export default function Home({ user }) {
  return (
    <Stack spacing={3} className="dashboard-home-container">
      <Breadcrumbs path="Dashboard/Home" />
      <Box data-testid="owe-cards">
        <div className="owe-cards-row">
          <OweCard credit={{ positive: true, amount: 250, numPeople: 6 }} />
          <div className="spacer"></div>
          <OweCard credit={{ positive: false, amount: 42.5, numPeople: 2 }} />
        </div>
      </Box>
      <div data-testid="transactions">
        <SectionTitle title="Transactions">
          <Button variant="contained" onClick={() => window.location = "/dashboard/transactions/"}>View All Transactions</Button>
        </SectionTitle>
        <TransactionList
          user={user}
          numDisplayed={2}
        />
      </div>
      <div data-testid="analytics">
        <SectionTitle title="Analytics" />
        <AnalyticsPreview chartData={analyticsExample} />
      </div>
    </Stack>
  );
}
// This is temporary. We'll pull these vals from the DB when they're actually
// Being stored there.
const analyticsExample = [
  {
    id: 1,
    month: "January",
    amount: 500,
  },
  {
    id: 2,
    month: "February",
    amount: 750,
  },
  {
    id: 3,
    month: "March",
    amount: 300,
  },
  {
    id: 4,
    month: "April",
    amount: 500,
  },
  {
    id: 5,
    month: "May",
    amount: 750,
  },
  {
    id: 6,
    month: "June",
    amount: 300,
  },
];
