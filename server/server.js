const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 

const app = express();
app.use(cors())
app.use(bodyParser.json());

const twilio = require('twilio');

// These are ok to keep on backend, but not wise to put in Git.
const accountSid = "ACb49af6a1d91d4200ade05590b4df6767";
const authToken = "a69e6526d73159746aee2062c576e9d3";
const serviceSid = "VA10a6ace611ddc51e98ee3aab7ce935e3";

const client = new twilio(accountSid, authToken);


app.post("/send-twilio-auth", (req, res) => {
    const phoneNumber = req.body.phoneNumber; 
    const channel = req.body.channel;
    console.log(phoneNumber);
    console.log(channel);
    client.verify.services(serviceSid).verifications.create({to: phoneNumber, channel: channel}).then(verification => console.log(verification.status));
})

app.post("/check-twilio-verification", (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    const authCode = req.body.authCode; 
    console.log(phoneNumber);
    console.log(authCode);
    client.verify.services(serviceSid).verificationChecks.create({to: phoneNumber, code: authCode}).then(verification_check => {
        const jsonContent = JSON.stringify(verification_check);
        res.end(jsonContent);
    })
})

app.post("/get-user-by-id", (req, res) => {
    console.log("Getting user: " + req.body.id)

    const testUser = {
        id: 1,
        firstName: "Joseph",
        lastName: "Dobbelaar",
        phoneNumber: "+17818799058",
        password: "password"
    }

    const jsonContent = JSON.stringify({
        id: testUser.id,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        phoneNumber: testUser.phoneNumber,
    })

    res.end(jsonContent);
})

app.listen(3001)