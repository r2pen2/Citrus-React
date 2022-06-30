import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Phone from '../../../components/login/phone/Phone';

describe("Phone render tests", () => {

    test("Phone container renders", () => {
        render(<Phone setUser={() => {}}/>);
        const container = screen.getByTestId("phone-input-container");
        expect(container).toBeVisible();
    });

    test("Text me button renders", () => {
        render(<Phone setUser={() => {}}/>);
        const button = screen.getByTestId("text-me-button");
        expect(button).toBeVisible();
    });
});

describe("Phone function tests", () => {
});