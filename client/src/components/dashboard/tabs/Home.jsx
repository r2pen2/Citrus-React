// Library imports
import { Stack, Button } from "@mui/material";

// Component imports
import { DashboardOweCards } from "../../resources/OweCards";
import { TransactionList } from "../../resources/Transactions";
import AnalyticsPreview from "./home/AnalyticsPreview";
import { Breadcrumbs } from "../../resources/Navigation";
import { SectionTitle } from "../../resources/Labels";

// API imports
import { RouteManager } from "../../../api/routeManager";

export default function Home() {

  function handleTransactionsClick() {
    RouteManager.redirectWithHash("dashboard", "transactions");
  }

  return (
    <Stack spacing={3} className="dashboard-home-container">
      <Breadcrumbs path="Dashboard/Home" />
      <DashboardOweCards />
      <div data-testid="transactions">
        <SectionTitle title="Recent Transactions">
          <Button variant="contained" onClick={() => handleTransactionsClick()}>View All Transactions</Button>
        </SectionTitle>
        <TransactionList
          numDisplayed={2}
        />
      </div>
      <div data-testid="analytics">
        <SectionTitle title="Analytics" />
        <AnalyticsPreview chartData={analyticsExample}/>
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
