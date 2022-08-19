import { useState, useEffect } from 'react';
import { Button, IconButton, Select, InputLabel, FormControl, MenuItem, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getGroupsByUserId, getGroupNameById } from "../../../../api/dbManager";

export default function Split(props) {

    const [splitPage, setSplitPage] = useState(props.splitPage ? props.splitPage : "add-people");
    const [userGroups, setUserGroups] = useState(null);
    const [groupPicklistContent, setGroupPicklistContent] = useState(null);
    const [currentGroup, setCurrentGroup] = useState("");
    const [peopleInvolved, setPeopleInvolved] = useState([]);

    async function fetchUserData() {
        let groups = await getGroupsByUserId(props.user.uid);
        setUserGroups(groups);
        // Also get the names of each group
        var groupObjects = [];
        for (const groupId of groups) {
            let groupName = await getGroupNameById(groupId);
            groupObjects.push({id: groupId, name: groupName })
        }
        setGroupPicklistContent(groupObjects);
    }

    useEffect(() => {
        fetchUserData();
    }, [])

    function renderSplitPage() {
        switch (splitPage) {
            case "add-people":
                return <AddPeoplePage setSplitPage={setSplitPage} currentGroup={currentGroup} setCurrentGroup={setCurrentGroup} groupPicklistContent={groupPicklistContent}/>;
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

function AddPeoplePage({setSplitPage, groupPicklistContent, currentGroup, setCurrentGroup}) {

    function populateGroupSelect() {
        if (groupPicklistContent) {
            return groupPicklistContent.map((group, index) => {
                return (
                    <MenuItem key={index} value={group.id}>{group.name}</MenuItem>
                )
            });
        }
    }

    function handleGroupChange(e) {
        setCurrentGroup(e.target.value);
    }

    return (
        <div className="split-type-page">
            <Typography variant="h6">Add People</Typography>
            <div className="search-bar">

            </div>
            <Typography variant="h6">Assign to Group</Typography>
            <div className="group-select">
                <FormControl className="group-select-box">
                    <InputLabel id="group-select-label">Group</InputLabel>
                    <Select value={currentGroup} labelId="group-select-label" onChange={handleGroupChange} label="Group">
                        <MenuItem value=""><em>None</em></MenuItem>
                        { populateGroupSelect() }
                    </Select>
                </FormControl>
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
