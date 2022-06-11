import "./login.scss"

import { useState, useEffect } from 'react'
import { Stack, Typography, Button } from "@mui/material"
import logo from "../../assets/images/Logo256.png"

import LoginHome from "./loginHome/LoginHome"
import PhoneInput from "./phoneInput/PhoneInput"
import AuthCodeInput from "./authCodeInput/AuthCodeInput"



export default function Login() {

  const [page, setPage] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");

  document.title = "Citrus | Login";

  function getLoginPage(page) {
    switch (page) {
      case 0:
        return <LoginHome setPage={setPage} />;
      case 1:
        return <PhoneInput setPage={setPage} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}/>;
      case 2:
        return <AuthCodeInput setPage={setPage} phoneNumber={phoneNumber}/>;
      case 3:
        return <div>Account creation</div>;
      default:
        return <div>Page not found</div>;
    }
  }

  return (
    <Stack spacing={3} marginTop="50px" marginLeft="75px" marginRight="75px">
      <div className="login-logo-container"> 
        <img src={logo} alt="logo" className="logo"></img>
      </div>
      { getLoginPage(page) }
    </Stack>
  )
}
