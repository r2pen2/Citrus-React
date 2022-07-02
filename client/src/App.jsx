// Style Imports
import theme from "./assets/style/theme";
import "./app.scss";
import "./assets/style/notifications.css";

// Library Imports
import { ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NotificationContainer } from 'react-notifications';
import { useState, useEffect } from 'react';
import { auth } from "./api/firebase";

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

function App() {

  // Set current user (from LS cache or leave null until firebase auth returns a value)
  const [user, setUser] = useState(localStorage.getItem("citrus:user") ? JSON.parse(localStorage.getItem("citrus:user")) : null);

  // Update user when auth changes
  useEffect(() => {
    auth.onAuthStateChanged(u => {
      if (u) {
        setUser(u);
      }
      else {
        setUser(null);
      }
    })
  }, []);

  // Sync database with user state whenever it changes (also triggered on page load)
  useEffect(() => {
    if (user) {
      syncUserDoc(user);
    }
  }, [user])
  

  return (
    <div className="app" data-testid="app-wrapper">
      <Router>
        <ThemeProvider theme={theme}>
          <Topbar user={user}/>
            <div className="content" data-testid="app-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login/*" element={<Login user={user} setUser={setUser}/>} />
                <Route path="/dashboard/*" element={<Dashboard user={user}/>} />
                <Route path="/user/*" element={<UserPage user={user}/>}/>
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
