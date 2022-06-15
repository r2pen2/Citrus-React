import "./authcodeinput.scss";
import * as React from 'react';
import { useState } from 'react';
import { Typography, Button, Stack, TextField, Snackbar } from "@mui/material";
import axios from '../../../api/axios'
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AuthCodeInput({ incrementPage, phoneNumber, findUser }) {

    const [resendMessageOpen, setResendMessageOpen] = useState(false);
    const [formatMessageOpen, setFormatMessageOpen] = useState(false);
    const [errorMessageOpen, setErrorMessageOpen] = useState(false);
    const [authCode, setAuthCode] = useState("");
    const [submitEnable, setSubmitEnable] = useState(false);

    function resendCode(num) {
        console.log("Texting: " + num);
        axios.post('/login/send-auth', { phoneNumber: num, channel: 'sms'})
        .then(setResendMessageOpen(true));
    }

    function enableSubmit() {
      setSubmitEnable(authCode.length === 6);
    }

    const handleResendMessageClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setResendMessageOpen(false);
    };

    const handleErrorMessageClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setErrorMessageOpen(false);
    };

    const handleFormatMessageClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setFormatMessageOpen(false);
    };

    function handleOnChange(e) {
      setAuthCode(e.target.value);
    }

    function checkAuthCode() {
      if (authCode.length === 6) {
        axios.post('/login/check-auth', {
          phoneNumber: phoneNumber,
          authCode: authCode
        }).then((res) => {
          const authStatus = res.data.status;
          console.log(authStatus);
          if (authStatus === "approved") {
            incrementPage();
            findUser();
          } else {
            setErrorMessageOpen(true);
          }
        });
      } else {
        setFormatMessageOpen(true);
      }
    }

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
            <TextField autoFocus id="auth-code" label="2FA Code" variant="outlined" width="50%" onChange={handleOnChange} onKeyDown={(e) => {handleEnter(e)}} onKeyUp={enableSubmit} onBlur={enableSubmit}/>
        </div>
        <div className="try-again-button-container">
                    <Button variant="text" sx={{color: "gray" }} size="small" onClick={() => resendCode(phoneNumber)}>Didn't receive your verification code?</Button>
                </div>
        <div className="login-next-button-container">
            <Stack direction="column">
                <Button variant="contained" component="div" onClick={checkAuthCode} disabled={!submitEnable}>Submit</Button>
            </Stack>
        </div>
        <Snackbar open={resendMessageOpen} autoHideDuration={6000} onClose={handleResendMessageClose}>
          <Alert onClose={handleResendMessageClose} severity="success" sx={{ width: '100%' }}>
            We've sent another verification code to {phoneNumber}!
          </Alert>
        </Snackbar>
        <Snackbar open={formatMessageOpen} autoHideDuration={6000} onClose={handleFormatMessageClose}>
          <Alert onClose={handleFormatMessageClose} severity="error" sx={{ width: '100%' }}>
            Authentication code not formatted correctly!
          </Alert>
        </Snackbar>
        <Snackbar open={errorMessageOpen} autoHideDuration={6000} onClose={handleErrorMessageClose}>
          <Alert onClose={handleErrorMessageClose} severity="error" sx={{ width: '100%' }}>
            Authentication code invalid!
          </Alert>
        </Snackbar>
    </div>
  )
}
