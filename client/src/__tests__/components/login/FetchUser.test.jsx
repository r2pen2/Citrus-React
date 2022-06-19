import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FetchUser from '../../../components/login/authentication/fetchUser/FetchUser';

describe("FetchUser render tests", () => {

    test("FetchUser container renders", () => {
        render(<FetchUser />);
        const container = screen.getByTestId("fetch-container");
        expect(container).toBeVisible();
    });
    
    test("FetchUser text renders", () => {
        render(<FetchUser />);
        const text = screen.getByTestId("fetch-text");
        expect(text).toBeVisible();
    });

    test("FetchUser spinner renders", () => {
        render(<FetchUser />);
        const spinner = screen.getByTestId("fetch-spinner");
        expect(spinner).toBeVisible();
    });
});