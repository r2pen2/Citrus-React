// Style imports
import "./topbar.scss"

// Library imports
import { AppBar, Toolbar, IconButton, Typography, Stack, Tooltip, Avatar } from "@mui/material"
import profilePic from "../../assets/images/pfp/testProfilePic.png"

// Component Imports
import BlackLogo from "./assets/LogoBlack.png"
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from "@mui/icons-material/Notifications"

export default function Topbar( { user }) {

    // Decide if there's a user signed in
    const signedIn = user ? true : false;

    /**
     * Log user out
     * @returns {State} user will be signed out and redirected to homepage
     */
    function logOut() {
        localStorage.removeItem('user');
        window.location = "/home"
    }

    // Choose which topbar to display— signedIn is displays user information
    if (signedIn) {
        // Signed in, so set user vars and return detail topbar
        const fullName = user.firstName + " " + user.lastName
        return (
            <div className="topbar">
                <div className="appbar-container">
                    <AppBar position="static" className="appbar">
                        <Toolbar>
                            <IconButton size="large" edge="start" color="inherit" aria-label="logo" href="/home">
                                <img src={BlackLogo} alt="logo" style={{width: "40px"}}></img>
                            </IconButton>
                            <Typography variant="h4" component="a" href="/home" fontFamily="FredokaOne" sx={{ flexGrow: 1 }}>
                                Citrus
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" display="flex">
                                <Typography variant="subtitle1" component="div" marginTop="4px">
                                    {fullName}
                                </Typography>
                                <Tooltip title={fullName}>
                                    <Avatar alt={fullName} src={profilePic} sx={{ border: "1px solid black"}}/>
                                </Tooltip>
                                <Tooltip title="Notifications">
                                    <IconButton size="medium" edge="start" color="inherit" aria-label="notifications-icon">
                                        <NotificationsIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Log-Out">
                                    <IconButton size="medium" color="inherit" aria-label="logout-icon" onClick={() => logOut()}>
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
            <div className="topbar">
                <div className="appbar-container">
                    <AppBar position="static" className="appbar">
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
