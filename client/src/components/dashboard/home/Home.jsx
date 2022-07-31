// Style imports
import "./home.scss";

// Library imports
import { Stack, Box, Typography, Button } from "@mui/material";

// Component imports
import OweCard from "./oweCard/OweCard";
import TransactionList from "../transactions/transactionList/TransactionList";
import AnalyticsPreview from "./analyticsPreview/AnalyticsPreview";
import {Breadcrumbs} from "../../resources/Navigation";

export default function Home({ user }) {
  return (
    <Stack spacing={3} className="dashboard-home-container">
      <Breadcrumbs path="Dashboard/Home" />
      <Box data-testid="owe-cards">
        <OweCard credit={{ positive: true, amount: 250, numPeople: 6 }} />
        <OweCard credit={{ positive: false, amount: 42.5, numPeople: 2 }} />
      </Box>
      <div data-testid="transactions">
        <div className="title">
          <Typography sc={{ fontSize: 14}} color="text-secondary" gutterBottom>Transactions ❯</Typography>
          <Button variant="contained" onClick={() => window.location = "/dashboard/transactions/"}>View All Transactions</Button>
        </div>
        <TransactionList
          user={user}
          numDisplayed={2}
        />
      </div>
      <AnalyticsPreview chartData={analyticsExample} />
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
