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
 * @param {Object} u current user
 */
async function doPageSetup(u) { 
  if (u) {
    window.location = "/dashboard";
  } else {
    document.title = "Citrus | Login";
  }
}

export default function Login() {
  const user = JSON.parse(localStorage.getItem("citrus:user"));
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
              <Route path="/" element={<LoginHome/>}/>
              <Route path="/home" element={<LoginHome/>}/>
              <Route path="/phone" element={<Phone/>}/>
              <Route path="/account-creation" element={<NewUserForm/>}/>
            </Routes>
          </div>
        </Stack>
      </Paper>
    </div>
  );
}
