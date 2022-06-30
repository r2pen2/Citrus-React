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
});
