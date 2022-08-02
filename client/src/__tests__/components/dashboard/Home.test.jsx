import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../../components/dashboard/home/Home';
import { BrowserRouter as Router } from "react-router-dom";
import { testUser } from "../../../api/testing"; 

describe("Home render tests", () => {

    test("Home renders owe cards", () => {
        render(<Home user={testUser}/>)
        const oweCards = screen.getByTestId('owe-cards');
        expect(oweCards).toBeVisible();
    });

    test("Home renders transaction preview", () => {
        render(<Home user={testUser}/>)
        const transactions = screen.getByTestId('transactions');
        expect(transactions).toBeVisible();
    });

    test("Home renders analytics preview", () => {
        render(<Home user={testUser}/>)
        const analytics = screen.getByTestId('analytics');
        expect(analytics).toBeVisible();
    });
});