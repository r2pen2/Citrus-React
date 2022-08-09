import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../../../components/homePage/Footer';

describe("Footer render tests", () => {

    test('Renders all three columns', () => {
      render(<Footer />);
      const footer = screen.getByTestId("footer");
      const col1 = screen.getByTestId("column1");
      const col2 = screen.getByTestId("column2");
      const col3 = screen.getByTestId("column3");
      expect(footer).toContainElement(col1);
      expect(footer).toContainElement(col2);
      expect(footer).toContainElement(col3);
    });
});

describe("Footer link tests", () => {
    test('Credits link has correct href', () => {
        render(<Footer />);
        const creditsLink = screen.getByText("Credits");
        expect(creditsLink).toHaveAttribute('href', "/credits")
    });
})