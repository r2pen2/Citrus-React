import "./dashboardowecard.scss"

import { Card, CardContent, Typography, Stack } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';

export default function DashboardOweCard({ credit }) {
    
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    })
    
    function getCardStyle() {
        const bgColor = credit.positive ? 'rgba(176, 200, 86, 0.8)' : 'rgba(234, 66, 54, 0.5)';
        return {
            backgroundColor: bgColor,
            widthi: '60%',
        }
    }

    return (
    <Card variant="outlined" sx={getCardStyle()}>
        <CardContent>
            <Typography sc={{ fontSize: 14}} color="text-secondary" gutterBottom>{credit.positive ? "Owe Me" : "I Owe"} ❯</Typography>
            <Typography variant="h5" component="div">{formatter.format(credit.amount)}</Typography>
            <Stack direction="row" alignItems="center">
                <GroupsIcon fontSize="large"/>
                <Typography variant="body2" component="div" marginLeft="5px" marginTop="2px">To {credit.numPeople} people</Typography>
            </Stack>
        </CardContent>
    </Card>
    );
}
