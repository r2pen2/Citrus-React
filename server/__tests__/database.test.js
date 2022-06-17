const database = require('../routes/database');

describe("Database test", () => {

    test('Router is created successfully', () => {
        const routerExists = database.router ? true : false;
        expect(routerExists);
    });

    test("Throws an error when asked to lookup a null id", () => {
        expect(database.findHashByUserId(null)).rejects.toEqual("No ID provided!");
        expect(database.findUserById(null)).rejects.toEqual("No ID provided!");
    });

    test("Throws an error when asked to lookup a null phoneNumber", () => {
        expect(database.findUserByPhoneNumber(null)).rejects.toEqual("No phone number provided!");
    });

});