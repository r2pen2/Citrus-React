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
    test('cleanLs() runs on render', () => {
        localStorage.setItem("login:phone_number", "test");
        localStorage.setItem("login:first_name", "test");
        localStorage.setItem("login:user_id", "test");
        render(<Router><Dashboard user={testUser} /></Router>);
        const phoneNumberExistsInLS = localStorage.getItem('login:phone_number') ? true : false;
        const firstNameExistsInLS = localStorage.getItem('login:first_name') ? true : false;
        const userIdExistsInLS = localStorage.getItem('login:user_id') ? true : false;
        expect(phoneNumberExistsInLS).toBe(false);
        expect(firstNameExistsInLS).toBe(false);
        expect(userIdExistsInLS).toBe(false);
      });
      
      test('cleanLs() does not clear user from localStorage', () => {
        localStorage.setItem("user", "test");
        render(<Router><Dashboard user={testUser} /></Router>);
        const userExistsInLS = localStorage.getItem('user') ? true : false;
        expect(userExistsInLS).toBe(true);
      });
})