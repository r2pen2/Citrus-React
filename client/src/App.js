import { ThemeProvider } from "@mui/material"

import Dashboard from "./components/dashboard/Dashboard"
import Topbar from "./components/topbar/Topbar"
import BottomNav from "./components/bottomnav/BottomNav"

import theme from "./assets/style/theme"

function App() {
  return (
  <ThemeProvider theme={theme}>
    <Topbar name="Joseph Dobbelaar"/>
    <Dashboard />
    <BottomNav />
  </ThemeProvider>
  )
}

export default App;
