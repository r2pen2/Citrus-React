import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthCodeInput from '../../../components/login/phone/AuthCodeInput';

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
});