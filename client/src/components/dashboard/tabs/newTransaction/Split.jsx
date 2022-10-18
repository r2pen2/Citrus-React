import { useState, useEffect } from 'react';
import { Button, Select, FormControlLabel, Checkbox, InputLabel, FormControl, Switch, InputAdornment, Input, MenuItem, Typography, TextField, CircularProgress, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { SessionManager } from "../../../../api/sessionManager";
import { DBManager } from "../../../../api/db/dbManager";
import { AvatarIcon, AvatarToggle } from '../../../resources/Avatars';
import { sortByDisplayName } from '../../../../api/sorting';
// Get user mananger from LS (which we know exists becuase we made it to this page)
const userManager = SessionManager.getCurrentUserManager();

/**
 * Wrapper component for split new transaction
 * @param {Props} props Currently unused
 */
export default function Split(props) {

    // Keep track of which page we're on
    const [splitPage, setSplitPage] = useState(props.splitPage ? props.splitPage : "add-people");

    const [groupPicklistContent, setGroupPicklistContent] = useState(null); // Map of groups in the picklist
    const [currentGroup, setCurrentGroup] = useState("");                   // Currently selected group (by id)
    // eslint-disable-next-line no-unused-vars
    const [peopleInvolved, setPeopleInvolved] = useState([]);               // Currently selected users (by id)
    const [transactionTitle, setTransactionTitle] = useState(null);         // Title of this transaction
    const [transactionAmount, setTransactionAmount] = useState(null);       // Total amount of this transaction

    useEffect(() => {
        async function fetchUserData() {
            // Get user manager
            const groups = await userManager.getGroups();
            // Also get the names of each group
            var groupObjects = [];
            for (const groupId of groups) {
                const groupManager = DBManager.getGroupManager(groupId);
                const groupName = await groupManager.getName();
                groupObjects.push({id: groupId, name: groupName })
            }
            setGroupPicklistContent(groupObjects);
        }

        fetchUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function renderSplitPage() {
        switch (splitPage) {
            case "add-people":
                return <AddPeoplePage setSplitPage={setSplitPage} currentGroup={currentGroup} setCurrentGroup={setCurrentGroup} groupPicklistContent={groupPicklistContent} setPeopleInvolved={setPeopleInvolved}/>;
            case "transaction-details":
                return <TransactionDetailsPage setTransactionAmount={setTransactionAmount} currentGroup={currentGroup} setSplitPage={setSplitPage} groupPicklistContent={groupPicklistContent} setTransactionTitle={setTransactionTitle} peopleInvolved={peopleInvolved}/>;
            case "even-split":
                return <WeightSelection manual={false} transactionTitle={transactionTitle} transactionAmount={transactionAmount} peopleInvolved={peopleInvolved}/>;
            case "manual-split":
                return <WeightSelection manual={true} transactionTitle={transactionTitle} transactionAmount={transactionAmount} peopleInvolved={peopleInvolved}/>;
            case "summary":
            default:
                return <div>Error: invalid split page!</div>
        }
    }

    return (
        <div className="split-page-wrapper">
            { renderSplitPage() }
        </div>
    )
}

function AddPeoplePage({setSplitPage, groupPicklistContent, currentGroup, setCurrentGroup, setPeopleInvolved}) {
    
    const [searchString, setSearchString] = useState("");               // Contents of search box
    const [friends, setFriends] = useState(null);                       // List of user's friends (stored as objects)
    const [friendsLoaded, setFriendsLoaded] = useState(false);          // Whether or not friends have loaded personal information yet
    const [searchExpanded, setSearchExpanded] = useState(false);        // Whether or not search is expanded
    const [nextEnabled, setNextEnabled] = useState(false);              // Whether or not the "next" button is enabled
    const [someoneIsSelected, setSomeoneIsSelected] = useState(false);  // Whether or not anyone is currently selected
    const [groupsExpanded, setGroupsExpanded] = useState(false);        // Whether or not the groups section is expanded
    const [currentGroupUsers, setCurrentGroupUsers] = useState(null);   // All users in currently selected group
    const [currentGroupLoaded, setCurrentGroupLoaded] = useState(false);// Whether or not data for users in current group is loaded
    const [someoneIsSelectedInGroup, setSomeoneIsSelectedInGroup] = useState(true); // Flag if a group has nobody selected in it

    /**
     * @param {Array} friendsList a list of objects representing all of the current user's friends without detailed information on them
     * Get detailed information on each friend in the list.
     * This is done after populating the list with template information in fetchFriends
     */
    async function fetchFriendDetails(friendsList) {
        for (var i = 0; i < friendsList.length; i++) {
            const currentFriend = friendsList[i];
            const friendManager = DBManager.getUserManager(currentFriend.id)
            let displayName = await friendManager.getDisplayName();
            currentFriend.displayName = displayName;
            let url = await friendManager.getPhotoUrl();
            currentFriend.pfpUrl = url;
            friendsList[i] = currentFriend;
        }
        setFriends(sortByDisplayName(friendsList));
        setFriendsLoaded(true);
    }

    // Fetch user's friends on component mount
    useEffect(() => {
        /**
         * Get a list of user's friends and store their ID's, along with template information
         */
        async function fetchFriends() {
            // Get user manager
            const friendsFromDB = await userManager.getFriends();
            var userFriends = [];
            for (const friendId of friendsFromDB) {
                userFriends.push({id: friendId, displayName: "", pfpUrl: null, selected: false})
            }
            const sortedFriends = sortByDisplayName(userFriends);
            setFriends(sortedFriends);
            fetchFriendDetails(userFriends);
        }
        fetchFriends();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /**
     * Populate group select box with the names of each group the user belongs to
     * @returns {Component} menu items for each group
     */
    function populateGroupSelect() {
        if (groupPicklistContent) {
            return groupPicklistContent.map((group, index) => {
                return (
                    <MenuItem key={index} value={group.id}>{group.name}</MenuItem>
                )
            });
        }
    }

    /**
     * Change current group to value of select box
     * @param {Event} e select event
     */
    function handleGroupChange(e) {
        setCurrentGroup(e.target.value);
    }

    /**
     * Set search string to value of search box
     * @param {Event} e keypress event
     */
    function handleSearchChange(e) {
        setSearchString(e.target.value);
    }

    /**
     * Toggle the selected state of a friend by userId
     * @param {String} id id of friend to toggle selected state for
     */
    function toggleSelectedFriend(id) {
        var toggled = [];
        var foundSelectedFriend = false;
        for (const f of friends) {
            const toggledFriend = {
                id: f.id,
                displayName: f.displayName,
                pfpUrl: f.pfpUrl,
                selected: (id === f.id) ? !f.selected : f.selected 
            }
            if (toggledFriend.selected) {
                foundSelectedFriend = true;
            }
            toggled.push(toggledFriend);
        }
        setSomeoneIsSelected(foundSelectedFriend);
        setFriends(toggled);
    }

        /**
     * Toggle the selected state of a user by userId
     * @param {String} id id of user to toggle selected state for
     */
         function toggleSelectedGroupUser(id) {
            var toggled = [];
            var foundSelectedUser = false;
            for (const u of currentGroupUsers) {
                const toggledUser = {
                    id: u.id,
                    displayName: u.displayName,
                    pfpUrl: u.pfpUrl,
                    selected: (id === u.id) ? !u.selected : u.selected 
                }
                if (toggledUser.selected) {
                    foundSelectedUser = true;
                }
                toggled.push(toggledUser);
            }
            setSomeoneIsSelectedInGroup(foundSelectedUser);
            setCurrentGroupUsers(toggled);
        }

    /** 
    * Check if the next button should be enabled
    */
    function checkNextEnabled() {
        setNextEnabled(someoneIsSelected || (currentGroup && someoneIsSelectedInGroup));
    }

    /**
     * Clear search bar
     */
    function clearSearch() {
        setSearchString("");
    }

    /**
     * Populate the friend search results with clickable avatar icons and display names
     * @returns {Component} populated friend search results
     */
    function populateFriendScroller() {
        if (!friends) {
            return;
        }
        if (!friendsLoaded) {
            return (
                <div className="friend-container">
                    <CircularProgress/>
                </div>
            );
        }
        if (searchExpanded) { // Friends exist and search is expanded
            const searchIncludedFriends = friends.filter(f => f.displayName.toLowerCase().includes(searchString.toLowerCase()));
            return searchIncludedFriends.map((friend, index) => {
                return (                            
                    <div 
                        className="friend-container" 
                        key={index} 
                        onClick={() => { 
                            toggleSelectedFriend(friend.id);
                            clearSearch();
                        }
                    }>
                        <AvatarToggle 
                            outlined={friend.selected} 
                            id={friend.id} 
                            src={friend.pfpUrl}
                            displayName={friend.displayName}
                        />
                    </div> 
                );
            });
        } 
        // Friends exist but the list is not expanded
        return friends.slice(0, 5).map((friend, index) => {
            return (
                <div 
                   className="friend-container" 
                   key={index} 
                   onClick={() => {
                    toggleSelectedFriend(friend.id);
                   }}
                >
                    <AvatarToggle 
                       outlined={friend.selected} 
                       id={friend.id} 
                       src={friend.pfpUrl}
                       displayName={friend.displayName}
                   />
                </div>
            )
        });
    }

    /** 
     * Handle next button press, passing on information to next page
     */
    function handleNext() {

        const myself = {
            id: SessionManager.getUserId(),
            pfpUrl: SessionManager.getPfpUrl(),
            displayName: SessionManager.getDisplayName(),
        }

        var contextSet = false;
        if (searchExpanded) {
            var friendsSelected = [];
            for (const friend of friends) {
                if (friend.selected) {
                    friendsSelected.push({
                        id: friend.id,
                        pfpUrl: friend.pfpUrl,
                        displayName: friend.displayName
                    });
                }
            }
            friendsSelected.push(myself);
            setPeopleInvolved(friendsSelected);
            contextSet = true;
        }
        if (groupsExpanded) {
            var usersSelected = [];
            for (const user of currentGroupUsers) {
                if (user.selected) {
                    usersSelected.push({
                        id: user.id,
                        pfpUrl: user.pfpUrl,
                        displayName: user.displayName
                    });
                }
            }
            usersSelected.push(myself);
            setPeopleInvolved(usersSelected);
            contextSet = true;
        }
        if (contextSet) {
            setSplitPage("transaction-details");
        }
    }

    /** 
     * Make sure that the search box expanded property is updated whenever 
     * the search value changes, whether or not someone is selected changes,
     * or the selected group changes.
    */
    useEffect(() => {
        setSearchExpanded(someoneIsSelected || searchString.length > 0);
        setGroupsExpanded(currentGroup ? true : false);
        checkNextEnabled();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [someoneIsSelected, someoneIsSelectedInGroup, searchString, currentGroup])

    /**
     * Fetch current group's users when it changes
     */
    useEffect(() => {
        fetchCurrentGroupUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentGroup])

    /**
     * Get current group's users from DB and set local array
     */
    async function fetchCurrentGroupUsers() {
        const groupManager = DBManager.getGroupManager(currentGroup);
        let users = await groupManager.getUsers();
        var usersInGroup = [];
        for (const user of users) {
            usersInGroup.push({id: user, selected: true, displayName: null, pfpUrl: null})
        }
        setCurrentGroupUsers(usersInGroup);
        loadCurrentGroupUsers();
    }

    /**
     * Load personal data for all users in selected group
     */
    async function loadCurrentGroupUsers() {
        var loadedUsers = [];
        if (!currentGroupUsers) {
            return;
        }
        for (const user of currentGroupUsers) {
            const groupUserManager = DBManager.getUserManager(user.id);
            let name = await groupUserManager.getDisplayName();
            let url = await groupUserManager.getPhotoUrl();
            loadedUsers.push({id: user.id, displayName: name, selected: true, pfpUrl: url})
        }
        setCurrentGroupUsers(loadedUsers);
        setSomeoneIsSelectedInGroup(true);
        setCurrentGroupLoaded(true);
    }

    /**
     * Show a little list of every user in currently selected group's icon :)
     * @returns {Component} list of user icons
     */
    function populateGroupUserPreview() {
        if (currentGroupLoaded && currentGroup.length > 0) {
            return currentGroupUsers.map((user, index) => {
                return (
                    <div 
                        className="friend-container" 
                        key={index} 
                        onClick={() => { 
                            toggleSelectedGroupUser(user.id);
                        }
                    }>
                        <AvatarToggle 
                            outlined={user.selected} 
                            id={user.id} 
                            src={user.pfpUrl}
                            displayName={user.displayName}
                        />
                    </div> 
                )
            })
        }
    }

    function handleGroupCancel() {
        setCurrentGroup("");
    }

    return (
        <div className="split-page-content">
            <div className={"search-bar " + (groupsExpanded ? "hidden" : "")}>
                <Typography variant="h6">Select Friends</Typography>
                <FormControl className="friend-search-box">
                    <Input
                        value={searchString}
                        onChange={handleSearchChange}
                        label="Friend Display Name"
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        }
                    >
                    </Input>
                </FormControl>
            </div>
            <div className={"friend-preview " + (searchExpanded ? "expanded" : "") + (groupsExpanded ? "hidden" : "")} disabled={groupsExpanded}>
                <div className="avatar-container">
                    <div className="scroller">
                        { populateFriendScroller() }
                    </div>
                </div>
            </div>
            <div className={"group-select " + (searchExpanded ? "hidden " : "") + (groupsExpanded ? "expanded" : "")} disabled={searchExpanded}>
                <div className="divider">
                    <Typography variant="subtitle2">or</Typography>
                </div>
                <div className="title">
                    <Typography variant="h6">Assign to a Group</Typography>
                </div>
                <FormControl className="group-select-box">
                    <InputLabel id="group-select-label">Group</InputLabel>
                    <Select 
                        value={currentGroup} 
                        labelId="group-select-label" 
                        onChange={handleGroupChange} 
                        label="Group"
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        { populateGroupSelect() }
                    </Select>
                </FormControl>
                <div className="user-preview">
                    { populateGroupUserPreview() }
                </div>
            </div>
            <div className="next-button">
                <Button variant="contained" disabled={!nextEnabled} onClick={() => handleNext()}>Next</Button>
            </div>
            <div className={"group-cancel-button " + (groupsExpanded ? "visible" : "")}>
                <Button variant="outlined" onClick={() => handleGroupCancel()}>Cancel</Button>
            </div>
        </div>
    )
}

function TransactionDetailsPage({setSplitPage, setTransactionAmount, setTransactionTitle, currentGroup, groupPicklistContent}) {

    const [newTitle, setNewTitle] = useState("");                   // New transaction's title
    const [newTotal, setNewTotal] = useState(null);                 // New transcation total
    const [submitEnable, setSubmitEnable] = useState(false);
    const [totalError, setTotalError] = useState(false);

    function renderHeader() {
        if (currentGroup) { 
            // Since currentGroup is just an Id, we traverse through the picklist to get the group's name
            // This is an annoying quirk of how the actual picklist element works. It's a pain in the ass 
            // but I think this is the best way to get around it at the moment.
            if (currentGroup.length > 0) {
                for (const group of groupPicklistContent) {
                    if (group.id === currentGroup) {
                        return (
                            <Typography variant="h6">{group.name}</Typography>
                        )
                    }
                }
            }
        } else {
            return (
                <Typography variant="h6">New Transaciton with Friends</Typography>
            )
        }
    }

    function checkSubmitEnable() {
        if (!newTitle) {
            return;
        }
        if (!newTotal) {
            return;
        }
        setSubmitEnable(newTitle.length > 0 && newTotal.length > 0 && !totalError)
    }

    function handleTitleChange(e) {
        setNewTitle(e.target.value);
        if (!newTotal) {
            return;
        }
        setSubmitEnable(e.target.value.length > 0 && newTotal.length > 0 && !totalError)
    }

    function handleTotalChange(e) {
        const result = e.target.value.replace(/\D+/g, '');
        setNewTotal(result);
        let errored = false;
        if (parseInt(result) <= 5 || e.target.value.includes(".")) {
            errored = true;
            setTotalError(true);
        } else {
            setTotalError(false);
        }
        if (!newTitle) {
            return;
        }
        setSubmitEnable(newTitle.length > 0 && result.length > 0 && !errored)
    }

    function setTransactionDetails() {
        setTransactionAmount(newTotal);
        setTransactionTitle(newTitle);
    }

    return (
        <div className="split-page-content">
            <div className="transaction-detail-page">
                <div className="header">
                    { renderHeader() }
                </div>
                <div className="transaction-detail-form">
                    <div className="form-input">
                        <Typography variant="subtitle1">Title:</Typography>
                        <FormControl className="title-text-field">
                            <TextField
                                value={newTitle}
                                onChange={handleTitleChange}
                                onBlur={checkSubmitEnable}
                                onFocus={checkSubmitEnable}
                                label="ex. My Transaction"
                            >
                            </TextField>
                        </FormControl>
                    </div>
                    <div className="form-input">
                        <Typography variant="subtitle1">Total:</Typography>
                        <FormControl className="title-text-field">
                            <TextField
                                value={newTotal ? newTotal : ""}
                                onChange={handleTotalChange}
                                onBlur={checkSubmitEnable}
                                onFocus={checkSubmitEnable}
                                label="ex. 100"
                            >
                            </TextField>
                        </FormControl>
                    </div>
                </div>
                <div className={"number-error " + (totalError ? "" : "hidden")}>
                    <Typography variant="subtitle2" color="red">Total must be whole number greater than $5</Typography>
                </div>
                <div className="split-section">                
                    <Typography variant="h6">How do you want to split this payment?</Typography>
                    <div className="split-type-buttons">
                        <Button variant="contained" disabled={!submitEnable} className="split-type-button" onClick={() => {setTransactionDetails(); setSplitPage("even-split")}}>Evenly</Button>
                        <Button variant="contained" disabled={!submitEnable} className="split-type-button" onClick={() => {setTransactionDetails(); setSplitPage("manual-split")}}>Manually</Button>
                    </div>
                </div>
                <div className="back-button" onClick={() => setSplitPage("add-people")}>
                    <ArrowBackIcon />
                    <Typography marginLeft="5px" variant="subtitle1">Go Back</Typography>
                </div>
            </div>
        </div>
    )
}

function WeightSelection({transactionTitle, transactionAmount, manual, peopleInvolved}) {

    const [weightedUsers, setWeightedUsers] = useState([]);

    const [currentPerson, setCurrentPerson] = useState(0);
    const [someoneFronted, setSomeoneFronted] = useState(false);

    function renderCurrentCard() {
        return <WeightCard setCurrentPerson={setCurrentPerson} currentPerson={currentPerson} someoneFronted={someoneFronted} setSomeoneFronted={setSomeoneFronted} key={currentPerson} manual={manual} person={peopleInvolved[currentPerson]} weightedUsers={weightedUsers} setWeightedUsers={setWeightedUsers} />
    }

    return (
        <div className="weight-selection-page-wrapper">
            <div className="header">
                <Typography variant="h6">{transactionTitle}</Typography>
                <Typography variant="h6">Total: ${transactionAmount}</Typography>
                <Typography variant="h6">Users endered: {currentPerson}/{peopleInvolved.length}</Typography>
            </div>
            { renderCurrentCard() }
        </div>
    )
}


function WeightCard({manual, person, weightedUsers, someoneFronted, setSomeoneFronted, currentPerson, setCurrentPerson, setWeightedUsers}) {

    const [cardPage, setCardPage] = useState("role-select");

    function handleRoleSelect(roleType) {
        if (roleType === "fronter") {
            setSomeoneFronted(true);
        }
        const array = weightedUsers;
        array.push({
            id: person.id,
            role: roleType,
            amount: null  
        });
        setWeightedUsers(array);
        if (!manual) {
            setCurrentPerson(currentPerson + 1);
        } else {
            setCardPage("how-much");
        }
    }

    function renderCardPage() {
        switch (cardPage) {
            case "role-select":
                return <RoleSelect person={person} handleRoleSelect={handleRoleSelect} someoneFronted={someoneFronted}/>;
            case "how-much":
                return <HowMuch person={person} weightedUsers={weightedUsers} setWeightedUsers={setWeightedUsers}/>;
            case "summary":
                return <WeightSummary />;
            default:
                return <div>Error: Invalid card page.</div>;
        }
    }

    return (
        <Paper className="weight-card" elevation={3}>
            <div className="user-identification">
                <AvatarIcon src={person.pfpUrl} displayName={person.displayName} size={100} />
                <Typography variant="h6">{person.displayName}</Typography>
            </div>
            { renderCardPage() }
        </Paper>
    )
}

function RoleSelect({person, handleRoleSelect, someoneFronted}) {
    return (
        <div className="split-question">
            <Typography variant="subtitle1">Did {person.displayName.substring(0, person.displayName.indexOf(" "))}{someoneFronted ? " also " : " "}front this payment?</Typography>
            <div className="fronted-buttons">
                <Button variant="contained" className="fronted-button" onClick={() => {handleRoleSelect("fronter")}}>Yes</Button>
                <Button variant="contained" className="fronted-button" onClick={() => {handleRoleSelect("payer")}}>No</Button>
            </div>
        </div>
    )
}

function HowMuch({person, weightedUsers}) {

    console.log(weightedUsers);
    
    function getQuestionByRole() {

        let currentUser = null;

        for (const user of weightedUsers) {
            if (user.id === person.id) {
                currentUser = user;
            }
        }

        if (currentUser) {
            const fronter =  (currentUser.role === "fronter") ? true : false;
            if (fronter) {
                return `How much is ${person.displayName.substring(0, person.displayName.indexOf(" "))} owed?`;
            }
            return `How much does ${person.displayName.substring(0, person.displayName.indexOf(" "))} owe?`;
        }
    }

    const [userAmount, setUserAmount] = useState(null);
    const [amountError, setAmountError] = useState(false);
    const [submitEnable, setSubmitEnable] = useState(false);

    function handleAmountChange(e) {
        const result = e.target.value.replace(/\D+/g, '');
        setUserAmount(result);
        let errored = false;
        if (parseInt(result) <= 5) {
            errored = true;
            setAmountError(true);
        } else {
            setAmountError(false);
        }
        setSubmitEnable(result.length > 0 && !errored)
    }

    function checkSubmitEnable() {
        if (!userAmount) {
            return;
        }
        if (!amountError && userAmount.length > 0) {
            setSubmitEnable(true);
        } else {
            setSubmitEnable(false);
        }
    }

    function handleNext() {
        
    }

    return (
        <div className="split-question">
            <Typography variant="subtitle1">{getQuestionByRole()}</Typography>
            <div className="amount-input">
                <FormControl className="title-text-field">
                    <TextField
                        value={userAmount ? userAmount : ""}
                        onChange={handleAmountChange}
                        onBlur={checkSubmitEnable}
                        onFocus={checkSubmitEnable}
                        label="$"
                    >
                    </TextField>
                </FormControl>
            </div>
            <div className={"number-error " + (amountError ? "" : "hidden")}>
                <Typography variant="subtitle2" color="red">Total must be whole number</Typography>
            </div>
            <div className="next-button">
                <Button variant="contained" disabled={!submitEnable} onClick={() => handleNext()}>Next</Button>
            </div>
        </div>
    )
}

function WeightSummary() {
    return (
        <div className="weight-summary">Summary!
        </div>
    )
}

function SummaryPage({setSplitPage}) {
    return (
        <div className="split-page-content">
            <div className="back-button" onClick={() => setSplitPage("split-type")}>
                <ArrowBackIcon />
                <Typography variant="subtitle1">Go Back</Typography>
            </div>
            <div className="split-target-buttons">
                <Button variant="outlined" onClick={() => setSplitPage("group-select")}>Groups</Button>
                <Button variant="contained">Friends</Button>
            </div>
        </div>
    )
}
