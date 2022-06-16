// Style imports
import "./phoneinput.scss";

// Library imports
import * as React from 'react';
import { useState } from 'react';
import MuiPhoneNumber from 'material-ui-phone-number';
import { Typography, Button, Stack, Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert';

// API imports
import axios from '../../../api/axios';

/**
 * Removes all special characters from phone number string and adds leading "+"
 * @param {String} num number string to be formatted
 * @returns {String} formatted phone string to be used in DB
 */
function formatPhoneNumber(num) {
    return "+" + num.replace(/\D/g, '');
}

// MUI alert setup
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function PhoneInput({ setPage }) {

    // Set correct stepper page
    setPage(0);

    // Define constants
    const [callErrorOpen, setCallErrorOpen] = useState(false);                      // Whether or not the call error notification is open
    const [invalidNumberErrorOpen, setInvalidNumberErrorOpen] = useState(false);    // Whether or not the invalid number notification is open
    const [submitEnable, setSubmitEnable] = useState(true);                         // Whether or not the submit button is enabled
    const [phoneNumber, setPhoneNumber] = useState(getLsNum());                             // Current value of the phone number textfield
    const [phoneString, setPhoneString] = useState("");                             // Styled string representation of the current phone number (unused atm)

    /**
     * sets phone number value on initialize to localStorage
     * @returns {String} phone number from localStorage
     */
    function getLsNum() {
        return localStorage.getItem('login:phone_number') ? localStorage.getItem('login:phone_number') : "";
    }

    /**
     * Updates state to reflext phone input value
     * @param {String} value phone string value from input box
     * @returns {State} phoneString and phoneNumber updated to match input box
     */
    function handleOnChange(value) {
        setPhoneString(value);
        setPhoneNumber(formatPhoneNumber(value));
    }

    /**
     * Decides if a phone number is valid
     * @param {String} num 
     * @returns {Boolean} whether or not the phone number is valid
     */
    function numberValid(num) {
        return num.length === 12;
    }

    /**
     * Asks the server to send an authentication code to the inputted phone number
     * @param {String} num phone number to send auth code to
     */
    function textMe(num) {

        // Set val in local storage
        localStorage.setItem('login:phone_number', formatPhoneNumber(num));

        if (numberValid(num)) {
            console.log("Texting: " + num);
            axios.post('/login/send-auth', { phoneNumber: num, channel: 'sms'})
            .then(window.location = "/login/authentication");
        } else {
            setInvalidNumberErrorOpen(true);
        }
    }

    /**
     * Asks the server to call the inputted phone number
     * @param {String} num phone number to call
     */
    function callMe(num) {
        //console.log("Calling: " + phoneNumber);
        //axios.post('/send-twilio-auth', { phoneNumber: phoneNumber, channel: 'call'})
        //.then(incrementPage());
        setCallErrorOpen(true);
    }

    /**
     * Sets callErrorOpen to false on close
     * @param {Event} event event that triggered error close
     * @param {String} reason reason for error close
     * @returns {State} callErrorOpen set to false
     */
    const handleCallErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setCallErrorOpen(false);
    };

    /**
     * Sets invalidNumberErrorOpen to false on close
     * @param {Event} event event that triggered error close
     * @param {String} reason reason for error close
     * @returns {State} invalidNumberErrorOpen set to false
     */
    const handleInvalidNumberErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setInvalidNumberErrorOpen(false);
    };

    /**
     * Handles enter keypress in textfields. Sends verification
     * code if number is valid.
     * @param {Event} e event that triggered function
     * @returns {State} text sent if number is valid
     */
    function handleEnter(e) {
        if (e.key === "Enter") {
            textMe(phoneNumber)
        }
    }

    /**
     * Enables submit button if phone number is valid
     * @returns {State} submit button enabled (or not)
     */
    function enableSubmit() {
        setSubmitEnable(numberValid(phoneNumber));
    }

    return (
        <div>  
            <Typography variant="h5" component="div" align="center" sx={{ flexGrow: 1 }}>
                Enter your phone number:
            </Typography>
            <div className="phone-input-container">
                <MuiPhoneNumber autoFocus defaultCountry={'us'} onChange={handleOnChange} onKeyDown={(e) => {handleEnter(e)}} onKeyUp={enableSubmit} onBlur={enableSubmit} value={localStorage.getItem('login:phone_number') ? localStorage.getItem('login:phone_number') : ""}/>
            </div>
            <div className="login-next-button-container">
                <Stack direction="column">
                    <Button variant="contained" component="div" onClick={() => textMe(phoneNumber)} disabled={!submitEnable}>Text Me</Button>
                    <div className="call-me-button-container">
                        <Button variant="text" sx={{color: "gray" }} size="small" onClick={() => callMe(phoneNumber)} disabled={!submitEnable}>Or receive a phone call instead</Button>
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
    );
}
