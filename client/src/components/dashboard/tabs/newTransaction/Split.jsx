// Library imports
import { useState, useEffect } from 'react';
import { Button, Select, FormControlLabel, Checkbox, InputLabel, FormControl, Switch, InputAdornment, Input, MenuItem, Typography, TextField, CircularProgress, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';

// API imports
import { SessionManager } from "../../../../api/sessionManager";
import { DBManager } from "../../../../api/db/dbManager";
import { AvatarIcon, AvatarToggle } from '../../../resources/Avatars';
import { sortByDisplayName } from '../../../../api/sorting';
import { TransactionRelation } from "../../../../api/db/objectManagers/transactionManager";

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
                return <TransactionDetailsPage transactionTitle={transactionTitle} transactionAmount={transactionAmount} setTransactionAmount={setTransactionAmount} currentGroup={currentGroup} setSplitPage={setSplitPage} groupPicklistContent={groupPicklistContent} setTransactionTitle={setTransactionTitle} peopleInvolved={peopleInvolved}/>;
            case "even-split":
                return <WeightSelection setWeightedUsers={setWeightedUsers} weightedUsers={weightedUsers} setSplitPage={setSplitPage} manual={false} transactionTitle={transactionTitle} transactionAmount={transactionAmount} peopleInvolved={peopleInvolved}/>;
            case "manual-split":
                return <WeightSelection setWeightedUsers={setWeightedUsers} weightedUsers={weightedUsers} setSplitPage={setSplitPage} manual={true} transactionTitle={transactionTitle} transactionAmount={transactionAmount} peopleInvolved={peopleInvolved}/>;
            case "transaction-summary":
                return <TransactionSummaryPage weightedUsers={weightedUsers} transactionTitle={transactionTitle} transactionAmount={transactionAmount} setSplitPage={setSplitPage}/>;
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

function TransactionDetailsPage({setSplitPage, setTransactionAmount, setTransactionTitle, currentGroup, groupPicklistContent, transactionTitle, transactionAmount}) {

    const [newTitle, setNewTitle] = useState(transactionTitle ? transactionTitle : "");                   // New transaction's title
    const [newTotal, setNewTotal] = useState(transactionAmount ? transactionAmount : null);                 // New transcation total
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

/**
 * Page for entering each user's role (and if manual how much everyone is owed/owes)
 * @param {function} setSplitPage function for setting current split page (used for back button on first question)
 * @param {string} transactionTitle title of this transaction
 * @param {number} transactionAmount total amount of transaction
 * @param {boolean} manual whether or not this transaction will be weighted manually
 * @param {array<Object>} peopleInvolved an array of all people involved in this transaction (id, displayName, and pfpUrl)
 * @param {Map} weightedUsers map of all processed users in this transaction
 * @param {function} setWeightedUsers setter function for weightedUsers
 */
function WeightSelection({setSplitPage, transactionTitle, transactionAmount, manual, peopleInvolved, weightedUsers, setWeightedUsers}) {

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
                <Typography variant="h6">Total: ${transactionAmount}</Typography>
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

    const [cardPage, setCardPage] = useState("role-select");    // Id of current page to display (role-select, how-much, or summary)

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
     * @param {number} userAmount amount of money that this user is owed/owes 
     */
    function handleAmountInput(userAmount) {
        const existingRole = weightedUsers.get(person.id).role;
        setWeightedUsers(new Map(weightedUsers.set(person.id, {role: existingRole, amount: userAmount})));
        setCardPage("weight-summary");
    }

    /**
     * Confirm user details and move on to next person
     */
    function handleSummarySubmit() {
        if (weightedUsers.get(person.id).role === "fronter") {
            setSomeoneFronted(true);
        }
        if (currentPerson + 1 >= totalPeople) {
            setSplitPage("transaction-summary");
        } else {
            setCurrentPerson(currentPerson + 1);
        }
    }

    function renderCardPage() {
        switch (cardPage) {
            case "role-select":
                return <RoleSelect person={person} handleSubmit={handleRoleSelect} someoneFronted={someoneFronted} goBack={() => setSplitPage("transaction-details")}/>;
            case "how-much":
                return <HowMuch person={person} handleSubmit={handleAmountInput} role={weightedUsers.get(person.id).role} goBack={() => setCardPage("role-select")}/>;
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
 * Page asking whether current person is a fronter or a payer in this transaction
 * @param {object} person object containing current person's id, displayName, and pfpUrl
 * @param {boolean} someoneFronted whether or not anyone has been declared as a fronter in this transaction yet
 * @param {function} handleSubmit function to be called on submit butt on press
 * @param {function} goBack function to be called on back button press
 * @returns 
 */
function RoleSelect({person, someoneFronted, handleSubmit, goBack}) {
    
    /**
     * Returns string asking if user fronter or not
     */
    function getQuestionString() {
        const name = person.self ? "you" : person.displayName.substring(0, person.displayName.indexOf(" "))
        const also = someoneFronted ? "also" : "";
        return `Did ${name} ${also} front this payment?`;
    }
    
    return (
        <div className="split-question">
            <Typography variant="subtitle1">{getQuestionString()}</Typography>
            <div className="fronted-buttons">
                <Button variant="contained" className="fronted-button" onClick={() => {handleSubmit("fronter")}}>Yes</Button>
                <Button variant="contained" className="fronted-button" onClick={() => {handleSubmit("payer")}}>No</Button>
            </div>
            <div className="back-button" onClick={() => goBack()}>
                <ArrowBackIcon />
                <Typography marginLeft="5px" variant="subtitle1">Edit</Typography>
            </div>
        </div>
    )
}

/**
 * Page asking how much each user is owed/owes
 * @param {object} person object containing person's id, displayName, and pfpUrl 
 * @param {role} string current person's role in this transaction 
 * @param {function} handleSubmit function to be called on submit button press
 * @param {function} goBack cardPage setter function (abstracted w/ different name)  
 * @returns 
 */
function HowMuch({person, role, handleSubmit, goBack}) {

    const [userAmount, setUserAmount] = useState(null);         // Value of amount input box
    const [submitEnable, setSubmitEnable] = useState(false);    // Whether or not submit button is enabled
    
    /**
     * Gets question string by role (fronter or payer)
     * @returns String representing question
     */
    function getQuestion() {
        const toOwe = (role === "fronter") ? "owed" : "owe";
        const name = person.self ? "you" : person.displayName.substring(0, person.displayName.indexOf(" "));
        if (person.self) {
            const toBe = (role === "fronter") ? "are" : "do";
            return `How much ${toBe} ${name} ${toOwe}?`;
        } else {
            const toBe = (role === "fronter") ? "is" : "does";
            return `How much ${toBe} ${name} ${toOwe}?`;
        }
    }

    /**
     * Format string and set userAmount to new value
     * Check for errors and check if submit can be enabled
     * @param {event} e keypress event that triggered this function
     */
    function handleAmountChange(e) {
        const result = e.target.value.replace(/\D+/g, '');
        setUserAmount(result);
        setSubmitEnable(result.length > 0)
    }

    /**
     * Check whether or not the submit button should be enabled
     * Enabled if no userAmount is not null
     * @returns whether or not submit button should be enabled
     */
    function checkSubmitEnable() {
        if (!userAmount) {
            return;
        }
        setSubmitEnable(userAmount.length > 0);
    }

    return (
        <div className="split-question">
            <Typography variant="subtitle1">{getQuestion()}</Typography>
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
            <div className="next-button">
                <Button variant="contained" disabled={!submitEnable} onClick={() => handleSubmit(parseInt(userAmount))}>Next</Button>
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
     * Get a string representing whether or not the user is owed money or owes money
     * @returns Role string
     */
    function getSummaryRole() {
        const role = weightedUsers.get(person.id).role;
        if (role === "fronter") {
            return `${person.displayName.substring(0, person.displayName.indexOf(" "))} is owed`;
        }
        return `${person.displayName.substring(0, person.displayName.indexOf(" "))} owes`;
    }

    /**
     * Gets question string by role (fronter or payer)
     * @returns String representing question
     */
    function getSummaryRole() {
        const role = weightedUsers.get(person.id).role;
        const name = person.self ? "You" : person.displayName.substring(0, person.displayName.indexOf(" "));
        if (person.self) {
            const toOwe = (role === "fronter") ? "owed" : "owe";
            const toBe = (role === "fronter") ? " are " : " ";
            return `${name}${toBe}${toOwe}`;
        } else {
            const toOwe = (role === "fronter") ? "owed" : "owes";
            const toBe = (role === "fronter") ? " is " : " ";
            return `${name}${toBe}${toOwe}`;
        }
    }

    /**
     * Get a string representing how much the user is owed/owes
     * @returns Amount string
     */
    function getSummaryAmount() {
        const amount = weightedUsers.get(person.id).amount;
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

function TransactionSummaryPage({weightedUsers, transactionTitle, transactionAmount, setSplitPage}) {

    const [relations, setRelations] = useState([]);

    useEffect(() => { // Make the relations on component mount
        let newRelations = [];
        let fronters = [];
        let payers = [];
        let totalOwedToFronters = 0;

        // First, get all fronters and all payers...
        // Also update totals
        for (const key of weightedUsers) {
            const user = key[1];
            if (user.role === "fronter") {
                // This is a fronter
                fronters.push(user);
                totalOwedToFronters += parseInt(user.amount);
            } else {
                // This is a payer
                payers.push(user);
            }
        }

        // Now that we've calculated how much is owed in total, we can start splitting dues evenly.
        // If person A is owed 50 dollars, person B is owed 30 dollars, person C owes 20 dollars, and person D owes 60 dollars,
        // we need to make sure that whatever C or D are pay A and B is relative to how much of the total they fronted
        // The total fronted is "totalOwedToFronters"
        // Let's make a map that keeps track of fronter ids and how much of the total they paid
        const fronterRatios = new Map();
        for (const fronter of fronters) {
            fronterRatios.set(fronter.id, fronter.amount / totalOwedToFronters);
        }

        // Now, for each payer, we see how much they owe to each fronter
        for (const payer of payers) {
            for (const key of fronterRatios) {
                const fronterId = key[0];
                const ratio = key[1];
                // Calc amt to this fronter...
                const amountOwedToFronter = payer.amount * ratio;
                // Make a TransactionRelation...
                const relation = new TransactionRelation(payer.id, fronterId, amountOwedToFronter);
                newRelations.push(relation);
            }
        }
        
        setRelations(newRelations);
    }, [])

    function renderRelations() {
        return (<div>Test</div>)
    }

    return (
        <div className="split-page-content">
            <div className="transaction-summary-page">
                <div className="header">
                    <Typography variant="h6">{transactionTitle}</Typography>
                    <Typography variant="h6">Total: ${transactionAmount}</Typography>
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
