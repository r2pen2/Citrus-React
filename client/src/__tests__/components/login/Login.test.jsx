import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../../components/login/Login';
import { BrowserRouter as Router } from "react-router-dom";
import { signInTestUser, signOutTestUser } from "../../../api/testing";

describe("Login render tests", () => {

    test("Background controller renders", () => {
        render(<Router><Login /></Router>);
        const backgroundController = screen.getByTestId("login-background-controller");
        expect(backgroundController).toBeVisible();
    });

    test("Logo renders", () => {
        render(<Router><Login/></Router>);
        const loginLogo = screen.getByTestId("login-logo");
        expect(loginLogo).toBeVisible();
    });

    test("First render shows login home page", () => {
        render(<Router><Login/></Router>);
        const backgroundController = screen.getByTestId("login-background-controller");
        const loginHome = screen.getByTestId("login-home");
        expect(backgroundController).toContainElement(loginHome);
        const authentication = screen.queryByTestId("authentication-wrapper");
        expect(backgroundController).not.toContainElement(authentication);
    });
    
});

describe("Login function tests", () => {
    test("User is redirected to dashboard if signed in", () => {
        document.title = "Something else!";
        signInTestUser();
        render(<Router><Login/></Router>);
        expect(document.title).not.toEqual("Citrus | Login");
        signOutTestUser();
    });

    test("User not redirected if not signed in", () => {
        document.title = "Something else!";
        signOutTestUser();
        render(<Router><Login/></Router>);
        expect(document.title).toEqual("Citrus | Login");
    });
});