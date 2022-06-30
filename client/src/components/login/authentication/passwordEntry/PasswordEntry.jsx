// Style imports
import "./passwordEntry.scss";

// Library imports
import { Stack, TextField, Typography, Button } from "@mui/material";
import { useState } from 'react';
import { NotificationManager } from 'react-notifications';

// API imports
import axios from '../../../../api/axios'

export default function PasswordEntry({ user, setUser }) {

  // Define constants
  const [password, setPassword] = useState("");                     // Current value of password textfield
  const [submitEnable, setSubmitEnable] = useState(false);          // Whether or not the submit button is enabled

  /**
   * Enables the submit button if passwords are valid
   * Otherwise sets submit button opacity based on the number of failures
   */
  function enableSubmit() {
    setSubmitEnable(password.length > 0);
  }

  /**
   * Handles submit button press for existing user.
   * Checks password with DB and continues to dashboard if valid.
   * Otherwise, display error.
   */
  function handleSubmit() {
    // TODO implement
  }

  /**
   * Handle enter keypress in new user creation textfield. Submit new user if inputs are valid.
   * @param {Event} e the event that triggered this function
   */
   function handleEnter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <Stack
    component="form"
    sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
    noValidate
    autoComplete="off"
    alignItems="center"
    display="flex"
    justifyContent="center"
    data-testid="password-entry-wrapper"
    >
      <Typography variant="h5" component="div" align="center" paddingTop="20px" sx={{ flexGrow: 1 }} data-testid="password-entry-welcome-text">
          Welcome back to Citrus, {user.displayName}!
      </Typography>
      <TextField required type="password" id="password" label="Password" autoComplete='off' onChange={e => setPassword(e.target.value)} onKeyUp={enableSubmit} onBlur={enableSubmit} onKeyDown={(e) => {handleEnter(e)}} data-testid="password-input"/>
      <div className="login-next-button-container">
        <Stack direction="column">
          <Button variant="contained" component="div" onClick={() => handleSubmit()} disabled={!submitEnable} data-testid="password-entry-submit-button">
            Submit
          </Button>
        </Stack>
      </div>
    </Stack>
  );
}