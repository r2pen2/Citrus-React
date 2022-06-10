import "./dashboard.sass"
import { Stack } from "@mui/material"
import DashboardOweCard from "../dashboardOweCard/DashboardOweCard"

export default function Dashboard({ name }) {
  return (
    <Stack spacing={2} marginTop="50px" marginLeft="50px" marginRight="50px">
      <DashboardOweCard credit={{ positive: true, amount: 250, numPeople: 6 }} />
      <DashboardOweCard credit={{ positive: false, amount: 42.5, numPeople: 2 }} />
    </Stack>
  )
}
