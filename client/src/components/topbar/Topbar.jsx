import "./topbar.scss"
import { AppBar, Toolbar, IconButton, Typography, Stack, Tooltip, Avatar } from "@mui/material"
import profilePic from "../../assets/images/pfp/testProfilePic.png"
import logo from "../../assets/images/LogoBlack.png"

import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from "@mui/icons-material/Notifications"

export default function Topbar( { user }) {

    function checkForUser() {
        return user ? true : false;
    }
    const signedIn = checkForUser();

    function logOut() {
        localStorage.removeItem('user');
        window.location = "/dashboard"
    }

    if (signedIn) {
        const fullName = user.firstName + " " + user.lastName
        return (
            <AppBar position="static" className="appbar">
            <Toolbar>
                <IconButton size="large" edge="start" color="inherit" aria-label="logo">
                    <img src={logo} alt="logo" style={{width: "40px"}}></img>
                </IconButton>
                <Typography variant="h4" component="div" fontFamily="FredokaOne" sx={{ flexGrow: 1 }}>
                    Citrus
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" display="flex">
                    <Typography variant="subtitle1" component="div" marginTop="4px">{fullName}</Typography>
                    <Tooltip title={fullName}>
                        <Avatar alt={fullName} src={profilePic} sx={{ border: "1px solid black"}}/>
                    </Tooltip>
                    <Tooltip title="Notifications">
                        <IconButton size="medium" edge="start" color="inherit" aria-label="notifications-icon">
                            <NotificationsIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Log-Out">
                        <IconButton size="medium" color="inherit" aria-label="logout-icon" onClick={() => logOut()}><LogoutIcon/></IconButton>
                    </Tooltip>
                </Stack>
            </Toolbar>
        </AppBar>
        )
    } else {
        return (
        <AppBar position="static" className="appbar">
            <div className="topbar-logo-container">
                <Toolbar>
                        <IconButton size="large" edge="start" color="inherit" aria-label="logo">
                            <img src={logo} alt="logo" style={{width: "40px"}}></img>
                        </IconButton>
                        <Typography variant="h4" component="div" fontFamily="FredokaOne" sx={{ flexGrow: 1 }}>
                            Citrus
                        </Typography>
                </Toolbar>
            </div>
        </AppBar>    
        )
    }
}
