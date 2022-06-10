import "./topbar.scss"
import { AppBar, Toolbar, IconButton, Typography, Stack, Tooltip, Avatar } from "@mui/material"
import profilePic from "../../assets/images/testProfilePic.png"
import logo from "../../assets/images/LogoBlack.png"

import NotificationsIcon from "@mui/icons-material/Notifications"

export default function Topbar( { name }) {
    return (
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="logo">
                        <img src={logo} alt="logo" style={{width: "40px"}}></img>
                    </IconButton>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                        Citrus
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Tooltip title={name}>
                            <Avatar alt={name} src={profilePic} />
                        </Tooltip>
                        <Tooltip title="Notifications">
                            <IconButton size="medium" edge="start" color="inherit" aria-label="notifications-icon">
                                <NotificationsIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Toolbar>
            </AppBar>
      );
}
