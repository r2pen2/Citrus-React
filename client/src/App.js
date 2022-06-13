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
  const testUser = {
    id: 1,
    firstName: "Joseph",
    lastName: "Dobbelaar",
    phoneNumber: "+17818799058",
    password: "password"
}
  
  const [userId, setUserId] = useState();
  const [user, setUser] = useState();
  const [signedIn, setSignedIn] = useState(false);

  function getUserById(id) { return testUser }

  useEffect(() => {
    if (userId) {
      setSignedIn(true);
      setUser(getUserById(userId));
    } else {
      setSignedIn(false);
      setUser();
    }
  }, [userId]);

  return (
  <Router>
    <ThemeProvider theme={theme}>
      <Topbar user={user} setUser={setUser}/>
      <div className="content">
        <Routes>
          <Route path="/" element={<LoginRedirect user={user}/>} />
          <Route path="/login" element={<Login signedIn={signedIn} user={user} setUser={setUser} userId={userId} setUserId={setUserId}/>} />
          <Route path="/dashboard" element={<Dashboard user={user}/>} />
        </Routes>
      </div>
      <BottomNav active={signedIn}/>
    </ThemeProvider>
  </Router>
  )
}



export default App;
