import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe("App first load tests", () => {
  test('Renders homepage on first load', () => {
    render(<App />);
    const appWrapper = screen.getByTestId("app-wrapper");
    const homepage = screen.getByTestId("homepage");
    expect(appWrapper).toContainElement(homepage);
  });

  test('Renders no-user topbar on first load', () => {
    render(<App />);
    const appWrapper = screen.getByTestId("app-wrapper");
    const topbar = screen.getByTestId("topbar-wrapper-no-user");
    expect(appWrapper).toContainElement(topbar);
  });
});
