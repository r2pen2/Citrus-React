// Style imports
import "./login.scss"

// Library Imports
import { Stack, Paper } from "@mui/material";
import { Route, Routes } from "react-router-dom";

// Component Imports
import Phone from "./phone/Phone";
import NewUserForm from "./newUsers/NewUserForm";
import LoginHome from "./loginHome/LoginHome";
import { SpinningLogo } from "../resources/Login";

// API imports
import { RouteManager } from "../../api/routeManager";

export default function Login() {
  RouteManager.redirectToDashboardOrSetTitle("Login");

  return (
    <div className="background-controller" data-testid="login-background-controller">
      <Paper className="login-content" elevation={12}>
        <div className="center-contents column">
          <SpinningLogo />
          <div className="login-input-window">
            <Routes>
              <Route path="/" element={<LoginHome/>}/>
              <Route path="/home" element={<LoginHome/>}/>
              <Route path="/phone" element={<Phone/>}/>
              <Route path="/account-creation" element={<NewUserForm/>}/>
            </Routes>
          </div>
        </div>
      </Paper>
    </div>
  );
}
