import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewUserForm from '../../../components/login/newUserForm/NewUserForm';

/**
 * Sets test values in localStorage for password entry vals 
 */
function setTestLS() {
    localStorage.setItem('login:phone_number', "+12345678901");
}

describe("NewUserForm render tests", () => {

    test("NewUserForm wrapper renders", () => {
        setTestLS();
        render(<NewUserForm setUserById={() => {}}/>);
        const wrapper = screen.getByTestId("new-user-form-wrapper");
        expect(wrapper).toBeVisible();
    });

    test("First name input renders", () => {
        setTestLS();
        render(<NewUserForm setUserById={() => {}}/>);
        const input = screen.getByTestId("first-name-input");
        expect(input).toBeVisible();
    });

    test("Last name input renders", () => {
        setTestLS();
        render(<NewUserForm setUserById={() => {}}/>);
        const input = screen.getByTestId("last-name-input");
        expect(input).toBeVisible();
    });

    test("Password input renders", () => {
        setTestLS();
        render(<NewUserForm setUserById={() => {}}/>);
        const input = screen.getByTestId("password-input");
        expect(input).toBeVisible();
    });

    test("Password confirmation input renders", () => {
        setTestLS();
        render(<NewUserForm setUserById={() => {}}/>);
        const input = screen.getByTestId("password-confirmation-input");
        expect(input).toBeVisible();
    });

    test("Submit button renders and is disabled", () => {
        setTestLS();
        render(<NewUserForm setUserById={() => {}}/>);
        const button = screen.getByTestId("submit-button");
        expect(button).toBeVisible();
        expect(button).toHaveClass("Mui-disabled");
    });

    test("New user welcome message renders", () => {
        setTestLS();
        render(<NewUserForm setUserById={() => {}}/>);
        const message = screen.getByTestId("new-user-message");
        expect(message).toBeVisible();
    });
});