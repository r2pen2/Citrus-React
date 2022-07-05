// Style imports
import "./topbar.scss";

// Library imports
import { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Stack, Tooltip, Avatar, MenuItem, Menu } from "@mui/material";

// Component Imports
import BlackLogo from "./assets/LogoBlack.png";
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from "@mui/icons-material/Notifications";
import BookmarksIcon from '@mui/icons-material/Bookmarks';

// API Imports
import { signOutUser } from '../../api/firebase'
import { getDisplayNameById, getPhotoUrlById } from "../../api/dbManager"


/**
 * Gets a user's profile picture url
 * @param {Object} user current user 
 * @returns {String} Url to user's profile picture
 */
function getPfp(user) {
    return user.photoURL ? user.photoURL : "";
}

export default function Topbar() {
    
    const user = JSON.parse(localStorage.getItem("citrus:user"));
    const [userDisplayName, setUserDisplayName] = useState("");
    const [userPhotoUrl, setUserPhotoUrl] = useState("");
 
    /**
     * Replace blank values with user details from DB
     */
    async function fetchUserData() {
        let name = await getDisplayNameById(user.uid);
        setUserDisplayName(name);
        let url = await getPhotoUrlById(user.uid);
        setUserPhotoUrl(url);
    }

    // Fetch user details on mount
    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [])

    /**
     * Checks whether a user is completely signed in based on whether or not they have a display name
     * @returns {Boolean} whether or not the user has completed signin process
     */
    function getSignedIn() {
        if (user) {
            if (user.displayName === null) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    // Check if the user is signed in
    const signedIn = getSignedIn();

    /**
     * Log user out and redirect to homepage
     */
    async function logOut() {        
        signOutUser().then(() => {
        window.location = "/home";
      });
    }

    // Element to anchor account menu to
    const [anchorElement, setAnchorElement] = useState(null);
    const open = Boolean(anchorElement); // Menu will be open if we've set an anchor element

    /**
     * Sets anchor element to the clicked element
     * @param {React.MouseEvent<HTMLElement>} event mouse click event
     */
    function handleMenu(event) {
        setAnchorElement(event.currentTarget);
    }

    /**
     * Set anchor element to null on menu close
     */
    function handleClose() {
        setAnchorElement(null);
    }

    /**
     * Redirect user and close account menu
     * @param {Strings} destination new url
     */
    function redirect(destination) {
        handleClose();
        window.location = destination;
    }

    /**
     * Get a user's initials by first and last name
     * @param {String} f first name
     * @param {String} l last name
     * @returns {String} initials
     */
    function getInitials() {
        if (user) {
            return userDisplayName.charAt(0);
        } else {
            // If we don't have a display name, they need to complete their profile!
            if (!window.location.toString().includes("login")) {
                window.location = "/login/account-creation"
            }
        }
    }

    // Choose which topbar to display— signedIn is displays user information
    if (signedIn) {
        // Signed in, so set user vars and return detail topbar
        return (
            <div className="topbar" data-testid="topbar-wrapper">
                <div className="appbar-container" data-testid="user-topbar">
                    <AppBar className="appbar">
                        <Toolbar>
                            <IconButton size="large" edge="start" color="inherit" aria-label="logo" href="/home">
                                <img src={BlackLogo} alt="logo" style={{width: "40px"}}></img>
                            </IconButton>
                            <Typography variant="h4" component="a" href="/home" fontFamily="FredokaOne" sx={{ flexGrow: 1 }}>
                                Citrus
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" display="flex">
                                <Typography variant="subtitle1" component="div" marginTop="4px">
                                    {userDisplayName}
                                </Typography>
                                <IconButton aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={(e) => handleMenu(e)} color="inherit" data-testid="account-button">
                                    <Avatar src={userPhotoUrl} alt={userDisplayName} sx={{ border: "1px solid black"}}>{getInitials()}</Avatar>
                                </IconButton>
                                <Menu 
                                data-testid="account-menu"
                                id="menu-appbar" 
                                anchorEl={anchorElement}
                                anchorOrigin={ 
                                    { 
                                        vertical: "bottom", 
                                        horizontal: "left"
                                    }
                                }
                                keepMounted
                                transformOrigin={
                                    {
                                        vertical: "bottom",
                                        horizontal: "left"
                                    }
                                }
                                open={open}
                                onClose={() => handleClose()}
                                >
                                    <MenuItem onClick={() => redirect("/user")}>
                                        My Profile
                                    </MenuItem>
                                    <MenuItem onClick={() => redirect("/user/settings")}>
                                        Settings
                                    </MenuItem>
                                </Menu>
                                <Tooltip title="Notifications">
                                    <IconButton size="medium" edge="start" color="inherit" aria-label="notifications-icon" href='#notifications'>
                                        <NotificationsIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Bookmarks">
                                    <IconButton size='medium' edge="start" color="inherit" aria-label="bookmarks-icon" href="#bookmarks">
                                        <BookmarksIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Log-Out">
                                    <IconButton size="medium" color="inherit" aria-label="logout-icon" onClick={() => logOut()} data-testid="topbar-logout-button">
                                        <LogoutIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Toolbar>
                    </AppBar>
                </div>
            </div>
        )
    } else {
        // We're not signed in, so make the minimal topbar
        return (
            <div className="topbar" data-testid="topbar-wrapper">
                <div className="appbar-container" data-testid="no-user-topbar">
                    <AppBar className="appbar">
                        <div className="topbar-logo-container">
                            <Toolbar>
                                <IconButton size="large" edge="start" color="inherit" aria-label="logo" href="/home">
                                    <img src={BlackLogo} alt="logo" style={{width: "40px"}}></img>
                                </IconButton>
                                <Typography variant="h4" component="a" href="/home" fontFamily="FredokaOne" sx={{ flexGrow: 1 }}>
                                    Citrus
                                </Typography>
                            </Toolbar>
                        </div>
                    </AppBar>   
                </div> 
            </div>
        )
    }
}
