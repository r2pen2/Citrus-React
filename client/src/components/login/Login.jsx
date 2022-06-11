import "./login.scss"

import { useState, useEffect, useContext } from 'react';
import AuthContext from "../../context/AuthProvider";
import { Stack, Typography, Button } from "@mui/material";
import logo from "../../assets/images/Logo256.png";

import axios from 'axios'

import LoginHome from "./loginHome/LoginHome";
import PhoneInput from "./phoneInput/PhoneInput";
import AuthCodeInput from "./authCodeInput/AuthCodeInput";



export default function Login({ signedIn }) {

  const { setAuth } = useContext(AuthContext);

  // Redirect to dashboard if we're signed in
  if (signedIn) {
    window.location = "/dashboard"
  }

  const [page, setPage] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [user, setUser] = useState({});

  function findUser() {
    console.log("Checking if user is in database...");
      try {
        axios.post("http://localhost:3001/database/get-user-by-number", { phoneNumber: phoneNumber }).then((res) => {
          console.log(res)
        });
      } catch (err) {
        console.log(err);
      }
  }

  document.title = "Citrus | Login";

  function getLoginPage(page) {
    switch (page) {
      case 0:
        return <LoginHome setPage={setPage} />;
      case 1:
        return <PhoneInput setPage={setPage} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}/>;
      case 2:
        return <AuthCodeInput setPage={setPage} phoneNumber={phoneNumber} findUser={findUser}/>;
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
