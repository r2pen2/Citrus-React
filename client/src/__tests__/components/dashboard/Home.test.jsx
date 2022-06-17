import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../../components/dashboard/home/Home';
import { BrowserRouter as Router } from "react-router-dom";

describe("Home render tests", () => {

    test("Home renders transactions and owe cards", () => {
        render(<Home/>)
        const transactions = screen.getByTestId('transactions');
        const oweCards = screen.getByTestId('owe-cards');
        expect(transactions).toBeVisible();
        expect(oweCards).toBeVisible();
    });
});