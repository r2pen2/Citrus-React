import "./navbar.scss"
import { AppBar, Toolbar, IconButton, Typography, Stack, Tooltip, Avatar } from "@mui/material"
import profilePic from "../../assets/images/testProfilePic.png"

import Hive from "@mui/icons-material/Hive"
import NotificationsIcon from "@mui/icons-material/Notifications"

export default function Navbar( { name }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton size="large" edge="start" color="inherit" aria-label="logo">
                    <Hive />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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
