import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OweCard from '../../../components/dashboard/home/oweCard/OweCard';

const positiveCredit = { positive: true, amount: 250, numPeople: 6 };
const negativeCredit = { positive: false, amount: 250, numPeople: 6 };

describe("OweCard render tests", () => {

    test("Positive card renders correctly", () => {
        render(<OweCard credit={positiveCredit} />)
        const oweCard = screen.getByTestId('owe-card-positive');
        expect(oweCard).toBeVisible();
        const groupsIcon = screen.getByTestId('GroupsIcon');
        expect(groupsIcon).toBeVisible();
        const cardElement = screen.getByTestId('owe-card-card-element');
        expect(cardElement).toBeVisible();
        expect(cardElement).toHaveStyle({ backgroundColor: "rgba(176, 200, 86, 0.8)" })
    });

    test("Negative card renders correctly", () => {
        render(<OweCard credit={negativeCredit} />)
        const oweCard = screen.getByTestId('owe-card-negative');
        expect(oweCard).toBeVisible();
        const groupsIcon = screen.getByTestId('GroupsIcon');
        expect(groupsIcon).toBeVisible();
        const cardElement = screen.getByTestId('owe-card-card-element');
        expect(cardElement).toBeVisible();
        expect(cardElement).toHaveStyle({ backgroundColor: "rgba(234, 66, 54, 0.5)" })
    });
});