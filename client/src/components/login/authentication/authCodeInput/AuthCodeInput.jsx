// Style imports
import "./authcodeinput.scss";

// Liibrary Imports
import * as React from 'react';
import { useState } from 'react';
import { Typography, Button, Stack, TextField } from "@mui/material";
import { NotificationManager } from 'react-notifications';

// API imports
import axios from '../../../../api/axios';

export default function AuthCodeInput() {

  // Set phone number from localStorage
  const phoneNumber = localStorage.getItem('login:phone_number');

  // Clear local storage from further on in auth process
  localStorage.removeItem('login:user_id');
  localStorage.removeItem('login:first_name');

  // Define constants
  const [authCode, setAuthCode] = useState("");                         // Current value of the auth code textfield
  const [submitEnable, setSubmitEnable] = useState(false);              // Whether or not the submit button is enabled

  /**
   * Resend auth code to phone number
   * @param {String} num phone number to send auth code to
   * @returns {State} user is sent auth code via sms
   */
  function resendCode(num) {
      console.log("Texting: " + num);
      axios.post('/login/send-auth', { phoneNumber: num, channel: 'sms'})
      .then(NotificationManager.success("to " + num, "Code resent!"));
  }

  /**
   * Enable submit button if auth code is long enough
   * @returns {State} submit button enabled (or not)
   */
  function enableSubmit() {
    setSubmitEnable(authCode.length === 6);
  }

  /**
   * Set the value of authCode to textfield value on change
   * @param {Event} e onChange event from textfield
   * @returns {State} authCode is updated to match textfield value
   */
  function handleOnChange(e) {
    setAuthCode(e.target.value);
    enableSubmit();
  }

  /**
   * Check whether auth code matches the one sent to user's phone
   * @returns {State} user fetched from database if auth code is valid
   */
  function checkAuthCode() {
    console.log('Checking auth code...');
    if (authCode.length === 6) {
      axios.post('/login/check-auth', {
        phoneNumber: phoneNumber,
        authCode: authCode
      }).then((res) => {
        const authStatus = res.data.status;
        console.log(authStatus);
        if (authStatus === "approved") {
          window.location = "/login/authentication/fetch-user";
        } else {
          NotificationManager.error("Authentication code does not match!", "Error!")
        }
      });
    } else {
      NotificationManager.error("Invalid format!", "Error!");
    }
  }

  /**
   * Checks auth code on enter keypress in textfield
   * @param {Event} e the event that triggered this function
   */
  function handleEnter(e) {
    if (e.key === "Enter") {
        checkAuthCode();
      }
  }

  return (
    <div>  
      <Typography variant="h5" component="div" align="center" sx={{ flexGrow: 1 }}>
          Enter your 6 digit authentication code:
      </Typography>
      <div className="auth-input-container">
          <TextField autoFocus autoComplete='off' id="auth-code" label="2FA Code" variant="outlined" width="50%" onChange={handleOnChange} onKeyDown={(e) => {handleEnter(e)}} onKeyUp={handleOnChange} onBlur={handleOnChange}/>
      </div>
      <div className="try-again-button-container">
        <Button variant="text" sx={{color: "gray" }} size="small" onClick={() => resendCode(phoneNumber)}>
          Didn't receive your verification code?
        </Button>
      </div>
      <div className="login-next-button-container">
        <Stack direction="column">
            <Button variant="contained" component="div" onClick={checkAuthCode} disabled={!submitEnable}>
              Submit
            </Button>
        </Stack>
      </div>
    </div>
  )
}