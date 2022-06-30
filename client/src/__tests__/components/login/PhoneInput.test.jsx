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
});