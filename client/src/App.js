import { ThemeProvider } from "@mui/material"
import { useState, useEffect } from 'react'

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./components/login/Login"
import LoginRedirect from "./components/login/LoginRedirect"
import Dashboard from "./components/dashboard/Dashboard"
import Topbar from "./components/topbar/Topbar"
import BottomNav from "./components/bottomnav/BottomNav"

import theme from "./assets/style/theme"



function App() {


  function getUserFromLS() {
    return JSON.parse(localStorage.getItem('user'));
  }

  const user = getUserFromLS();

  return (
  <Router>
    <ThemeProvider theme={theme}>
      <Topbar user={user}/>
      <div className="content">
        <Routes>
          <Route path="/" element={<LoginRedirect user={user} />} />
          <Route path="/login" element={<Login user={user}/>} />
          <Route path="/dashboard" element={<Dashboard user={user}/>} />
        </Routes>
      </div>
      <BottomNav user={user}/>
    </ThemeProvider>
  </Router>
  )
}



export default App;
