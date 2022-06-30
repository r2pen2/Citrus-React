import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewUserForm from '../../../components/login/newUserForm/NewUserForm';

describe("NewUserForm render tests", () => {

    test("NewUserForm wrapper renders", () => {
        render(<NewUserForm setUserById={() => {}}/>);
        const wrapper = screen.getByTestId("new-user-form-wrapper");
        expect(wrapper).toBeVisible();
    });

    test("First name input renders", () => {
        render(<NewUserForm setUserById={() => {}}/>);
        const input = screen.getByTestId("first-name-input");
        expect(input).toBeVisible();
    });

    test("Last name input renders", () => {
        render(<NewUserForm setUserById={() => {}}/>);
        const input = screen.getByTestId("last-name-input");
        expect(input).toBeVisible();
    });

    test("Submit button renders and is disabled", () => {
        render(<NewUserForm setUserById={() => {}}/>);
        const button = screen.getByTestId("submit-button");
        expect(button).toBeVisible();
        expect(button).toHaveClass("Mui-disabled");
    });

    test("New user welcome message renders", () => {
        render(<NewUserForm setUserById={() => {}}/>);
        const message = screen.getByTestId("new-user-message");
        expect(message).toBeVisible();
    });
});