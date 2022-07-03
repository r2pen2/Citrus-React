import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../../../components/dashboard/Dashboard';
import { BrowserRouter as Router } from "react-router-dom";
import { signInTestUser, signOutTestUser } from "../../../api/testing";

describe("Dashboard render tests", () => {

    test("Dashboard renders bottomNav", () => {
        signInTestUser();
        render(<Router><Dashboard/></Router>)
        const bottomNav = screen.getByTestId('bottomnav');
        expect(bottomNav).toBeVisible();
        signOutTestUser();
    });
});

describe("Dashboard function tests", () => {
})