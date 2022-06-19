import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Authentication from '../../../components/login/authentication/Authentication';
import { BrowserRouter as Router } from "react-router-dom";

describe("Authentication render tests", () => {

    test("Authentication wrapper renders", () => {
        render(<Router><Authentication setUserById={() => {}}/></Router>);
        const authentication = screen.getByTestId("authentication-wrapper");
        expect(authentication).toBeVisible();
    });

    test("Authentication renders auth code input first", () => {
        render(<Router><Authentication setUserById={() => {}}/></Router>);
        const authentication = screen.getByTestId("authentication-wrapper");
        const input = screen.getByTestId("auth-code-input");
        expect(authentication).toContainElement(input);
    });
});