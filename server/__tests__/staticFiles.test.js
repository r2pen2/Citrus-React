const staticFiles = require('../routes/staticFiles')

describe("Static tests", () => {

    test('Router is created successfully', () => {
        const routerExists = staticFiles.router ? true : false;
        expect(routerExists);
    });

});