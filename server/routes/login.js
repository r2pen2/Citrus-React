const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

// Bypass Twilio auth for dev
const doAuth = false;

// These are ok to keep on backend, but not wise to put in Git.
const twilio = require('twilio');
const twilioAccountSid = "ACb49af6a1d91d4200ade05590b4df6767";
const twilioAuthToken = "a69e6526d73159746aee2062c576e9d3";
const twilioServiceSid = "VA10a6ace611ddc51e98ee3aab7ce935e3";
const client = new twilio(twilioAccountSid, twilioAuthToken);

router.post("/send-auth", (req, res) => {
    if (doAuth) {
        const phoneNumber = req.body.phoneNumber; 
        const channel = req.body.channel;
        console.log("!LOGIN! Sending auth to [" + phoneNumber + "] via [" + channel + "]");
        client.verify.services(twilioServiceSid).verifications.create({to: phoneNumber, channel: channel});
    } else {
        const phoneNumber = req.body.phoneNumber; 
        const channel = req.body.channel;
        console.log("!LOGIN! Request received to send auth to [" + phoneNumber + " via [" + channel + "] but doAuth is false. No code will be sent.");
    }
})

router.post("/check-auth", (req, res) => {
    if (doAuth) {
        const phoneNumber = req.body.phoneNumber;
        const authCode = req.body.authCode; 
        console.log("!LOGIN! Comparing [" + phoneNumber + "] with code [" + authCode + "]");
        client.verify.services(twilioServiceSid).verificationChecks.create({to: phoneNumber, code: authCode}).then(verification_check => {
            if (verification_check.status === "approved") {
                console.log("!LOGIN! 2FA request for [" + phoneNumber + "] approved!");
            } else {
                console.log("!LOGIN! 2FA code for [" + phoneNumber + "] was not approved.");
            }
            const jsonContent = JSON.stringify(verification_check);
            res.end(jsonContent);
        })
    } else {
        console.log("!LOGIN! Twilio verification bypassed becuase doAuth is false.");
        const jsonContent = JSON.stringify({status: "approved" });
        res.end(jsonContent);
    }
})

module.exports = router