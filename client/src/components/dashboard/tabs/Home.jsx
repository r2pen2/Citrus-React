// Library imports
import { Stack, Button } from "@mui/material";

// Component imports
import { DashboardOweCards } from "../../resources/OweCards";
import { TransactionList } from "../../resources/Transactions";
import AnalyticsPreview from "./home/AnalyticsPreview";
import { Breadcrumbs } from "../../resources/Navigation";
import { SectionTitle } from "../../resources/Labels";
import { HomeFriendsList } from "../../resources/Friends";

// API imports
import { RouteManager } from "../../../api/routeManager";

export default function Home() {

  function handleTransactionsClick() {
    RouteManager.redirectWithHash("dashboard", "transactions");
  }

  function renderAnalytics(visible) {
    if (visible) {
      return (
        <div>
          <SectionTitle title="Analytics" />
          <AnalyticsPreview chartData={analyticsExample}/>
        </div>
      )
    }
  }

  return (
    <div className="d-flex flex-column gap-10">
      <Breadcrumbs path="Dashboard/Home" />
      <DashboardOweCards />
      <div>
        <SectionTitle title="Recent Transactions">
          <Button variant="contained" onClick={() => handleTransactionsClick()}>View All Transactions</Button>
        </SectionTitle>
        <TransactionList
          numDisplayed={5}
        />
      </div>
      <div>
        <SectionTitle title="Friends">
          <Button variant="contained" onClick={() => handleTransactionsClick()}>Add Friends</Button>
        </SectionTitle>
        <HomeFriendsList />
      </div>
      <div>
        <SectionTitle title="Groups">
          <Button variant="contained" onClick={() => handleTransactionsClick()}>Add Groups</Button>
        </SectionTitle>
      </div>
      {renderAnalytics(false)}
    </div>
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
