import "./dashboard.scss"
import { Stack, Box } from "@mui/material"
import DashboardOweCard from "./dashboardOweCard/DashboardOweCard"
import DashboardTransactions from "./dashboardTransactions/DashboardTransactions"
import DashboardAnalytics from "./dashboardAnalytics/DashboardAnalytics"

export default function Dashboard({ user }) {

  document.title = "Citrus | Dashboard"

  function checkForUser() {
    return user ? true : false;
  }
  const signedIn = checkForUser();

  if (!signedIn) {
    console.log("!DASHBOARD! Not signed in")
    window.location = "/login"
  }

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