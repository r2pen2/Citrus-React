import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import InfoButton from "../../../../components/dashboard/newTransaction/templates/infoButton/InfoButton";

describe("InfoButton render tests", () => {
  test("Info button renders correctly", () => {
    render(<InfoButton />);
    const infoButtonContainer = screen.getByTestId("info-button-container");
    expect(infoButtonContainer).toBeVisible();
    const infoButtonButton = screen.getByTestId("info-button-button");
    expect(infoButtonButton).toBeVisible();
  });
});

describe("InfoButton function tests", () => {
  test("Info button click opens dialogue", () => {
    render(<InfoButton />);
    const infoButtonButton = screen.getByTestId("info-button-button");
    fireEvent.click(infoButtonButton);
    const InfoButtonDialog = screen.getByTestId("info-button-dialog");
    expect(InfoButtonDialog).toBeVisible();
  });
});
