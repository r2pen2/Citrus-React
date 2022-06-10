import { ThemeProvider } from "@mui/material"
import { useState, useEffect } from 'react'

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./components/login/Login"
import Dashboard from "./components/dashboard/Dashboard"
import Topbar from "./components/topbar/Topbar"
import BottomNav from "./components/bottomnav/BottomNav"

import theme from "./assets/style/theme"

function App() {

  const testUser = {
    firstName: "Joseph",
    lastName: "Dobbelaar",
    phoneNumber: "+17818799058",
    password: "password"
  }
  const [user, setUser] = useState();

  const [signedIn, setSignedIn] = useState(true);

  useEffect(() => {
    if (user) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  }, [user]);

  return (
    <Router>
    <ThemeProvider theme={theme}>
      <Topbar user={user}/>
      <div className="content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard user={user}/>} />
        </Routes>
      </div>
      <BottomNav active={signedIn}/>
    </ThemeProvider>
  </Router>
  )
}



export default App;
