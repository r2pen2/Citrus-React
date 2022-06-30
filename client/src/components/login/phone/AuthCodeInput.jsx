// Style imports
import "./authCodeInput.scss";

// Liibrary Imports
import * as React from 'react';
import { useState } from 'react';
import { Typography, Button, Stack, TextField } from "@mui/material";
import { NotificationManager } from 'react-notifications';

export default function AuthCodeInput({phoneNumber, confirmationResult, resendCode, setUser}) {

  // Clear local storage from further on in auth process
  localStorage.removeItem('login:user_id');
  localStorage.removeItem('login:first_name');

  // Define constants
  const [authCode, setAuthCode] = useState("");                         // Current value of the auth code textfield
  const [submitEnable, setSubmitEnable] = useState(false);              // Whether or not the submit button is enabled

  /**
   * Enable submit button if auth code is long enough
   */
  function enableSubmit() {
    setSubmitEnable(authCode.length === 6);
  }

  /**
   * Set the value of authCode to textfield value on change
   * @param {Event} e onChange event from textfield
   */
  function handleOnChange(e) {
    setAuthCode(e.target.value);
    enableSubmit();
  }

  /**
   * Check whether auth code matches the one sent to user's phone.
   * Fetch user if valid.
   */
  function checkAuthCode() {
    if (authCode.length === 6) {
      // Verify OTP
      console.log(confirmationResult)
      confirmationResult.confirm(authCode).then((result) => {
        setUser(result.user);
        if (result.user.displayName) {
          // If we've logged in this user before, redirect to dashboard
          window.location = "/dashboard";
        } else {
          window.location = "/login/account-creation";
        }
      }).catch((error) => {

      })
    }
  }

  /**
   * Checks auth code on enter keypress in textfield
   * @param {Event} e the event that triggered this function
   */
  function handleEnter(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        checkAuthCode();
      }
  }

  return (
    <div data-testid="auth-code-input">  
      <Typography variant="h5" component="div" align="center" sx={{ flexGrow: 1 }}>
          Enter your 6 digit authentication code:
      </Typography>
      <div className="auth-input-container" data-testid="auth-input-container">
          <TextField autoFocus autoComplete='off' id="auth-code" label="2FA Code" variant="outlined" width="50%" value={authCode} onChange={handleOnChange} onKeyDown={(e) => {handleEnter(e)}} onKeyUp={handleOnChange} onBlur={handleOnChange}/>
      </div>
      <div className="try-again-button-container">
        <Button variant="text" sx={{color: "gray" }} size="small" onClick={() => resendCode(phoneNumber)} data-testid="try-again-button">
          Didn't receive your verification code?
        </Button>
      </div>
      <div className="login-next-button-container">
        <Stack direction="column">
            <Button variant="contained" component="div" onClick={checkAuthCode} disabled={!submitEnable} data-testid="login-next-button">
              Submit
            </Button>
        </Stack>
      </div>
    </div>
  )
}
