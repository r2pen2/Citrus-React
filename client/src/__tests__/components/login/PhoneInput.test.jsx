import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PhoneInput from '../../../components/login/phoneInput/PhoneInput';

describe("PhoneInput render tests", () => {

    test("PhoneInput container renders", () => {
        render(<PhoneInput setUserById={() => {}}/>);
        const container = screen.getByTestId("phone-input-container");
        expect(container).toBeVisible();
    });

    test("Text me button renders", () => {
        render(<PhoneInput setUserById={() => {}}/>);
        const button = screen.getByTestId("text-me-button");
        expect(button).toBeVisible();
    });

    test("Call me button renders", () => {
        render(<PhoneInput setUserById={() => {}}/>);
        const button = screen.getByTestId("call-me-button");
        expect(button).toBeVisible();
    });
});

describe("PhoneInput function tests", () => {
    test("Localstorage is cleared on render", () => {
        localStorage.setItem('login:user_id', '7355608');
        localStorage.removeItem('login:first_name', 'Xyp9x');
        render(<PhoneInput setUserById={() => {}}/>);
        const userIdExistsInLS = localStorage.getItem('login:user_id') ? true : false;
        const firstNameExistsInLS = localStorage.getItem('login:first_name') ? true : false;
        expect(userIdExistsInLS).toBe(false);
        expect(firstNameExistsInLS).toBe(false);
    });

    test("Phone input is filled with localStorage value", () => {
        localStorage.setItem('login:phone_number', '7355608');
        render(<PhoneInput setUserById={() => {}}/>);
        const input = screen.getByTestId("mui-phone-input");
        expect(input).toContainHTML("+7 (355) 608");
    });

    test("Submit button starts off enabled", () => {
        localStorage.setItem('login:phone_number', '7355608');
        render(<PhoneInput setUserById={() => {}}/>);
        const button = screen.getByTestId("text-me-button");
        expect(button).not.toHaveClass("Mui-disabled");
    });
});