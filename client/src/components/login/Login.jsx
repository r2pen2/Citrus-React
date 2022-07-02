// Style imports
import "./login.scss"

// Library Imports
import { Stack, Paper } from "@mui/material";
import { Route, Routes } from "react-router-dom";

// Component Imports
import Phone from "./phone/Phone";
import NewUserForm from "./newUsers/NewUserForm";
import LoginHome from "./loginHome/LoginHome";
import Logo from "../../assets/images/Logo256.png";


/**
 * Set the document title or redirect to dashboard
 * @param {Object} user current user
 */
function doPageSetup(user) { 
  if (user) {
    window.location = "/dashboard";
  } else {
    document.title = "Citrus | Login";
  }
}

export default function Login({ user, setUser }) {
  
  // Page setup
  doPageSetup(user)

  return (
    <div className="background-controller" data-testid="login-background-controller">
      <Paper className="login-content" elevation={12} sx={{ backgroundColor: '#fafafa', borderRadius: "10px"}}>
        <Stack spacing={3} alignItems="center" justifyContent="center">
          <div className="login-logo-container"> 
            <img src={Logo} alt="logo" className="logo" data-testid="login-logo"></img>
          </div>
          <div className="login-input-window">
            <Routes>
              <Route path="/" element={<LoginHome setUser={setUser}/>}/>
              <Route path="/home" element={<LoginHome setUser={setUser}/>}/>
              <Route path="/phone" element={<Phone setUser={setUser}/>}/>
              <Route path="/account-creation" element={<NewUserForm user={user} setUser={setUser}/>}/>
            </Routes>
          </div>
        </Stack>
      </Paper>
    </div>
  );
}
