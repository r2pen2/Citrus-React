import { ThemeProvider } from "@mui/material"
import { useState, useEffect } from 'react'

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./components/login/Login"
import LoginRedirect from "./components/login/LoginRedirect"
import Dashboard from "./components/dashboard/Dashboard"
import Topbar from "./components/topbar/Topbar"
import BottomNav from "./components/bottomnav/BottomNav"

import theme from "./assets/style/theme"
import axios from "axios";

function App() {
  
  const [user, setUser] = useState();
  const [signedIn, setSignedIn] = useState(false);

  return (
  <Router>
    <ThemeProvider theme={theme}>
      <Topbar user={user} setUser={setUser} signedIn={signedIn}/>
      <div className="content">
        <Routes>
          <Route path="/" element={<LoginRedirect signedIn={signedIn} />} />
          <Route path="/login" element={<Login signedIn={signedIn} setSignedIn={setSignedIn} user={user} setUser={setUser}/>} />
          <Route path="/dashboard" element={<Dashboard user={user} signedIn={signedIn}/>} />
        </Routes>
      </div>
      <BottomNav active={signedIn}/>
    </ThemeProvider>
  </Router>
  )
}



export default App;
