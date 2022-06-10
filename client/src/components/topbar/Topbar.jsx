import "./topbar.scss"
import { AppBar, Toolbar, IconButton, Typography, Stack, Tooltip, Avatar } from "@mui/material"
import profilePic from "../../assets/images/pfp/testProfilePic.png"
import logo from "../../assets/images/LogoBlack.png"

import NotificationsIcon from "@mui/icons-material/Notifications"

export default function Topbar( { user }) {

    

    console.log(user)

    if (user) {
        const fullName = user.firstName + " " + user.lastName
        return (
            <AppBar position="static">
            <Toolbar alignItems="center">
                <IconButton size="large" edge="start" color="inherit" aria-label="logo">
                    <img src={logo} alt="logo" style={{width: "40px"}}></img>
                </IconButton>
                <Typography variant="h4" component="div" fontFamily="FredokaOne" sx={{ flexGrow: 1 }}>
                    Citrus
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Tooltip title={fullName}>
                        <Avatar alt={fullName} src={profilePic} />
                    </Tooltip>
                    <Tooltip title="Notifications">
                        <IconButton size="medium" edge="start" color="inherit" aria-label="notifications-icon">
                            <NotificationsIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Toolbar>
        </AppBar>
        )
    } else {
        return (
        <AppBar position="static" >
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
