// Style Imports
import theme from "./assets/style/theme";
import "./app.scss";
import "./assets/style/notifications.css";

// Library Imports
import { ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NotificationContainer } from 'react-notifications';
import { useEffect } from 'react';

// Component Imports
import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";
import Topbar from "./components/topbar/Topbar";
import HomePage from "./components/homePage/HomePage";
import UserPage from "./components/userPage/UserPage";

// API imports
import { SessionManager } from "./api/sessionManager";
import { auth } from "./api/firebase";

function App() {

  // Update user when auth changes
  useEffect(() => {
    auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // Set session details
        SessionManager.setUser(authUser);
        SessionManager.setPfpUrl(authUser.photoURL);
        SessionManager.setDisplayName(authUser.displayName);

        // Sync user's DB doc
        const userManager = SessionManager.getCurrentUserManager();
        const userAlreadyExists = await userManager.documentExists();
        if (userAlreadyExists) {
          // User already exists on DB
        } else {
          // User doesn't already exist (somehow...)
        }
      }
      else {
        // Sign user out
        SessionManager.clearLS();
      }
    })
  }, []);

  // I present to you: Citrus Financial
  return (
    <div className="app" data-testid="app-wrapper">
      <Router>
        <ThemeProvider theme={theme}>
          <Topbar/>
            <div className="content" data-testid="app-content">
              <Routes>
                <Route path="*" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login/*" element={<Login/>} />
                <Route path="/dashboard/*" element={<Dashboard/>} />
                <Route path="/user/*" element={<UserPage/>}/>
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
