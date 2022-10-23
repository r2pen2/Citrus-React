// Library imports
import { useState, useEffect } from 'react';
import { Button, Select, CardContent, InputLabel, FormControl, InputAdornment, Input, MenuItem, Typography, TextField, CircularProgress, Paper, TableContainer, TableHead, Table, TableRow, TableCell, TableBody } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';

// Component imports
import { OutlinedCard } from "../../../resources/Surfaces";

// API imports
import { SessionManager } from "../../../../api/sessionManager";
import { DBManager } from "../../../../api/db/dbManager";
import { AvatarIcon, AvatarToggle } from '../../../resources/Avatars';
import { sortByDisplayName } from '../../../../api/sorting';
import { TransactionRelation } from "../../../../api/db/objectManagers/transactionManager";
import { makeNumeric, cutAtSpace } from '../../../../api/strings';

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
    const [weightedUsers, setWeightedUsers] = useState(new Map());          // Map for keeping track of user roles and amounts

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
                return <TransactionDetailsPage transactionTitle={transactionTitle}currentGroup={currentGroup} setSplitPage={setSplitPage} groupPicklistContent={groupPicklistContent} setTransactionTitle={setTransactionTitle} peopleInvolved={peopleInvolved}/>;
            case "even-split":
                return <WeightSelection setWeightedUsers={setWeightedUsers} weightedUsers={weightedUsers} setSplitPage={setSplitPage} manual={false} transactionTitle={transactionTitle} peopleInvolved={peopleInvolved}/>;
            case "manual-split":
                return <WeightSelection setWeightedUsers={setWeightedUsers} weightedUsers={weightedUsers} setSplitPage={setSplitPage} manual={true} transactionTitle={transactionTitle} peopleInvolved={peopleInvolved}/>;
            case "transaction-amount-error":
                return <TransactionAmountErrorPage weightedUsers={weightedUsers} setWeightedUsers={setWeightedUsers} transactionTitle={transactionTitle} setSplitPage={setSplitPage} peopleInvolved={peopleInvolved}/>;
            case "transaction-summary":
                return <TransactionSummaryPage weightedUsers={weightedUsers} transactionTitle={transactionTitle} setSplitPage={setSplitPage} peopleInvolved={peopleInvolved}/>;
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
    
    const [searchString, setSearchString] = useState("");                           // Contents of search box
    const [friends, setFriends] = useState(null);                                   // List of user's friends (stored as objects)
    const [friendsLoaded, setFriendsLoaded] = useState(false);                      // Whether or not friends have loaded personal information yet
    const [searchExpanded, setSearchExpanded] = useState(false);                    // Whether or not search is expanded
    const [nextEnabled, setNextEnabled] = useState(false);                          // Whether or not the "next" button is enabled
    const [someoneIsSelected, setSomeoneIsSelected] = useState(false);              // Whether or not anyone is currently selected
    const [groupsExpanded, setGroupsExpanded] = useState(false);                    // Whether or not the groups section is expanded
    const [currentGroupUsers, setCurrentGroupUsers] = useState(null);               // All users in currently selected group
    const [currentGroupLoaded, setCurrentGroupLoaded] = useState(false);            // Whether or not data for users in current group is loaded
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
     * Sort array of people involved by displayname and insert self at front
     * @param {array} array array of all other people (unsorted and without self)
     * @returns array of all people involved, sorted by displayname, with self in front
     */
    function sortPeopleAndAddSelf(array) {
        // Object representing current user
        const myself = {
            id: SessionManager.getUserId(),
            pfpUrl: SessionManager.getPfpUrl(),
            displayName: SessionManager.getDisplayName(),
            self: true,
        }
        array = sortByDisplayName(array); // Sort the array
        array.unshift(myself); // Put self at the start
        return array;
    }

    /** 
     * Handle next button press, passing on information to next page
     */
    function handleNext() {
        var contextSet = false;
        if (searchExpanded) {
            var friendsSelected = [];
            for (const friend of friends) {
                if (friend.selected) {
                    friendsSelected.push({
                        id: friend.id,
                        pfpUrl: friend.pfpUrl,
                        displayName: friend.displayName,
                        self: false,
                    });
                }
            }
            friendsSelected = sortPeopleAndAddSelf(friendsSelected);
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
                        displayName: user.displayName,
                        self: false,
                    });
                }
            }
            usersSelected = sortPeopleAndAddSelf(usersSelected);
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

/**
 * 
 * @param {function} setSplitPage used for moving on to the next page of new transaction
 * @param {string} transactionTitle title of new transaction (possibly filled in from back button press) 
 * @param {function} setTransactionTitle set title of transaction to input
 * @param {string} currentGroup id of current group or null
 * @param {array<object>} groupPicklistContent all groups and some information about them (name, id, people)
 * @returns 
 */
function TransactionDetailsPage({setSplitPage, setTransactionTitle, currentGroup, groupPicklistContent, transactionTitle}) {

    const [newTitle, setNewTitle] = useState(transactionTitle ? transactionTitle : "");     // New transaction's title
    const [submitEnable, setSubmitEnable] = useState(false);                                // Whether or not submit button is enabled

    function renderHeader() {
        if (currentGroup) { 
            // Since currentGroup is just an Id, we traverse through the picklist to get the group's name
            // This is an annoying quirk of how the actual picklist element works. It's a pain in the ass 
            // but I think this is the best way to get around it at the moment.
            if (currentGroup.length > 0) {
                for (const group of groupPicklistContent) {
                    if (group.id === currentGroup) {
                        return (
                            <Typography variant="h6">{group.name}{newTitle.length > 0 ? (": " + newTitle) : ""}</Typography>
                        )
                    }
                }
            }
        } else {
            return (
                newTitle.length > 0 ? <Typography variant="h6">{newTitle}</Typography> : <Typography variant="h6">New Transaciton with Friends</Typography>
            )
        }
    }

    function checkSubmitEnable() {
        if (!newTitle) {
            return;
        }
        return newTitle.length > 0;
    }

    function handleTitleChange(e) {
        setNewTitle(e.target.value);
        setSubmitEnable(e.target.value.length > 0);
    }

    function setTransactionDetails() {
        setTransactionTitle(newTitle);
    }

    return (
        <div className="split-page-content">
            <div className="transaction-detail-page" onLoad={() => checkSubmitEnable()}>
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
                </div>
                <div className="split-section">                
                    <Typography variant="h6">How do you want to split this payment?</Typography>
                    <div className="split-type-buttons">
                        <Button variant="contained" disabled={!checkSubmitEnable()} className="split-type-button" onClick={() => {setTransactionDetails(); setSplitPage("even-split")}}>Evenly</Button>
                        <Button variant="contained" disabled={!checkSubmitEnable()} className="split-type-button" onClick={() => {setTransactionDetails(); setSplitPage("manual-split")}}>Manually</Button>
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

/**
 * Page for entering each user's role (and if manual how much everyone is owed/owes)
 * @param {function} setSplitPage function for setting current split page (used for back button on first question)
 * @param {string} transactionTitle title of this transaction
 * @param {boolean} manual whether or not this transaction will be weighted manually
 * @param {array<Object>} peopleInvolved an array of all people involved in this transaction (id, displayName, and pfpUrl)
 * @param {Map} weightedUsers map of all processed users in this transaction
 * @param {function} setWeightedUsers setter function for weightedUsers
 */
function WeightSelection({setSplitPage, transactionTitle, manual, peopleInvolved, weightedUsers, setWeightedUsers}) {

    const [currentPerson, setCurrentPerson] = useState(0);          // Int for keeping track of which person in the list of people we're currently looking at
    const [someoneFronted, setSomeoneFronted] = useState(false);    // Boolean representing whether or not someone has been declared as a fronter yet

    /**
     * Renders a weight card for the current user
     */
    function renderCurrentCard() {
        return <WeightCard setSplitPage={setSplitPage} setCurrentPerson={setCurrentPerson} currentPerson={currentPerson} someoneFronted={someoneFronted} setSomeoneFronted={setSomeoneFronted} key={currentPerson} manual={manual} person={peopleInvolved[currentPerson]} weightedUsers={weightedUsers} setWeightedUsers={setWeightedUsers} totalPeople={peopleInvolved.length}/>
    }

    return (
        <div className="weight-selection-page-wrapper">
            <div className="header">
                <Typography variant="h6">{transactionTitle}</Typography>
                <Typography variant="h6">Users endered: {currentPerson}/{peopleInvolved.length}</Typography>
            </div>
            { renderCurrentCard() }
        </div>
    )
}

/**
 * Parent element for all pages that figure out exactly how a user fits into this transaction
 * Will cycle through fronter/payer question, how much, and a summary
 * @param {boolean} manual whether or not this transaction will be weighted manually
 * @param {object} person current person object containing id, displayName, and pfpUrl
 * @param {Map} weightedUsers map of all processed users in this transaction
 * @param {function} setWeightedUsers setter function for weightedUsers
 * @param {boolean} someoneFronted whether or not anyone has been declared as a fronter in this payment yet
 * @param {function} setSomeoneFronted setter function for someoneFronted
 * @param {number} currentPerson index of current person in array of all people
 * @param {function} setCurrentPerson setter function for currentPerson
 * @param {number} totalPeople total number of people in this transaction
 */
function WeightCard({setSplitPage, manual, person, weightedUsers, setWeightedUsers, someoneFronted, setSomeoneFronted, currentPerson, setCurrentPerson, totalPeople}) {

    const [cardPage, setCardPage] = useState("how-much");    // Id of current page to display (how-much or summary)

    /**
     * Set current user's role in map and either move on to how-much or next person if this transaction isn't weighted manually
     * @param {string} roleType role to apply to current user 
     */
    function handleRoleSelect(roleType) {
        setWeightedUsers(new Map(weightedUsers.set(person.id, {role: roleType, amount: null})));
        if (!manual) {
            if (currentPerson + 1 >= totalPeople) {
                setSplitPage("transaction-summary");
            } else {
                setCurrentPerson(currentPerson + 1);
                if (roleType === "fronter") {
                    setSomeoneFronted(true);
                }
            }
        } else {
            setCardPage("how-much");
        }
    }

    /**
     * Set a current user's amount owed in the map and move on to summary
     * @param {number} amountPaid amount of money that this user paid
     * @param {number} amountShouldHavePaid amount of money that this user should have paid 
     */
    function handleAmountInput(amountPaid, amountShouldHavePaid) {
        setWeightedUsers(new Map(weightedUsers.set(person.id, {paid: amountPaid, shouldHavePaid: amountShouldHavePaid})));
        setCardPage("weight-summary");
    }

    /**
     * Confirm user details and move on to next person
     */
    function handleSummarySubmit() {

        function checkWeightedUsersValid() {
            let totalPaid = 0;
            let totalShouldHavePaid = 0;
            for (const key of weightedUsers) {
                const user = key[1];
                totalPaid += parseInt(user.paid);
                totalShouldHavePaid += parseInt(user.shouldHavePaid);
            }
            return (totalPaid === totalShouldHavePaid);
        }

        if (currentPerson + 1 >= totalPeople) {
            if (checkWeightedUsersValid()) {
                setSplitPage("transaction-summary");
            } else {
                setSplitPage("transaction-amount-error")
            }
        } else {
            setCurrentPerson(currentPerson + 1);
        }
    }

    function renderCardPage() {
        switch (cardPage) {
            case "how-much":
                return <HowMuch person={person} handleSubmit={handleAmountInput} goBack={() => setSplitPage("transaction-details")}/>;
            case "weight-summary":
                return <WeightSummary person={person} handleSubmit={handleSummarySubmit} weightedUsers={weightedUsers} goBack={() => setCardPage("how-much")}/>;
            default:
                return <div>Error: Invalid card page.</div>;
        }
    }

    return (
        <Paper className="weight-card" elevation={3}>
            <div className="user-identification">
                <AvatarIcon src={person.pfpUrl} displayName={person.displayName} size={100} />
                <Typography variant="h6">{person.displayName}</Typography>
                <Typography variant="subtitle2" color="primary" className={"self-notif " + (!person.self ? "hidden" : "")}>(You)</Typography>
            </div>
            { renderCardPage() }
        </Paper>
    )
}

/**
 * Page asking how much each user is owed/owes
 * @param {object} person object containing person's id, displayName, and pfpUrl 
 * @param {function} handleSubmit function to be called on submit button press
 * @param {function} goBack cardPage setter function (abstracted w/ different name)  
 * @returns 
 */
function HowMuch({person, handleSubmit, goBack}) {

    const [amountPaid, setAmountPaid] = useState(null);                     // Value of paid input box
    const [amountShouldHavePaid, setAmountShouldHavePaid] = useState(null); // Value of should have paid input box
    const [submitEnable, setSubmitEnable] = useState(false);                // Whether or not submit button is enabled
    
    /**
     * Gets paid question string
     * @returns String representing question
     */
    function getPaidQuestion() {
        const name = person.self ? "you" : cutAtSpace(person.displayName);
        return `How much did ${name} pay?`;
    }

    /**
     * Gets should have paid string
     * @returns String representing question
     */
    function getShouldHavePaidQuestion() {
        const name = person.self ? "you" : cutAtSpace(person.displayName);
        return `How much should ${name} have paid?`;
    }

    /**
     * Format string and set userAmount to new value
     * Check for errors and check if submit can be enabled
     * @param {event} e keypress event that triggered this function
     * @param {function} setter function for setting new val
     */
    function handleAmountChange(e, setter) {
        const result = makeNumeric(e.target.value);
        setter(result);
        setSubmitEnable(result.length > 0)
    }

    /**
     * Check whether or not the submit button should be enabled
     * Enabled if no userAmount is not null
     * @returns whether or not submit button should be enabled
     */
    function checkSubmitEnable() {
        if (!amountPaid || !amountShouldHavePaid) {
            return;
        }
        setSubmitEnable(amountPaid.length > 0 && amountShouldHavePaid.length > 0);
    }

    return (
        <div className="split-question">
            <Typography variant="subtitle1">{getPaidQuestion()}</Typography>
            <div className="amount-input">
                <FormControl className="title-text-field">
                    <TextField
                        value={amountPaid ? amountPaid : ""}
                        onChange={(e) => handleAmountChange(e, setAmountPaid)}
                        onBlur={checkSubmitEnable}
                        onFocus={checkSubmitEnable}
                        type="number"
                        label="$ Paid"
                    >
                    </TextField>
                </FormControl>
            </div>
            <Typography variant="subtitle1">{getShouldHavePaidQuestion()}</Typography>
            <div className="amount-input">
                <FormControl className="title-text-field">
                    <TextField
                        value={amountShouldHavePaid ? amountShouldHavePaid : ""}
                        onChange={(e) => handleAmountChange(e, setAmountShouldHavePaid)}
                        onBlur={checkSubmitEnable}
                        onFocus={checkSubmitEnable}
                        type="number"
                        label="$ Should Pay"
                    >
                    </TextField>
                </FormControl>
            </div>
            <div className="next-button">
                <Button variant="contained" disabled={!submitEnable} onClick={() => handleSubmit(parseInt(amountPaid), parseInt(amountShouldHavePaid))}>Next</Button>
            </div>
            <div className="back-button" onClick={() => goBack()}>
                <ArrowBackIcon />
                <Typography marginLeft="5px" variant="subtitle1">Back</Typography>
            </div>
        </div>
    )
}

/**
 * Summary card for current user that displays their role, how much they owe, and a button to confirm
 * @param {Map} weightedUsers map of all processed users in this transaction
 * @param {Object} person object containing a person's id, pfpUrl, and displayName
 * @param {function} handleSubmit function to be called on submit button press
 * @param {function} goBack cardPage setter function (abstracted w/ different name)  
 */
function WeightSummary({weightedUsers, person, handleSubmit, goBack}) {

    /**
     * Gets question string by role (fronter or payer)
     * @returns String representing question
     */
    function getSummaryRole() {
        const owed = (weightedUsers.get(person.id).paid > weightedUsers.get(person.id).shouldHavePaid);
        const name = person.self ? "You" : cutAtSpace(person.displayName);
        if (person.self) {
            const toOwe = owed ? "owed" : "owe";
            const toBe = owed ? " are " : " ";
            return `${name}${toBe}${toOwe}`;
        } else {
            const toOwe = owed ? "owed" : "owes";
            const toBe = owed ? " is " : " ";
            return `${name}${toBe}${toOwe}`;
        }
    }

    /**
     * Get a string representing how much the user is owed/owes
     * @returns Amount string
     */
    function getSummaryAmount() {
        const amount = Math.abs((weightedUsers.get(person.id).paid - weightedUsers.get(person.id).shouldHavePaid));
        return `$${amount}`;
    }

    return (
        <div className="split-question">
            <Typography variant="subtitle1">{getSummaryRole()}</Typography>
            <Typography variant="h5">{getSummaryAmount()}</Typography>
            <div className="next-button">
                <Button variant="contained" onClick={() => handleSubmit()}>Submit</Button>
            </div>
            <div className="back-button" onClick={() => goBack()}>
                <ArrowBackIcon />
                <Typography marginLeft="5px" variant="subtitle1">Edit</Typography>
            </div>
        </div>
    )
}

function TransactionAmountErrorPage({weightedUsers, setWeightedUsers, transactionTitle, setSplitPage, peopleInvolved}) {

    const [totalPaid, setTotalPaid] = useState(0);
    const [totalShouldHavePaid, setTotalShouldHavePaid] = useState(0);

    function createData(displayName, amountPaid, amountShouldHavePaid, userId) {
        return { displayName, amountPaid, amountShouldHavePaid, userId };
    }

    const [tableRows, setTableRows] = useState([]);



    /**
     * Submit new map and move on to summary
     */
     function handleSubmit() {
        // Inputs will always be valid if submit button is enabled
        setSplitPage("transaction-summary");
    }

    useEffect(() => { // Make count totals on mount
        let tp = 0;
        let tshp = 0;
        for (const key of weightedUsers) {
            const user = key[1];
            tp += parseInt(user.paid);
            tshp += parseInt(user.shouldHavePaid);
        }
        setTotalPaid(tp);
        setTotalShouldHavePaid(tshp);
        
        // Create rows for table
        let newTableData = [];
        for (const key of weightedUsers) {
            const user = key[1];
            let displayName = "";
            for (const p of peopleInvolved) {
                if (p.id === key[0]) {
                    displayName = p.displayName;
                }
            }
            newTableData.push(createData(displayName, user.paid, user.shouldHavePaid, key[0]));
        }
        setTableRows(newTableData);

    }, [weightedUsers, peopleInvolved])

    function handleCellChange(event, id, changeField) {
        const inputVal = parseInt(makeNumeric(event.target.value));
        console.log(changeField)
        if (changeField === "paid") {
            // This is the "paid" input
            weightedUsers.set(id, {paid: inputVal, shouldHavePaid: weightedUsers.get(id).shouldHavePaid});
            setWeightedUsers(new Map(weightedUsers));

        } else if (changeField === "should-have-paid") {
            // This is the "should have paid" input
            weightedUsers.set(id, {paid: weightedUsers.get(id).paid, shouldHavePaid: inputVal});
            setWeightedUsers(new Map(weightedUsers));
        }
    }

    return (
        <div className="split-page-content">
            <div className="transaction-summary-page">
                <div className="header">
                    <Typography variant="h6">{transactionTitle}</Typography>
                    <Typography variant="subtitle1">Oh no! There's something wrong!</Typography>
                </div>
                <div className="table">
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <caption>Edit values so that these totals are the same.</caption>
                        <TableHead>
                          <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell align="right">$ Paid</TableCell>
                            <TableCell align="right">$ Should Pay</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableRows.map((row) => (
                                <TableRow key={row.displayName} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                    <TableCell component="th" scope="row">
                                        {row.displayName}
                                    </TableCell>
                                    <TableCell align="right">
                                        <div className="cell-input">
                                            <FormControl className="table-field">
                                                <TextField
                                                    value={row.amountPaid}
                                                    onChange={(e) => handleCellChange(e, row.userId, "paid")}
                                                    inputProps={{min: 0, style: { textAlign: 'center' }}}
                                                    label="$ Paid"
                                                    type="number"
                                                >
                                                </TextField>
                                            </FormControl>
                                        </div>
                                    </TableCell>
                                    <TableCell align="right">
                                        <div className="cell-input">
                                            <FormControl className="table-field">
                                                <TextField
                                                    value={row.amountShouldHavePaid}
                                                    onChange={(e) => handleCellChange(e, row.userId, "should-have-paid")}
                                                    inputProps={{min: 0,  style: { textAlign: 'center' }}}
                                                    type="number"
                                                    label="$ Should Pay"
                                                >
                                                </TextField>
                                            </FormControl>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={1} align="right">Totals</TableCell>
                                <TableCell align="right">{totalPaid}</TableCell>
                                <TableCell align="right">{totalShouldHavePaid}</TableCell>
                            </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                </div>
                <div className="next-button">
                    <Button variant="contained" disabled={(totalPaid !== totalShouldHavePaid)} onClick={() => {handleSubmit()}}>Submit</Button>
                </div>
                <div className="back-button" onClick={() => setSplitPage("transaction-details")}>
                    <ArrowBackIcon />
                    <Typography marginLeft="5px" variant="subtitle1">Cancel</Typography>
                </div>
            </div>
        </div>
    )
}

function TransactionSummaryPage({weightedUsers, transactionTitle, setSplitPage, peopleInvolved}) {

    const [relations, setRelations] = useState([]);
    const [transactionTotal, setTransactionTotal] = useState(0);

    useEffect(() => { // Make the relations on component mount
        let newRelations = [];
        let bystanders = [];
        let negativeUsers = [];
        let positiveUsers = [];
        let totalOwed = 0;
        let totalPaid = 0;

        // First, get all fronters and all payers...
        // Also update totals
        for (const key of weightedUsers) {
            const user = key[1];
            totalPaid += user.paid;
            if (user.paid === user.shouldHavePaid) {
                // This is a bystander lol
                bystanders.push(key);
            } else {
                if (user.paid > user.shouldHavePaid) {
                    // This person is owed money
                    totalOwed += user.paid - user.shouldHavePaid;
                    negativeUsers.push(key);
                } else {
                    // This person owes money
                    positiveUsers.push(key);
                }
            }
        }

        // Create a map of the ratios between a how much a user is owed and the total amount owed
        const ratioMap = new Map();
        for (const key of negativeUsers) {
            const user = key[1];
            ratioMap.set(key[0], (user.paid - user.shouldHavePaid) / totalOwed);
        }

        // Now create relations from all people who owe money to those who are owed
        for (const senderKey of positiveUsers) {
            const senderId = senderKey[0];
            const sender = senderKey[1];
            for (const receiverKey of negativeUsers) {
                const receiverId = receiverKey[0];
                console.log(senderKey)
                const amountToSend = (sender.shouldHavePaid - sender.paid) * ratioMap.get(receiverId);
                const relation = new TransactionRelation(senderId, receiverId, amountToSend);
                newRelations.push(relation);
            }
        }
        console.log(newRelations)
        setRelations(newRelations);
        setTransactionTotal(totalPaid);
    }, [weightedUsers])

    function renderRelations() {

        function getName(userId) {
            for (const user of peopleInvolved) {
                if (user.id === userId) {
                    return user.displayName;
                }
            }
        }

        function getSrc(userId) {
            for (const user of peopleInvolved) {
                if (user.id === userId) {
                    return user.pfpUrl;
                }
            }
        }

        return (
            relations.map((relation, index) => {
                return (
                    <OutlinedCard key={index}>
                        <CardContent>
                            <div className="relation-card-content-container">
                                <div className="relation-content">
                                    <AvatarIcon src={getSrc(relation.from)} alt={"From user photo"}/>
                                    <Typography variant="subtitle1" color="primary">${relation.amount}</Typography>
                                    <Typography variant="subtitle1" color="primary">⟹</Typography>
                                    <AvatarIcon src={getSrc(relation.from)} alt={"To user photo"}/>
                                </div>
                                <div className="relation-content">
                                    <Typography>{cutAtSpace(getName(relation.from))} owes {cutAtSpace(getName(relation.to))} ${relation.amount}</Typography>
                                </div>
                            </div>
                        </CardContent>
                    </OutlinedCard>
                )
            })
        )
    }

    return (
        <div className="split-page-content">
            <div className="transaction-summary-page">
                <div className="header">
                    <Typography variant="h6">{transactionTitle}</Typography>
                    <Typography variant="h6">Total Paid: ${transactionTotal}</Typography>
                </div>
                <div className="relations">
                    { renderRelations() }
                </div>
                <div className="back-button" onClick={() => setSplitPage("transaction-details")}>
                    <ArrowBackIcon />
                    <Typography marginLeft="5px" variant="subtitle1">Cancel</Typography>
                </div>
            </div>
        </div>
    )
}
