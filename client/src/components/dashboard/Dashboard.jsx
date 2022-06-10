import "./dashboard.sass"
import { Stack } from "@mui/material"
import DashboardOweCard from "./dashboardOweCard/DashboardOweCard"
import DashboardTransactions from "./dashboardTransactions/DashboardTransactions"

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

export default function Dashboard() {
  return (
    <Stack spacing={2} marginTop="50px" marginLeft="75px" marginRight="75px">
      <DashboardOweCard credit={{ positive: true, amount: 250, numPeople: 6 }} />
      <DashboardOweCard credit={{ positive: false, amount: 42.5, numPeople: 2 }} />
      <DashboardTransactions recentTransactions={recentTransactionsExample} numDisplayed={2}/>
    </Stack>
  )
}