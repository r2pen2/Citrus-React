import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../../../components/dashboard/Dashboard';
import { BrowserRouter as Router } from "react-router-dom";

const testUser = { firstName: "John", lastName: "Doe" }

describe("Dashboard render tests", () => {

    test("Dashboard renders bottomNav", () => {
        render(<Router><Dashboard user={testUser} /></Router>)
        const bottomNav = screen.getByTestId('bottomnav');
        expect(bottomNav).toBeVisible();
    });
});

describe("Dashboard function tests", () => {
})