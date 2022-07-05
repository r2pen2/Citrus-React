import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransactionsPreview from '../../../components/dashboard/home/transactionsPreview/TransactionsPreview';

const testTransactions = [
    {
        id: "halloweenPartyEample",
        title: "Halloween Party",
        date: "2021-10-31",
        amount: 63.45,
        user: "James Hetfield"
    },
    {
        id: "drinksExample",
        title: "Drinks",
        date: "2022-03-8",
        amount: 53.25,
        user: "Tom Araya"
    },
    {
        id: "burritoBowlExample",
        title: "Burrito Bowl",
        date: "2022-03-10",
        amount: 53.25,
        user: "Dave Mustaine"
    },
  ]

describe("Transactions render tests", () => {

    test("Transactions render the correct cards", () => {
        function testNumDisplay(num) {
            function sortByDate( transactions ) {
                transactions.sort((a, b) => {
                    return new Date(b.date) - new Date(a.date);
                })
                return transactions;
            }
            render(<TransactionsPreview recentTransactions={testTransactions} numDisplayed={num}/>)
            const relevantTransactions = sortByDate(testTransactions);
            if (relevantTransactions.length > num) {
                relevantTransactions.splice(num)
            }
            for (const t of relevantTransactions) {
                const transactionCards = screen.getAllByTestId("transaction-card-" + t.title);
                for (const c of transactionCards) {
                    expect(c).toBeVisible();
                }
            }
        }
        testNumDisplay(1);
        testNumDisplay(2);
        testNumDisplay(3);
        testNumDisplay(4);
    });

    test("Transactions render correct date format", () => {
        render(<TransactionsPreview recentTransactions={testTransactions} numDisplayed={1}/>);
        const date = screen.queryByText("10 March, 2022");
        expect(date).toBeVisible();
    });

});