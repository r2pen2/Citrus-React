import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../../../components/homePage/HomePage';

describe("HomePage render tests", () => {
  test('Renders landing page', () => {
    render(<HomePage />);
    const homePage = screen.getByTestId("homepage");
    const landingPage = screen.getByTestId("landing-page");
    expect(homePage).toContainElement(landingPage);
  });

  test('Renders footer', () => {
    render(<HomePage />);
    const homePage = screen.getByTestId("homepage");
    const footer = screen.getByTestId("footer");
    expect(homePage).toContainElement(footer);
  });
});

describe("Homepage function tests", () => {
  test('cleanLs() runs on render', () => {
    localStorage.setItem("login:phone_number", "test");
    localStorage.setItem("login:first_name", "test");
    localStorage.setItem("login:user_id", "test");
    render(<HomePage />);
    const phoneNumberExistsInLS = localStorage.getItem('login:phone_number') ? true : false;
    const firstNameExistsInLS = localStorage.getItem('login:first_name') ? true : false;
    const userIdExistsInLS = localStorage.getItem('login:user_id') ? true : false;
    expect(phoneNumberExistsInLS).toBe(false);
    expect(firstNameExistsInLS).toBe(false);
    expect(userIdExistsInLS).toBe(false);
  });
  
  test('cleanLs() does not clear user from localStorage', () => {
    localStorage.setItem("user", "test");
    render(<HomePage />);
    const userExistsInLS = localStorage.getItem('user') ? true : false;
    expect(userExistsInLS).toBe(true);
  });
});
