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

    const [callErrorOpen, setCallErrorOpen] = useState(false);
    const [invalidNumberErrorOpen, setInvalidNumberErrorOpen] = useState(false);

    function handleOnChange(value) {
        setPhoneNumber(formatPhoneNumber(value));
    }

    function numberValid(num) {
        return num.length === 12;
    }

    function textMe(num) {
        if (numberValid(num)) {
            console.log("Texting: " + num);
            axios.post('http://localhost:3001/login/send-auth', { phoneNumber: num, channel: 'sms'})
            .then(setPage(2));
        } else {
            setInvalidNumberErrorOpen(true);
        }
    }

    function callMe(num) {
        //console.log("Calling: " + phoneNumber);
        //axios.post('http://localhost:3001/send-twilio-auth', { phoneNumber: phoneNumber, channel: 'call'})
        //.then(setPage(2));
        setCallErrorOpen(true);
    }

    const handleCallErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setInvalidNumberErrorOpen(false);
    };

    const handleInvalidNumberErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setCallErrorOpen(false);
    };

    function handleEnter(e) {
        if (e.key === "Enter") {
            textMe(phoneNumber)
        }
    }

    return (
    <div>  
        <Typography variant="h5" component="div" align="center" paddingTop="20px" sx={{ flexGrow: 1 }}>
            Enter your phone number:
        </Typography>
        <div className="phone-input-container">
            <MuiPhoneNumber defaultCountry={'us'} onChange={handleOnChange} onKeyDown={(e) => {handleEnter(e)}}/>
        </div>
        <div className="login-next-button-container">
            <Stack direction="column">
                <Button variant="contained" component="div" onClick={() => textMe(phoneNumber)}>Text Me</Button>
                <div className="call-me-button-container">
                    <Button variant="text" sx={{color: "gray" }} size="small" onClick={() => callMe(phoneNumber)}>Or receive a phone call instead</Button>
                </div>
            </Stack>
        </div>
        <Snackbar open={callErrorOpen} autoHideDuration={6000} onClose={handleCallErrorClose} >
            <Alert severity="error" sx={{ width: '100%' }}>Calling seems to be broken lmao</Alert>
        </Snackbar>
        <Snackbar open={invalidNumberErrorOpen} autoHideDuration={6000} onClose={handleInvalidNumberErrorClose} >
            <Alert severity="error" sx={{ width: '100%' }}>The phone number entered is not a valid length.</Alert>
        </Snackbar>
    </div>
    )
}
