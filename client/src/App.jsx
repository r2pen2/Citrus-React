// Style Imports
import theme from "./assets/style/theme";
import "./app.scss";
import "./assets/style/notifications.css";

// Library Imports
import { ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NotificationContainer } from 'react-notifications';

// Component Imports
import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";
import Topbar from "./components/topbar/Topbar";
import HomePage from "./components/homePage/HomePage";
import DataPage from "./components/dataPage/DataPage";
import UserPage from "./components/userPage/UserPage";

// Data Imports
import creditsData from './assets/json/creditsPage';

/**
 * Fetches user data from localStorage
 * @returns {Object} user from localStorage
 */
function getUserFromLS() {
  return JSON.parse(localStorage.getItem('user'));
}

function App() {

  // Set current user
  const user = getUserFromLS();

  return (
    <div className="app" data-testid="app-wrapper">
      <Router>
        <ThemeProvider theme={theme}>
          <Topbar user={user}/>
            <div className="content" data-testid="app-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login/*" element={<Login user={user}/>} />
                <Route path="/dashboard/*" element={<Dashboard user={user}/>} />
                <Route path="/user/*" element={<UserPage data={user}/>}/>
                <Route path="/credits" element={<DataPage data={creditsData}/>} />
              </Routes>
            </div>
        </ThemeProvider>
        <NotificationContainer />
      </Router>
    </div>
  )
}



export default App;
