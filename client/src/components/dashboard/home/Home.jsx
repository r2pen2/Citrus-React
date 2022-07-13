// Style imports
import "./home.scss"

// Library imports
import { Stack, Box } from "@mui/material"

// Component imports
import OweCard from "./oweCard/OweCard";
import TransactionsPreview from "./transactionsPreview/TransactionsPreview";
import AnalyticsPreview from "./analyticsPreview/AnalyticsPreview";
import Breadcrumbs from "../../miscellaneous/navigation/breadcrumbs/Breadcrumbs";

export default function Home({ user }) {
  return (
    <Stack spacing={3} className="dashboard-home-container">
      <Breadcrumbs path="Dashboard/Home"/>
      <Box data-testid="owe-cards"> 
        <OweCard credit={{ positive: true, amount: 250, numPeople: 6 }} />
        <OweCard credit={{ positive: false, amount: 42.5, numPeople: 2 }} />
      </Box>
      <div data-testid="transactions">
        <TransactionsPreview recentTransactions={recentTransactionsExample} numDisplayed={2}/>
      </div>
      <AnalyticsPreview chartData={analyticsExample}/>
    </Stack>
  )
}


// This is temporary. We'll pull these vals from the DB when they're actually
// Being stored there.
const recentTransactionsExample = [
    {
      id: "halloweenPartyEample",
      title: "Halloween Party",
      date: "2021-10-31",
      amount: 63.45,
      user: "Oliver Risch"
    },
    {
      id: "drinksExample",
      title: "Drinks",
      date: "2022-03-8",
      amount: 53.25,
      user: "Oliver Risch"
    },
    {
      id: "burritoBowlExample",
      title: "Burrito Bowl",
      date: "2022-03-10",
      amount: 53.25,
      user: "Leo Brougher"
    },
  ]
  
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
  ]