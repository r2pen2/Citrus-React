import "./dashboardowecard.scss"

import { Card, CardContent, CardActionArea, Typography, Stack } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
})

function getCardStyle(credit) {
    const bgColor = credit.positive ? 'rgba(176, 200, 86, 0.8)' : 'rgba(234, 66, 54, 0.5)';
    return {
        backgroundColor: bgColor,
        widthi: '60%',
        borderRadius: "5px",
        marginBottom: "10px",
    }
}

export default function DashboardOweCard({ credit }) {
    return (
    <div>
        <Typography sc={{ fontSize: 14}} color="text-secondary" gutterBottom>{credit.positive ? "Owe Me" : "I Owe"} ❯</Typography>
        <Card variant="outlined" sx={getCardStyle(credit)}>
            <CardActionArea>
                <CardContent>
                    <Typography variant="h5" component="div" color="white">{formatter.format(credit.amount)}</Typography>
                        <Stack direction="row" alignItems="center">
                            <GroupsIcon fontSize="large" sx={{ color: "white " }}/>
                            <Typography variant="subtitle1" component="div" marginLeft="5px" marginTop="2px" color="white">To {credit.numPeople} people</Typography>
                        </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    </div>
    );
}
