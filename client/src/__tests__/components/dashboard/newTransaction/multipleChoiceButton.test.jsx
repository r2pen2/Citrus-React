import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MultipleChoiceButton from "../../../../components/dashboard/newTransaction/templates/multipleChoiceButton/MultipleChoiceButton";

describe("MultipleChoiceButton render tests", () => {
  test("Multiple choice button 1 renders correctly", () => {
    render(<MultipleChoiceButton order={1} />);

    const MultipleChoiceButtonContainer = screen.getByTestId(
      "multiple-choice-button-container"
    );
    expect(MultipleChoiceButtonContainer).toBeVisible();

    const MultipleChoiceButtonCard = screen.getByTestId(
      "multiple-choice-button-card"
    );
    expect(MultipleChoiceButtonCard).toBeVisible();
    expect(MultipleChoiceButtonCard).toHaveStyle({
      backgroundColor: "citrusYellow.main",
    });
  });
  test("Multiple choice button 2 renders correctly", () => {
    render(<MultipleChoiceButton order={2} />);

    const MultipleChoiceButtonContainer = screen.getByTestId(
      "multiple-choice-button-container"
    );
    expect(MultipleChoiceButtonContainer).toBeVisible();

    const MultipleChoiceButtonCard = screen.getByTestId(
      "multiple-choice-button-card"
    );
    expect(MultipleChoiceButtonCard).toBeVisible();
    expect(MultipleChoiceButtonCard).toHaveStyle({
      backgroundColor: "citrusPink.main",
    });
  });
  test("Multiple choice button 3 renders correctly", () => {
    render(<MultipleChoiceButton order={3} />);

    const MultipleChoiceButtonContainer = screen.getByTestId(
      "multiple-choice-button-container"
    );
    expect(MultipleChoiceButtonContainer).toBeVisible();

    const MultipleChoiceButtonCard = screen.getByTestId(
      "multiple-choice-button-card"
    );
    expect(MultipleChoiceButtonCard).toBeVisible();
    expect(MultipleChoiceButtonCard).toHaveStyle({
      backgroundColor: "citrusGreen.main",
    });
  });
});
