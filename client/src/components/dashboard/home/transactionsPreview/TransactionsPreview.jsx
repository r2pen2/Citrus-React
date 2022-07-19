// Style imports
import "./transactionsPreview.scss";

// Library imports
import { CardContent, CardActionArea, Typography, Stack, Avatar, Button } from '@mui/material';

// Component imports
import OliverPic from "../../../../assets/images/pfp/Oliver.png";
import LeoPic from "../../../../assets/images/pfp/Leo.png";
import OutlinedCard from "../../../resources/surfaces/OutlinedCard";

// API imports
import formatter from "../../../../api/formatter";

/**
 * Sorts a list of transactions by date
 * @param {[Object]} transactions list of transactions to be sorted
 * @returns {[Object]} sorted list of transactions
 */
function sortByDate( transactions ) {
    transactions.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    })

    return transactions;
}

/**
 * Formats a UTC date string so that it's easier to read
 * @param {String} date string representing a UTC date
 * @returns {String} date formatted as a string
 */
function formatDate( date ) {
    const d = new Date(date)
    const day = d.getUTCDate();
    const month = d.getMonth();
    const year = d.getFullYear();

    var monthString = ""
    switch (month) {
        case 0:
            monthString = "January";
            break;
        case 1:
            monthString = "February";
            break;
        case 2:
            monthString = "March";
            break;
        case 3:
            monthString = "April";
            break;
        case 4:
            monthString = "May";
            break;
        case 5:
            monthString = "June";
            break;
        case 6:
            monthString = "July";
            break;
        case 7:
            monthString = "August";
            break;
        case 8:
            monthString = "September";
            break;
        case 9:
            monthString = "October";
            break;
        case 10:
            monthString = "November";
            break;
        case 11:
            monthString = "December";
            break;
        default:
            monthString = "";
            break;
    }

    return day + " " + monthString + ", " + year;
}

/**
 * Creates cards representing a list of transaction
 * @param {[Object]} transactions list of Transactions
 * @param {Number} numDisplayed max number of transactions to display
 * @returns {Component} series of cards with transaction information
 */
function createTransactionCards( transactions, numDisplayed ) {

    transactions = sortByDate(transactions);
    if (transactions.length > numDisplayed) {
        transactions.splice(numDisplayed)
    }

    return transactions.map((t, tIndex) => 
        <div data-testid={"transaction-card-" + t.title} key={t.id}>
            <OutlinedCard>
                <CardActionArea onClick={() => window.location = "/dashboard/transactions/detail?id=" + t.id}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Stack direction="row" alignItems="center" component="div" id={tIndex}>
                                <Avatar 
                                    sx={{ marginRight: "10px"}} 
                                    alt={t.user}
                                    src={t.user === "Oliver Risch" ? OliverPic : LeoPic}
                                />
                                <Stack direction="column" alignItems="left" align="left">
                                    <Typography variant="h6" component="div">{t.title}</Typography>
                                    <Typography variant="subtitle1" component="div" sx={{ color: "gray "}}>{formatDate(t.date)}</Typography>
                                </Stack>
                            </Stack>
                            <Typography align="right" variant="h5" component="div">{formatter.format(t.amount)}</Typography>
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </OutlinedCard>
        </div>
    )
}

export default function Transactions({ recentTransactions, numDisplayed }) {
    return (
        <div>
            <div className="title">
                <Typography sc={{ fontSize: 14}} color="text-secondary" gutterBottom>Transactions ❯</Typography>
                <Button variant="contained" onClick={() => window.location = "/dashboard/transactions/"}>View All Transactions</Button>
            </div>
            { createTransactionCards(recentTransactions, numDisplayed) }
        </div>
        );
}
