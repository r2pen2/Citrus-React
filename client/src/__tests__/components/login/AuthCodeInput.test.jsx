import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthCodeInput from '../../../components/login/authentication/authCodeInput/AuthCodeInput';

describe("AuthCodeInput render tests", () => {

    test("AuthCodeInput wrapper renders", () => {
        render(<AuthCodeInput />);
        const wrapper = screen.getByTestId("auth-code-input");
        expect(wrapper).toBeVisible();
    });
    
    test("Input box renders", () => {
        render(<AuthCodeInput />);
        const input = screen.getByTestId("auth-input-container");
        expect(input).toBeVisible();
    });

    test("Try again button renders", () => {
        render(<AuthCodeInput />);
        const button = screen.getByTestId("try-again-button");
        expect(button).toBeVisible();
    });
    
    test("Next button renders and is disabled", () => {
        render(<AuthCodeInput />);
        const button = screen.getByTestId("login-next-button");
        expect(button).toBeVisible();
        expect(button).toHaveClass("Mui-disabled");
    });
});

describe("AuthCodeInput function tests", () => {

    test("Local storage is cleared correctly", () => {
        localStorage.setItem('login:user_id', "this shouldn't be here");
        localStorage.setItem('login:first_name', "this shouldn't be here");
        render(<AuthCodeInput />);
        const userIdExistsInLS = localStorage.getItem('login:user_id') ? true : false ;
        const firstNameExistsInLS = localStorage.getItem('login:first_name') ? true : false ;
        expect(userIdExistsInLS).toBe(false);
        expect(firstNameExistsInLS).toBe(false);
    });
});