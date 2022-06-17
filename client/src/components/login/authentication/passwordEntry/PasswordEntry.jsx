// Style imports
import "./passwordentry.scss";

// Library imports
import { Stack, TextField, Typography, Box, Button, ListItem, ListItemText, Collapse } from "@mui/material";
import { useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { NotificationManager } from 'react-notifications';

// API imports
import axios from '../../../../api/axios'

/**
 * Checks for a phone number in localStorage
 * @returns {Boolean} whether or not we have a phone number stored in LS
 */
function phoneNumberExistsInLs() {
  return localStorage.getItem('login:phone_number') ? true : false;
}

export default function PasswordEntry({ setUserById }) {

  // Redirect if we got here too early
  if (!localStorage.getItem('login:first_name')) {
    window.location = "/login";
  }

  // Or if we got here by accident...
  if (localStorage.getItem('login:user_id') === 'undefined' && phoneNumberExistsInLs()) {
    window.location = "/login/account-creation";
  }

  // Define constants
  const [password, setPassword] = useState("");                     // Current value of password textfield
  const [submitEnable, setSubmitEnable] = useState(false);          // Whether or not the submit button is enabled

  /**
   * Enables the submit button if passwords are valid
   * Otherwise sets submit button opacity based on the number of failures
   * @returns {State} submit button styled according to password data
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
    // Get localStorage items
    const id = localStorage.getItem('login:user_id');

    // First find out if the password is valid. 
    // !!!We want to do this on the server!!!
    axios.post("database/check-password", { userId: id, password: password }).then((res) => {
      // Handle server response. Workflow is very similar to Twilio response in AuthCodeInput.jsx
      if (res.data.result === 'accepted') {
        // Password was correct
        console.log("Password accepted!");
        setUserById(id);
      } else {
        // Password was WRONG! You IDIOT!
        NotificationManager.error('Invalid password!', 'Error!');
      }
    })
  }

  /**
   * Handle enter keypress in new user creation textfield. Submit new user if inputs are valid.
   * @param {Event} e the event that triggered this function
   */
   function handleEnter(e) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  /**
   * Gets first name from localStorage and removes quotation marks
   */
  function getFirstName() {
    return localStorage.getItem('login:first_name').replaceAll('"', '');
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
    >
      <Typography variant="h5" component="div" align="center" paddingTop="20px" sx={{ flexGrow: 1 }}>
          Welcome back to Citrus, {getFirstName()}!
      </Typography>
      <TextField required type="password" id="password" label="Password" autoComplete='off' onChange={e => setPassword(e.target.value)} onKeyUp={enableSubmit} onBlur={enableSubmit} onKeyDown={(e) => {handleEnter(e)}} />
      <div className="login-next-button-container">
        <Stack direction="column">
          <Button variant="contained" component="div" onClick={() => handleSubmit()}>
            Submit
          </Button>
        </Stack>
      </div>
    </Stack>
  );
}