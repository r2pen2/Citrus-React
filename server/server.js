const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 

const app = express();
app.use(cors())
app.use(bodyParser.json());

const twilio = require('twilio');


app.post("/send-twilio-auth", (req, res) => {

    // These are ok to keep on backend, but not wise to put in Git.
    const accountSid = "ACb49af6a1d91d4200ade05590b4df6767";
    const authToken = "a69e6526d73159746aee2062c576e9d3";
    const serviceSid = "VA10a6ace611ddc51e98ee3aab7ce935e3";

    const client = new twilio(accountSid, authToken);

    const phoneNumber = req.body.phoneNumber; 
    const channel = req.body.channel;
    console.log(phoneNumber);
    console.log(channel);

    client.verify.services(serviceSid).verifications.create({to: phoneNumber, channel: channel}).then(verification => console.log(verification.status));
})

app.post("/check-twilio-verification", (req, res) => {

    // These are ok to keep on backend, but not wise to put in Git.
    const accountSid = "ACb49af6a1d91d4200ade05590b4df6767";
    const authToken = "a69e6526d73159746aee2062c576e9d3";
    const serviceSid = "VA10a6ace611ddc51e98ee3aab7ce935e3";

    const client = new twilio(accountSid, authToken);

    const phoneNumber = req.body.phoneNumber; 
    console.log(phoneNumber);

    client.verify.services(serviceSid).verifications.create({to: phoneNumber, channel: 'sms'}).then(verification => console.log(verification.status));
})

app.listen(3001)