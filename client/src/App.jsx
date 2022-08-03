// Style Imports
import theme from "./assets/style/theme";
import "./app.scss";
import "./assets/style/notifications.css";

// Library Imports
import { ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NotificationContainer } from 'react-notifications';
import { useState, useEffect } from 'react';
import { auth, signOutUser } from "./api/firebase";

// Component Imports
import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";
import Topbar from "./components/topbar/Topbar";
import HomePage from "./components/homePage/HomePage";
import DataPage from "./components/dataPage/DataPage";
import UserPage from "./components/userPage/UserPage";

// Data Imports
import creditsData from './assets/json/creditsPage';

// API imports
import { syncUserDoc } from "./api/dbManager";
import { clearLS } from "./api/localStorage";

function App() {

  // Update user when auth changes
  useEffect(() => {
    auth.onAuthStateChanged(u => {
      if (u) {
        syncUserDoc(u);
        localStorage.setItem("citrus:user", JSON.stringify(u));
        localStorage.setItem("citrus:pfpUrl", u.photoURL);
        localStorage.setItem("citrus:displayName", u.displayName);
      }
      else {
        clearLS();
      }
    })
  }, []);

  // If we ever don't have a user stored in localStorage, make sure they're actually singed out!
  if (!localStorage.getItem("citrus:user")) {
    signOutUser();
  }
  

  return (
    <div className="app" data-testid="app-wrapper">
      <Router>
        <ThemeProvider theme={theme}>
          <Topbar/>
            <div className="content" data-testid="app-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login/*" element={<Login/>} />
                <Route path="/dashboard/*" element={<Dashboard/>} />
                <Route path="/user/*" element={<UserPage/>}/>
                <Route path="/credits" element={<DataPage data={creditsData}/>} />
              </Routes>
            </div>
        </ThemeProvider>
        <NotificationContainer />
        <div id="recaptcha-container"></div>
      </Router>
    </div>
  )
}



export default App;
