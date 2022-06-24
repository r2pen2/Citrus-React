import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import InfoButton from "../../../../components/dashboard/newTransaction/infoButton/InfoButton";

describe("InfoButton render tests", () => {
  test("Info button renders correctly", () => {
    render(<InfoButton />);
    const InfoButtonContainer = screen.getByTestId("info-button-container");
    expect(InfoButtonContainer).toBeVisible();
    const InfoButtonButton = screen.getByTestId("info-button-button");
    expect(InfoButtonButton).toBeVisible();
    const InfoButtonDialog = screen.getByTestId("info-button-dialog");
    expect(InfoButtonDialog).toBeVisible();
  });
});
