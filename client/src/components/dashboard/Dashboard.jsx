import "./dashboard.scss"
import { Stack, Box } from "@mui/material"
import DashboardOweCard from "./dashboardOweCard/DashboardOweCard"
import DashboardTransactions from "./dashboardTransactions/DashboardTransactions"
import DashboardAnalytics from "./dashboardAnalytics/DashboardAnalytics"

/**
 * If we're not signed in, redirect to login.
 * Othwerwise, set the document title and continue to dashboard.
 * @param {Object} user The current user (if it exists)
 * @returns {State} Either a redirect or continues to dashboard
 */
 function doPageSetup(user) {
  if (!user) {
    window.location = "/login";
  }
  document.title = "Citrus | Dashboard";
}

export default function Dashboard({ user }) {

  // Set up page
  doPageSetup(user)

  return (
    <Stack spacing={3} marginTop="50px" marginLeft="75px" marginRight="75px" paddingBottom="100px">
      <Box> 
        <DashboardOweCard credit={{ positive: true, amount: 250, numPeople: 6 }} />
        <DashboardOweCard credit={{ positive: false, amount: 42.5, numPeople: 2 }} />
      </Box>
      <DashboardTransactions recentTransactions={recentTransactionsExample} numDisplayed={2}/>
      <DashboardAnalytics chartData={analyticsExample}/>
    </Stack>
  )
}

// This is temporary. We'll pull these vals from the DB when they're actually
// Being stored there.
const recentTransactionsExample = [
  {
    title: "Halloween Party",
    date: "2021-10-31",
    amount: 63.45,
    user: "Oliver Risch"
  },
  {
    title: "Drinks",
    date: "2022-03-8",
    amount: 53.25,
    user: "Oliver Risch"
  },
  {
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