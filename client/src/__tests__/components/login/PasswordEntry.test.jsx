import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PasswordEntry from '../../../components/login/authentication/passwordEntry/PasswordEntry';

/**
 * Sets test values in localStorage for password entry vals 
 */
function setTestLS() {
    localStorage.setItem('login:first_name', "Krampus");
}

describe("PasswordEntry render tests", () => {

    test("PasswordEntry wrapper renders", () => {
        setTestLS();
        render(<PasswordEntry setUserById={() => {}}/>);
        const wrapper = screen.getByTestId("password-entry-wrapper");
        expect(wrapper).toBeVisible();
    });

    test("Welcome text renders", () => {
        setTestLS();
        render(<PasswordEntry setUserById={() => {}}/>);
        const welcome = screen.getByTestId("password-entry-welcome-text");
        expect(welcome).toBeVisible();
    });

    test("Input renders", () => {
        setTestLS();
        render(<PasswordEntry setUserById={() => {}}/>);
        const input = screen.getByTestId("password-input");
        expect(input).toBeVisible();
    });

    test("Submit button renders and is disabled", () => {
        setTestLS();
        render(<PasswordEntry setUserById={() => {}}/>);
        const button = screen.getByTestId("password-entry-submit-button");
        expect(button).toBeVisible();
        expect(button).toHaveClass("Mui-disabled");
    });
});