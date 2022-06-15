// Style Imports
import theme from "./assets/style/theme"
import "./app.scss"

// Library Imports
import { ThemeProvider } from "@mui/material"
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Component Imports
import Login from "./components/login/Login"
import Dashboard from "./components/dashboard/Dashboard"
import Topbar from "./components/topbar/Topbar"
import BottomNav from "./components/bottomNav/BottomNav"
import HomePage from "./components/homePage/HomePage"
import BoringPage from "./components/boringPage/BoringPage"

// Data Imports
import creditsData from './assets/json/creditsPage'


function App() {


  function getUserFromLS() {
    return JSON.parse(localStorage.getItem('user'));
  }

  const user = getUserFromLS();

  return (
    <div className="app">
        <Router>
    <ThemeProvider theme={theme}>
      <Topbar user={user}/>
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/home" element={<HomePage/>} />
          <Route path="/login" element={<Login user={user}/>} />
          <Route path="/dashboard" element={<Dashboard user={user}/>} />
          <Route path="/credits" element={<BoringPage data={creditsData}/>} />
        </Routes>
      </div>
      <BottomNav user={user}/>
    </ThemeProvider>
  </Router>
    </div>
  )
}



export default App;
