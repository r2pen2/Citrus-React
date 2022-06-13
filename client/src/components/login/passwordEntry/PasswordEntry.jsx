import "./passwordentry.scss";
import { Stack, TextField, Typography, Box, Button, List, ListItem, ListItemText, Collapse } from "@mui/material";
import { useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import axios from 'axios';

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
const helloMsg = helloMessages[Math.floor(Math.random()*helloMessages.length)]

export default function PasswordEntry({ setPage, user, phoneNumber, phoneString }) {
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [submitEnable, setSubmitEnable] = useState(false);
  const [passwordFailMessages, setPasswordFailMessages] = useState([]);
  const [submitOpacity, setSubmitOpacity] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

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

  function enableSubmit() {
    if ((firstName.length > 0) && (lastName.length > 0) && (password.length > 0) && (passwordConfirm.length > 0) && passwordValid()) {
      setSubmitOpacity(1);
      setSubmitEnable(true)
    } else {
      setSubmitOpacity(1 - (passwordFailMessages.length * .5))
      setSubmitEnable(false)
    }
  }

  function generateFailMessages() {
    return (
      <List dense>
        <TransitionGroup>
        {passwordFailMessages.map(msg => {
          return (
            <Collapse key={msg}>
              <ListItem>
                <ListItemText primary={msg} sx={{ color: "red" }}/>
              </ListItem>
            </Collapse>
          )
        })}
        </TransitionGroup>
      </List>
    )
  }

  function makeExistingUserForm() {
    return (
      <Stack
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      alignItems="center"
      display="flex"
      justifyContent="center"
      >
        <Typography variant="h5" component="div" align="center" paddingTop="20px" sx={{ flexGrow: 1 }}>
            Welcome back to Citrus, {user.firstName}!
        </Typography>
        <TextField
          required
          id="password"
          label="Password"
        />
        <div className="login-next-button-container">
          <Stack direction="column">
            <Button variant="contained" component="div" onClick={() => handleSubmitExistingUser()}>Submit</Button>
          </Stack>
        </div>
      </Stack>
    )
  }

  function handleSubmitExistingUser() {
  }

  function handleSubmitNewUser() {
    function hashPassword(p) {
      axios.post("http://localhost:3001/login/hash-password", { password: p }).then((res) => {
        console.log(res)
      })
    }

    hashPassword(password);
    //axios.post("http://localhost:3001/database/add-user", { firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, password: hashPassword(password) });
  }


  function makeNewUserForm() {
    return (
      <Stack
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      alignItems="center"
      display="flex"
      justifyContent="center"
      >
        { renderHelloMessage() }
        <Box>
          <TextField
            autoFocus
            required
            id="first-name"
            label="First Name"
            onChange={e => setFirstName(e.target.value)}
            onKeyUp={enableSubmit}
            onBlur={enableSubmit}
          />
          <TextField
            required
            id="last-name"
            label="Last Name"
            onChange={e => setLastName(e.target.value)}
            onKeyUp={enableSubmit}
            onBlur={enableSubmit}
          />
        </Box>
        <Box>
        <TextField
            required
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            onChange={e => setPassword(e.target.value)}
            onKeyUp={enableSubmit}
            onBlur={enableSubmit}
          />
          <TextField
            required
            id="password-confirm"
            label="Confirm Password"
            type="password"
            onChange={e => setPasswordConfirm(e.target.value)}
            onKeyUp={enableSubmit}
            onBlur={enableSubmit}
          />
        </Box>
        <div className="show-password-button-container">
          <Button variant="text" tabIndex="-1" sx={{color: "gray" }} size="small" onClick={() => setShowPassword(!showPassword)}>Reveal password</Button>
        </div>
        { generateFailMessages() }
        <div className="login-next-button-container">
          <Stack direction="column">
            <Button variant="contained" component="div" onClick={() => handleSubmitNewUser()} disabled={!submitEnable} sx={{ opacity: submitOpacity }}>Submit</Button>
          </Stack>
        </div>
      </Stack>
    )
  }

  return (
    user ? makeExistingUserForm() : makeNewUserForm()
  );
}