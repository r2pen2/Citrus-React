import "./dashboardtransactions.scss"

import { Card, CardContent, CardActionArea, Typography, Stack, Avatar } from '@mui/material';

import OliverPic from "../../../assets/images/Oliver.png"
import LeoPic from "../../../assets/images/Leo.png"

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
})

function getCardStyle() {
    return {
        var: "outlined",
        borderRadius: "5px",
        backgroundColor: "white",
        marginBottom: "10px"
    }
}

function sortByDate( transactions ) {
    transactions.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    })

    return transactions;
}

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

function createTransactionCards( transactions, numDisplayed ) {

    transactions = sortByDate(transactions);
    if (transactions.length > numDisplayed) {
        transactions.splice(numDisplayed)
    }

    return transactions.map((t) => 
    <Card variant="outlined" sx={getCardStyle()}>
        <CardActionArea>
            <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center">
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
    </Card>
    )
}

export default function DashboardTransactions({ recentTransactions, numDisplayed }) {
    return (
        <div>
            <Typography sc={{ fontSize: 14}} color="text-secondary" gutterBottom>Transactions ❯</Typography>
            { createTransactionCards(recentTransactions, numDisplayed) }
        </div>
        );
}
