// Style imports
import "./phoneinput.scss";

// Library imports
import * as React from 'react';
import { useState } from 'react';
import MuiPhoneNumber from 'material-ui-phone-number';
import { Typography, Button, Stack } from "@mui/material";
import { NotificationManager } from 'react-notifications';

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

export default function PhoneInput() {

    
    // Clear local storage from further on in auth process
    localStorage.removeItem('login:user_id');
    localStorage.removeItem('login:first_name');

    // Define constants
    const [submitEnable, setSubmitEnable] = useState(true);                         // Whether or not the submit button is enabled
    const [phoneNumber, setPhoneNumber] = useState(getLsNum());                             // Current value of the phone number textfield

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
     */
    function handleOnChange(value) {
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
            NotificationManager.error("Invalid phone number!", "Error!");
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
        NotificationManager.info("This feature is currently disabled.", "Sorry!");
    }

    /**
     * Handles enter keypress in textfields. Sends verification
     * code if number is valid.
     * @param {Event} e event that triggered function
     */
    function handleEnter(e) {
        if (e.key === "Enter") {
            textMe(phoneNumber)
        }
    }

    /**
     * Enables submit button if phone number is valid
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
        </div>
    );
}
