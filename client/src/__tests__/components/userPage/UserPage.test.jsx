import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserPage from '../../../components/userPage/UserPage';
import { BrowserRouter as Router } from "react-router-dom";

describe("UserPage render tests", () => {

    test('UserPage displays profile on first render', () => {
        render(<Router><UserPage/></Router>);
        const profile = screen.getByTestId("user-profile");
        expect(profile).toBeVisible();
    });
});