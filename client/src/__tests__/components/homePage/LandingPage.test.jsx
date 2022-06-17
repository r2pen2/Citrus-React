import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LandingPage from '../../../components/homePage/landingPage/LandingPage';

describe("LandingPage render tests", () => {

    test('Renders left column', () => {
      render(<LandingPage />);
      const landingPage = screen.getByTestId("landing-page");
      const left = screen.getByTestId("landing-page-left");
      expect(landingPage).toContainElement(left);
    });

    test('Renders right column', () => {
      render(<LandingPage />);
      const landingPage = screen.getByTestId("landing-page");
      const right = screen.getByTestId("landing-page-right");
      expect(landingPage).toContainElement(right);
    });

    test('Renders socials', () => {
      render(<LandingPage />);
      const landingPage = screen.getByTestId("landing-page");
      const socials = screen.getByTestId("landing-page-socials");
      expect(landingPage).toContainElement(socials);
    });

    test('Does not render down arrow', () => {
        render(<LandingPage />);
        const landingPage = screen.getByTestId("landing-page");
        const arrow = screen.queryByTestId("landing-page-down-arrow");
        expect(landingPage).not.toContainElement(arrow);
    });
});