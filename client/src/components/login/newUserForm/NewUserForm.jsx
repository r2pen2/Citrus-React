// Style imports
import "./newUserForm.scss";

// Library imports
import { Stack, TextField, Typography, Box, Button, ListItem, ListItemText, Collapse } from "@mui/material";
import { useState } from 'react';
import { TransitionGroup } from 'react-transition-group';

// API imports
import axios from '../../../api/axios'
import { auth } from '../../../api/firebase'

// A set of welcome messages to be displayed on the account creation page
// Please feel free to edit these lol
const helloMessages = [
  {
    header: "Hi, there!",
    sub: "I'm not sure we know each other."
  },
  {
    header: "I'm not sure I recognize you.",
    sub: "Let's get you set up with an account!"
  },
  {
    header: "Welcome to the Citrus family!",
    sub: "Let's get you set up with an account."
  },
  {
    header: "Thank's for choosing Citrus!",
    sub: "You're gonna love it."
  },
  {
    header: "Hello? Is there anybody in there?",
    sub: "Just nod if you can hear me."
  },
  {
    header: "All my live I've been waiting for someone like you.",
    sub: "Come on in!"
  },
  {
    header: "And well I, I won't go down by myself",
    sub: "But I'll go down with my friends, yeah!"
  }
]

// Set the hello message to a random one from the array above
// This has to be kept outside of the main function to stop it from changing every time
// the page state is updated for any reason
const helloMsg = helloMessages[Math.floor(Math.random()*helloMessages.length)]

async function getCurrentUser() {

}

export default function NewUserForm({ user, setUser }) {

  // Set phone number from localStorage
  const phoneNumber = localStorage.getItem('login:phone_number');

  // Clear unrelated localStorage vals (may exist if there was a redirect)
  localStorage.removeItem('login:user_id');
  localStorage.removeItem('login:first_name');

  // Define constants
  const [firstName, setFirstName] = useState("");                         // The current user's first name (for account creation)
  const [lastName, setLastName] = useState("");                           // The current user's last name (for account creation)
  const [password, setPassword] = useState("");                           // Current value of password textfield
  const [passwordConfirm, setPasswordConfirm] = useState("");             // Current value of the password confirmation textfield (for account creation)
  const [submitEnable, setSubmitEnable] = useState(false);                // Whether or not the submit button is enabled
  const [passwordFailMessages, setPasswordFailMessages] = useState([]);   // An array of strings describing all of the ways a user fucked up password creation (for account creation)
  const [submitOpacity, setSubmitOpacity] = useState(1);                  // The opacity value of the submit button (for account creation)

  /**
   * Renders a message at the top of the screen welcoming new users
   * @returns {Component} HTML representing the welcome message
   */
  function renderHelloMessage() {
    return (
      <div data-testid="new-user-message">
        <Typography variant="h5" component="div" align="center" sx={{ flexGrow: 1 }}>
          {helloMsg.header}
        </Typography>
        <Typography variant="subtitle2" component="div" align="center" paddingTop="5px" paddingBottom="10px" sx={{ flexGrow: 1, color: "gray" }}>
          {helloMsg.sub}
        </Typography>
      </div>
    )
  }

  /**
   * Determines whether or not the password is valid and sets fail messages if not
   * @returns {Boolean} a boolean value indicating whether or not the password is valid
   */
  function passwordValid() {
    const failMsg = [];
    var passFail = false;
    if (password.length <= 5 || password.length >= 33) {
      failMsg.push("Password must be between 6 and 32 charactes long.");
      passFail = true;
    }
    const number = /\d/;
    if (!number.test(password)) {
      failMsg.push("Password must contain at least one digit.");
      passFail = true;
    }
    // eslint-disable-next-line no-useless-escape
    const specialChar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (!specialChar.test(password)) {
      failMsg.push("Password must contain at least one special character.");
      passFail = true;
    }
    if (passFail) {
      setPasswordFailMessages(failMsg);
      return false;
    }
    if (password !== passwordConfirm) {
      setPasswordFailMessages(["Passwords do not match."])
      return false;
    }
    setPasswordFailMessages([])
    return true;
  }

  /**
   * Enables the submit button if passwords are valid
   * Otherwise sets submit button opacity based on the number of failures
   */
  function enableSubmit() {
    if ((firstName.length > 0) && (lastName.length > 0) && (password.length > 0) && (passwordConfirm.length > 0) && passwordValid()) {
      setSubmitOpacity(1);
      setSubmitEnable(true)
    } else {
      setSubmitOpacity(1 - (passwordFailMessages.length * .5))
      setSubmitEnable(false)
    }
  }

  /**
   * Renders a list of warnings from the passwordFailMessages
   * @returns {Component} HTML representing a list of warnings
   */
  function generateFailMessages() {
    return (
      <div className="fail-msg-container">
        <TransitionGroup>
        {passwordFailMessages.map(msg => {
          return (
            <Collapse key={msg}>
              <ListItem>
                <ListItemText primary={msg} sx={{ color: "red" }}/>
              </ListItem>
            </Collapse>
          );
        })}
        </TransitionGroup>
      </div>
    );
  }

  /**
   * Submits new user data to server for account creation
   */
  function handleSubmit() {
    axios.post("/database/create-new-user", { firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, password:password }).then((res) => {
      console.log("Setting userID to " + res.data.id);
      setUser(res.data.id);
    })
  }

  /**
   * Handle enter keypress in new user creation textfield. Submit new user if inputs are valid.
   * @param {Event} e the event that triggered this function
   */
  function handleEnter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (submitEnable) {
        handleSubmit();
      }
    }
  }

  return (
      <Stack component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }} noValidate autoComplete="off" alignItems="center" display="flex" justifyContent="center" data-testid="new-user-form-wrapper">
        { renderHelloMessage() }
        <Box>
          <TextField autoFocus required id="first-name" label="First Name" onChange={e => setFirstName(e.target.value)} onKeyUp={enableSubmit} onBlur={enableSubmit} data-testid="first-name-input"/>
          <TextField required id="last-name" label="Last Name" onChange={e => setLastName(e.target.value)} onKeyUp={enableSubmit} onBlur={enableSubmit} data-testid="last-name-input"/>
        </Box>
        <Box>
          <TextField required id="password" label="Password" type="password" onChange={e => setPassword(e.target.value)} onKeyUp={enableSubmit} onBlur={enableSubmit} onKeyDown={(e) => {handleEnter(e)}} data-testid="password-input"/>
          <TextField required id="password-confirm" label="Confirm Password" type="password" onChange={e => setPasswordConfirm(e.target.value)} onKeyUp={enableSubmit} onBlur={enableSubmit} onKeyDown={(e) => {handleEnter(e)}} data-testid="password-confirmation-input" />
        </Box>
        { generateFailMessages() }
        <Button variant="contained" component="div" onClick={() => handleSubmit()} disabled={!submitEnable} sx={{ opacity: submitOpacity }} data-testid="submit-button">
          Create my Account!
        </Button>
      </Stack>
  );
}