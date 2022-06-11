import "./authcodeinput.scss";
import * as React from 'react';
import { useState } from 'react';
import { Typography, Button, Stack, TextField, Snackbar } from "@mui/material";
import axios from "axios";
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AuthCodeInput({ setPage, phoneNumber }) {

    const [snackbarOpen, setSnackbarOpen] = useState(false);

    function resendCode(num) {
        console.log("Texting: " + num);
        axios.post('http://localhost:3001/send-twilio-auth', { phoneNumber: num, channel: 'sms'})
        .then(setSnackbarOpen(true));
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackbarOpen(false);
      };

  return (
    <div>  
        <Typography variant="h5" component="div" align="center" paddingTop="20px" sx={{ flexGrow: 1 }}>
            Enter your 6 digit authentication code:
        </Typography>
        <div className="auth-input-container">
            <TextField id="outlined-basic" label="2FA Code" variant="outlined" width="50%"/>
        </div>
        <div className="try-again-button-container">
                    <Button variant="text" sx={{color: "gray" }} size="small" onClick={() => resendCode(phoneNumber)}>Didn't receive your verification code?</Button>
                </div>
        <div className="login-next-button-container">
            <Stack direction="column">
                <Button variant="contained" component="div">Submit</Button>
            </Stack>
        </div>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          We've sent another verification code to {phoneNumber}!
        </Alert>
      </Snackbar>
    </div>
  )
}
