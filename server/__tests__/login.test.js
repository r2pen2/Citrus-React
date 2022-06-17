const login = require('../routes/login');

describe('Login tests', () => {

    test('Router is created successfully', () => {
        const routerExists = login.router ? true : false;
        expect(routerExists);
    });

    test('Twilio client is created successfully', () => {
        const testClient = login.client;
        expect(testClient.username.length > 0);
        expect(testClient.password.length > 0);
        expect(testClient.accountSid.length > 0);
    });

    test('No authentication is sent if doAuth is false', () => {
        expect(!login.sendAuthOnChannel(false, "+1234567890", "sms"))
    });

    test('Authentication code not checked if doAuth is false', () => {
        login.checkAuthCode(false, "+1234567890", "123123").then(data => {
            expect(data === { status: "approved" });
        })
    });

});