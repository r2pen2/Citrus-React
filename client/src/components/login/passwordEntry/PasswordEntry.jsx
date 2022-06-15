// Style imports
import "./passwordentry.scss";

// Library imports
import { Stack, TextField, Typography, Box, Button, ListItem, ListItemText, Collapse } from "@mui/material";
import { useState } from 'react';
import { TransitionGroup } from 'react-transition-group';

// API imports
import axios from '../../../api/axios'

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

export default function PasswordEntry({ phoneNumber, user, setUserById }) {
  
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
      <div>
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
   * @returns {State} passwordFailMessages will be updated to show password issues
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
   * @returns {State} submit button styled according to password data
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
   * Render a form for existing users to login with
   * @returns {Component} A form for existing users to enter their password
   */
  function makeExistingUserForm() {
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
            Welcome back to Citrus, {user.firstName}!
        </Typography>
        <TextField required id="password" label="Password" />
        <div className="login-next-button-container">
          <Stack direction="column">
            <Button variant="contained" component="div" onClick={() => handleSubmitExistingUser()}>
              Submit
            </Button>
          </Stack>
        </div>
      </Stack>
    )
  }

  /**
   * @todo implement this method
   * Submit existing user password to server for validation
   * @returns {State} existing user will be logged in
   */
  function handleSubmitExistingUser() {
  }

  /**
   * Submits new user data to server for account creation
   * @returns {State} user will be created on DB and set in localStorage
   */
  function handleSubmitNewUser() {
    axios.post("/database/create-new-user", { firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, password:password }).then((res) => {
      console.log("Setting userID to " + res.data.id);
      setUserById(res.data.id);
    })
  }

  /**
   * Handle enter keypress in new user creation textfield. Submit new user if inputs are valid.
   * @param {Event} e the event that triggered this function
   */
  function handleNewUserEnter(e) {
    if (e.key === "Enter") {
      if (submitEnable) {
        handleSubmitNewUser();
      }
    }
  }

  /**
   * Render a form for new users to create their account
   * @returns {Component} A form for new users to create their account
   */
  function makeNewUserForm() {
    return (
      <Stack component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }} noValidate autoComplete="off" alignItems="center" display="flex" justifyContent="center">
        { renderHelloMessage() }
        <Box>
          <TextField autoFocus required id="first-name" label="First Name" onChange={e => setFirstName(e.target.value)} onKeyUp={enableSubmit} onBlur={enableSubmit} />
          <TextField required id="last-name" label="Last Name" onChange={e => setLastName(e.target.value)} onKeyUp={enableSubmit} onBlur={enableSubmit} />
        </Box>
        <Box>
          <TextField required id="password" label="Password" type="password" onChange={e => setPassword(e.target.value)} onKeyUp={enableSubmit} onBlur={enableSubmit} onKeyDown={(e) => {handleNewUserEnter(e)}} />
          <TextField required id="password-confirm" label="Confirm Password" type="password" onChange={e => setPasswordConfirm(e.target.value)} onKeyUp={enableSubmit} onBlur={enableSubmit} onKeyDown={(e) => {handleNewUserEnter(e)}} />
        </Box>
        { generateFailMessages() }
        <Button variant="contained" component="div" onClick={() => handleSubmitNewUser()} disabled={!submitEnable} sx={{ opacity: submitOpacity }}>
          Create my Account!
        </Button>
      </Stack>
    )
  }

  // If we have a user, display the existing user form.
  // Otherwise, display the account creation form.
  return (
    user ? makeExistingUserForm() : makeNewUserForm()
  );
}