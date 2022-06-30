import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginHome from '../../../components/login/loginHome/LoginHome';
import { BrowserRouter as Router } from "react-router-dom";

const testUser = { firstName: "John", lastName: "Doe" }

describe("LoginHome render tests", () => {

    test("Google sign in button renders", () => {
        render(<LoginHome setUser={() => {}}/>);
        const googleButton = screen.getByTestId("google-button");
        expect(googleButton).toBeVisible();
    });

    test("Phone sign in button renders", () => {
        render(<LoginHome setUser={() => {}}/>);
        const phoneButton = screen.getByTestId("phone-button");
        expect(phoneButton).toBeVisible();
    });
    
});