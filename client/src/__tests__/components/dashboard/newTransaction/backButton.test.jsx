import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BackButton from "../../../../components/dashboard/newTransaction/templates/backButton/BackButton";

describe("BackButton render tests", () => {
  test("Back button renders correctly", () => {
    render(<BackButton />);
    const backButtonContainer = screen.getByTestId("back-button-container");
    expect(backButtonContainer).toBeVisible();
    const BackButtonButton = screen.getByTestId("back-button-button");
    expect(BackButtonButton).toBeVisible();
    const backButtonIcon = screen.getByTestId("back-button-icon");
    expect(backButtonIcon).toBeVisible();
  });
});
