import { useState, useEffect } from 'react';
import { Button, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Split(props) {

    const [splitPage, setSplitPage] = useState(props.splitPage ? props.splitPage : "split-type");
    const [userGroups, setUserGroups] = useState(null);

    function renderSplitPage() {
        switch (splitPage) {
            case "split-type":
                return <SplitTypePage setSplitPage={setSplitPage}/>;
            case "group-select":
                return <GroupSelectionPage setSplitPage={setSplitPage}/>;
            case "friend-select":
                return <FriendSelectionPage setSplitPage={setSplitPage}/>;
            case "money-entry":
                return <MoneyEntryPage />;
            default:
                return <div>Error: invalid split page!</div>
        }
    }

    return (
        <div className="split-page">
            { renderSplitPage() }
        </div>
    )
}

function SplitTypePage({setSplitPage}) {
    return (
        <div className="split-type-page">
            <Typography variant="h6">Who are you splitting with?</Typography>
            <div className="button-container">
                <Button variant="contained" onClick={() => setSplitPage("group-select")}>Groups</Button>
                <Button variant="contained" onClick={() => setSplitPage("friend-select")}>Friends</Button>
            </div>
        </div>
    )
}

function GroupSelectionPage({setSplitPage}) {
    return (
        <div>
            <div className="back-button">
                <IconButton onClick={() => setSplitPage("split-type")}>
                    <ArrowBackIcon />
                </IconButton>
            </div>
            <div className="split-target-buttons">
                <Button variant="contained">Groups</Button>
                <Button variant="outlined" onClick={() => setSplitPage("friend-select")}>Friends</Button>
            </div>
        </div>
    )
}

function FriendSelectionPage({setSplitPage}) {
    return (
        <div>
            <div className="back-button">
                <IconButton onClick={() => setSplitPage("split-type")}>
                    <ArrowBackIcon />
                </IconButton>
            </div>
            <div className="split-target-buttons">
                <Button variant="outlined" onClick={() => setSplitPage("group-select")}>Groups</Button>
                <Button variant="contained">Friends</Button>
            </div>
        </div>
    )
}

function MoneyEntryPage() {
    return (
        <div>Input finances:</div>
    )
}
