// Style imports
import "./phoneInput.scss";

// Library imports
import * as React from 'react';
import { useState } from 'react';
import MuiPhoneNumber from 'material-ui-phone-number';
import { Typography, Button, Stack } from "@mui/material";
import { NotificationManager } from 'react-notifications';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth } from '../../../api/firebase';

// API imports
import axios from '../../../api/axios';

// Component imports
import AuthCodeInput from '../authentication/authCodeInput/AuthCodeInput';

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
    const [phoneNumber, setPhoneNumber] = useState(getLsNum());                     // Current value of the phone number textfield
    const [confirmationResult, setConfirmationResult] = useState();                 // Firebase confirmation

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

    function generateRecapcha() {
        console.log(auth)
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
          }, auth);
    }

    /**
     * Asks the server to send an authentication code to the inputted phone number
     * @param {String} num phone number to send auth code to
     */
    function textMe(num) {

        // First, generate captcha
        generateRecapcha();
        let appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, num, appVerifier).then((res) => {
            setConfirmationResult(res);
        }).catch((error) => {
            console.log(error);
        });
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
            e.preventDefault();
            textMe(phoneNumber)
        }
    }

    /**
     * Enables submit button if phone number is valid
     */
    function enableSubmit() {
        setSubmitEnable(numberValid(phoneNumber));
    }

    if (confirmationResult) {
        return <AuthCodeInput confirmationResult={confirmationResult}/>;
    } else {
        return (
            <div data-testid="phone-input-container">  
                <Typography variant="h5" component="div" align="center" sx={{ flexGrow: 1 }}>
                    Enter your phone number:
                </Typography>
                <div className="phone-input-container">
                    <MuiPhoneNumber autoFocus defaultCountry={'us'} onChange={handleOnChange} onKeyDown={(e) => {handleEnter(e)}} onKeyUp={enableSubmit} onBlur={enableSubmit} value={localStorage.getItem('login:phone_number') ? localStorage.getItem('login:phone_number') : ""} data-testid="mui-phone-input"/>
                </div>
                <div className="login-next-button-container">
                    <Stack direction="column">
                        <Button variant="contained" component="div" onClick={() => textMe(phoneNumber)} disabled={!submitEnable} data-testid="text-me-button">Text Me</Button>
                        <div className="call-me-button-container">
                            <Button variant="text" sx={{color: "gray" }} size="small" onClick={() => callMe(phoneNumber)} disabled={!submitEnable} data-testid="call-me-button">Or receive a phone call instead</Button>
                        </div>
                    </Stack>
                </div>
            </div>
        );
    }
}
