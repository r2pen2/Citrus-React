import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../../components/login/Login';
import { BrowserRouter as Router } from "react-router-dom";

const testUser = { firstName: "John", lastName: "Doe" }

describe("Login render tests", () => {

    test("Background controller renders", () => {
        render(<Router><Login user={null}/></Router>);
        const backgroundController = screen.getByTestId("login-background-controller");
        expect(backgroundController).toBeVisible();
    });

    test("Logo renders", () => {
        render(<Router><Login user={null}/></Router>);
        const loginLogo = screen.getByTestId("login-logo");
        expect(loginLogo).toBeVisible();
    });

    test("First render shows phone input page", () => {
        render(<Router><Login user={null}/></Router>);
        const backgroundController = screen.getByTestId("login-background-controller");
        const phoneInput = screen.getByTestId("phone-input-container");
        expect(backgroundController).toContainElement(phoneInput);
        const authentication = screen.queryByTestId("authentication-wrapper");
        expect(backgroundController).not.toContainElement(authentication);
    });
    
});

describe("Login function tests", () => {
    test("User is redirected to dashboard if signed in", () => {
        document.title = "Something else!";
        render(<Router><Login user={testUser}/></Router>);
        expect(document.title).not.toEqual("Citrus | Login");
    });

    test("User not redirected if not signed in", () => {
        document.title = "Something else!";
        render(<Router><Login user={null}/></Router>);
        expect(document.title).toEqual("Citrus | Login");
    });
});