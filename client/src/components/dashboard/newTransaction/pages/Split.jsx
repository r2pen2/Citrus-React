import { useState, useEffect } from 'react';
import { Button, IconButton, Select, InputLabel, FormControl, InputAdornment, Input, MenuItem, Typography, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { getGroupsByUserId, getGroupNameById, getFriendsById, getDisplayNameById, getPhotoUrlById, getUsersByGroupId } from "../../../../api/dbManager";
import { AvatarToggle, AvatarIcon } from '../../../resources/Avatars';
import { sortByDisplayName } from '../../../../api/sorting';

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
                return <AddPeoplePage user={props.user} setSplitPage={setSplitPage} currentGroup={currentGroup} setCurrentGroup={setCurrentGroup} groupPicklistContent={groupPicklistContent}/>;
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

function AddPeoplePage({user, setSplitPage, groupPicklistContent, currentGroup, setCurrentGroup}) {

    
    const [searchString, setSearchString] = useState("");               // Contents of search box
    const [friends, setFriends] = useState(null);                       // List of user's friends (stored as objects)
    const [friendsLoaded, setFriendsLoaded] = useState(false);          // Whether or not friends have loaded personal information yet
    const [searchExpanded, setSearchExpanded] = useState(false);        // Whether or not search is expanded
    const [nextEnabled, setNextEnabled] = useState(false);              // Whether or not the "next" button is enabled
    const [someoneIsSelected, setSomeoneIsSelected] = useState(false);  // Whether or not anyone is currently selected
    const [groupsExpanded, setGroupsExpanded] = useState(false);        // Whether or not the groups section is expanded
    const [currentGroupUsers, setCurrentGroupUsers] = useState(null);   // All users in currently selected group

    /**
     * @param {Array} friendsList a list of objects representing all of the current user's friends without detailed information on them
     * Get detailed information on each friend in the list.
     * This is done after populating the list with template information in fetchFriends
     */
    async function fetchFriendDetails(friendsList) {
        for (var i = 0; i < friendsList.length; i++) {
            const currentFriend = friendsList[i];
            let displayName = await getDisplayNameById(currentFriend.id);
            currentFriend.displayName = displayName;
            let url = await getPhotoUrlById(currentFriend.id);
            currentFriend.pfpUrl = url;
            friendsList[i] = currentFriend;
        }
        setFriends(sortByDisplayName(friendsList));
        setFriendsLoaded(true);
    }

    /**
     * Get a list of user's friends and store their ID's, along with template information
     */
    async function fetchFriends() {
        let friendsFromDB = await getFriendsById(user.uid);
        var userFriends = [];
        for (const friend of friendsFromDB) {
            userFriends.push({id: friend, displayName: "", pfpUrl: null, selected: false})
        }
        const sortedFriends = sortByDisplayName(userFriends);
        setFriends(sortedFriends);
        fetchFriendDetails(userFriends);
    }

    // Fetch user's friends on component mount
    useEffect(() => {
        fetchFriends();
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
    function toggleSelected(id) {
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
    * Check if the next button should be enabled
    */
    function checkNextEnabled() {
        setNextEnabled(someoneIsSelected || currentGroup.length > 0);
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
        if (friends) {
            if (friendsLoaded) {
                if (searchExpanded) {
                    return friends.map((friend, index) => {
                        if (friend.displayName.toLowerCase().includes(searchString.toLowerCase())) {
                            return (                            
                                <div 
                                    className="friend-container" 
                                    key={index} 
                                    onClick={() => { 
                                        toggleSelected(friend.id);
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
                            )
                        }
                    })
                } else {
                    return friends.slice(0, 5).map((friend, index) => {
                        return (
                            <div 
                               className="friend-container" 
                               key={index} 
                               onClick={() => {
                                    toggleSelected(friend.id);
                               }}
                            >
                                <AvatarToggle 
                                   outlined={friend.selected} 
                                   id={friend.id} 
                                   displayName={friend.displayName}
                               />
                            </div>
                        )
                   })
                }
            } else {
                return (
                    <div className="friend-container">
                        <CircularProgress/>
                    </div>
                )
            }
        }
    }

    /** 
     * Handle next button press, passing on information to next page
     */
    function handleNext() {
        //  TODO implement this method
    }

    /** 
     * Make sure that the search box expanded property is updated whenever 
     * the search value changes, whether or not someone is selected changes,
     * or the selected group changes.
    */
    useEffect(() => {
        setSearchExpanded(someoneIsSelected || searchString.length > 0);
        setGroupsExpanded(currentGroup.length > 0);
        checkNextEnabled();
    }, [someoneIsSelected, searchString, currentGroup])

    /**
     * Fetch current group's users when it changes
     */
    useEffect(() => {
        fetchCurrentGroupUsers();
    }, [currentGroup])

    /**
     * Get current group's users from DB and set local array
     */
    async function fetchCurrentGroupUsers() {
        let users = await getUsersByGroupId(currentGroup);
        setCurrentGroupUsers(users);
    }

    /**
     * Show a little list of every user in currently selected group's icon :)
     * @returns {Component} list of user icons
     */
    function populateGroupUserPreview() {
        if (currentGroupUsers && currentGroup.length > 0) {
            return currentGroupUsers.map((user, index) => {
                return (
                    <AvatarIcon id={user}/>
                )
            })
        }
    }

    return (
        <div className="split-type-page">
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
            <div className={"friend-preview " + (searchExpanded ? "expanded" : "") + (groupsExpanded ? "hidden" : "")}>
                <div className="avatar-container">
                    <div className="scroller">
                        { populateFriendScroller() }
                    </div>
                </div>
            </div>
            <div className={"group-select " + (searchExpanded ? "hidden " : "") + (groupsExpanded ? "expanded" : "")}>
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
