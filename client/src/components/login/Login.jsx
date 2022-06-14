import "./login.scss"

import { useState, useEffect, useRef } from 'react';
import { Stack, Box, Stepper, Step, StepLabel } from "@mui/material";
import logo from "../../assets/images/Logo256.png";

import axios from 'axios'

import LoginHome from "./loginHome/LoginHome";
import PhoneInput from "./phoneInput/PhoneInput";
import AuthCodeInput from "./authCodeInput/AuthCodeInput";
import PasswordEntry from "./passwordEntry/PasswordEntry";


export default function Login({ setSignedIn, signedIn, user, setUser }) {

  // Redirect to dashboard if we're signed in
  if (signedIn) {
    window.location = "/dashboard";
  }

  const [page, setPage] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneString, setPhoneString] = useState("");

  function setUserById(id) {
    axios.post("http://localhost:3001/database/get-user-by-id", { id: id }).then((res) => {
      if (res.data) {
        setSignedIn(true);
        setUser(res.data);
      }
    })
  }

  function findUserByPhoneNumber() {
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
        return <PhoneInput setPage={setPage} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} setPhoneString={setPhoneString}/>;
      case 2:
        return <AuthCodeInput setPage={setPage} phoneNumber={phoneNumber} findUser={findUserByPhoneNumber}/>;
      case 3:
        return <PasswordEntry phoneNumber={phoneNumber} user={user} setUserById={setUserById}/>;
      default:
        return <div>Error 404: Page not found</div>;
    }
  }

  const steps = [
    'Enter your phone number',
    'Verify your phone number',
    'Sign in',
    'Start splitting payments'
  ];

  function displaySteps(p) {
    if (p > 0) {
      return (
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={p-1} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      );
    }
  }

  return (
    <Stack spacing={3} marginTop="50px" marginLeft="75px" marginRight="75px" alignItems="center" justifyContent="center">
      <div className="login-logo-container"> 
        <img src={logo} alt="logo" className="logo"></img>
      </div>
      { getLoginPage(page) }
      <div className="stepper-wrapper">
        { displaySteps(page) }
      </div>
    </Stack>
  )
}
