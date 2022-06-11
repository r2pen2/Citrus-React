import "./phoneinput.scss"
import * as React from 'react';
import { useState } from 'react';
import MuiPhoneNumber from 'material-ui-phone-number';
import { Typography, Button, Stack, Snackbar } from "@mui/material"
import axios from "axios";
import MuiAlert from '@mui/material/Alert';

function formatPhoneNumber(num) {
    return "+" + num.replace(/\D/g, '');
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function PhoneInput({ setPage, setPhoneNumber, phoneNumber }) {

    const [errorOpen, setErrorOpen] = useState(false);

    function handleOnChange(value) {
        setPhoneNumber(formatPhoneNumber(value));
    }

    function textMe(num) {
        console.log("Texting: " + num);
        axios.post('http://localhost:3001/send-twilio-auth', { phoneNumber: num, channel: 'sms'})
        .then(setPage(2));
    }

    function callMe(num) {
        //console.log("Calling: " + phoneNumber);
        //axios.post('http://localhost:3001/send-twilio-auth', { phoneNumber: phoneNumber, channel: 'call'})
        //.then(setPage(2));
        setErrorOpen(true);
    }

    const handleErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setErrorOpen(false);
    };

    return (
    <div>  
        <Typography variant="h5" component="div" align="center" paddingTop="20px" sx={{ flexGrow: 1 }}>
            Enter your phone number:
        </Typography>
        <div className="phone-input-container">
            <MuiPhoneNumber defaultCountry={'us'} onChange={handleOnChange}/>
        </div>
        <div className="login-next-button-container">
            <Stack direction="column">
                <Button variant="contained" component="div" onClick={() => textMe(phoneNumber)}>Text Me</Button>
                <div className="call-me-button-container">
                    <Button variant="text" sx={{color: "gray" }} size="small" onClick={() => callMe(phoneNumber)}>Or receive a phone call instead</Button>
                </div>
            </Stack>
        </div>
        <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleErrorClose} >
            <Alert severity="error" sx={{ width: '100%' }}>Calling seems to be broken lmao</Alert>
        </Snackbar>
    </div>
    )
}
