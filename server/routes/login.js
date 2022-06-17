// Library imports
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');

// Set up router
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

/**
 * Send auth code to user on specified channel.
 * @param {Boolean} authEnabled whether or not to actually send the authentication message
 * @param {String} phoneNumber string representing the user's phone number (with leading +)
 * @param {String} channel channel to send authentication code on
 * @returns {Boolean} whether or not an authentication code was sent (for testing)
 */
function sendAuthOnChannel(authEnabled, phoneNumber, channel) {
    if (authEnabled) {
        console.log("!LOGIN! Sending auth to [" + phoneNumber + "] via [" + channel + "]");
        client.verify.services(twilioServiceSid).verifications.create({to: phoneNumber, channel: channel});
        return true;
    } else {
        console.log("!LOGIN! Request received to send auth to [" + phoneNumber + " via [" + channel + "] but doAuth is false. No code will be sent.");
        return false;
    }
}

/**
 * Send auth code to user on specified channel.
 * @param {Boolean} authEnabled whether or not to actually send the authentication message
 * @param {String} phoneNumber string representing the user's phone number (with leading +)
 * @param {String} authCode auth code to compare with Twilio verification API
 * @returns {Object} JSON object containing authentication status
 */
async function checkAuthCode(authEnabled, phoneNumber, authCode) {
    return new Promise((resolve) => {
        if (authEnabled) {
            console.log("!LOGIN! Comparing [" + phoneNumber + "] with code [" + authCode + "]");
            client.verify.services(twilioServiceSid).verificationChecks.create({to: phoneNumber, code: authCode}).then(verification_check => {
                if (verification_check.status === "approved") {
                    console.log("!LOGIN! 2FA request for [" + phoneNumber + "] approved!");
                } else {
                    console.log("!LOGIN! 2FA code for [" + phoneNumber + "] was not approved.");
                }
                resolve(verification_check);
            });
        } else {
            console.log("!LOGIN! Twilio verification bypassed becuase doAuth is false.");
            resolve({ status: "approved" });
        }
    });
}

/**
 * Receive a POST request at "/login/send-auth" containing a phone number and a verification channel.
 * If doAuth is true, send a Twilio authentication code via the specified channel. Currently, SMS is the
 * only channel that works.
 */
router.post("/send-auth", async (req, res) => {
    const phoneNumber = req.body.phoneNumber; 
    const channel = req.body.channel;
    sendAuthOnChannel(doAuth, phoneNumber, channel);
});

/**
 * Receive a POST request at "/login/check-auth" containing a phone number and an authentication code.
 * If doAuth is true, ask Twilio if the code matches the one sent to the phone number. Send the response back
 * to the client, where it will be handled.
 */
router.post("/check-auth", async (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    const authCode = req.body.authCode; 
    let data = await checkAuthCode(doAuth, phoneNumber, authCode);
    const jsonContent = JSON.stringify(data);
    res.end(jsonContent);
})

module.exports = {
    router: router,
    client: client,
    sendAuthOnChannel: sendAuthOnChannel,
    checkAuthCode: checkAuthCode,
}