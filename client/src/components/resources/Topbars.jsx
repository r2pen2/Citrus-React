// Style imports
import "./style/topbar.scss";

// Library imports
import { useState, useEffect } from "react";
import {
  Stack,
  Tooltip,
  Avatar,
  MenuItem,
  Menu,
  AppBar,
  Toolbar,
  IconButton,
  Typography
} from "@mui/material";

// Component Imports
import LogoBlack from "../../assets/images/LogoBlack.png";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BookmarksIcon from "@mui/icons-material/Bookmarks";

// API Imports
import { DBManager } from "../../api/db/dbManager";
import { SessionManager } from "../../api/sessionManager";
import { RouteManager } from "../../api/routeManager";

/**
 * Topbar when there's no user signed in (or whenever else you may want to display a topbar with no user information)
 */
export function MinimalTopbar() {
  return (<div className="topbar" data-testid="topbar-wrapper">
  <div className="appbar-container" data-testid="no-user-topbar">
    <AppBar className="appbar">
      <div className="topbar-logo-container">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="logo"
            href="/home"
          >
            <img
              src={LogoBlack}
              alt="logo"
              style={{ width: "40px" }}
            ></img>
          </IconButton>
          <Typography
            variant="h4"
            component="a"
            href="/home"
            fontFamily="FredokaOne"
            sx={{ flexGrow: 1 }}
          >
            Citrus
          </Typography>
        </Toolbar>
      </div>
    </AppBar>
  </div>
</div>
  )
}

export function UserTopbar({user}) {

  // We're logged in, so create a UserManager
  const userManager = user ? DBManager.getUserManager(user.uid) : null;
  
  // Get as much data from SessionManager as possible
  const [userDisplayName, setUserDisplayName] = useState(SessionManager.getDisplayName());
  const [userPhotoUrl, setUserPhotoUrl] = useState(SessionManager.getPfpUrl());
  const [initials, setInitials] = useState("");
  
  // AnchorElement for user account menu
  const [anchorElement, setAnchorElement] = useState(null);
  // Element to anchor account menu to
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


  useEffect(() => {
    // Fetch user details on mount
    async function fetchUserData() {
      let name = await userManager.getDisplayName();
      setUserDisplayName(name);
      let url = await userManager.getPhotoUrl();
      setUserPhotoUrl(url);
      let userInitials = await userManager.getInitials();
      setInitials(userInitials);
      SessionManager.setPfpUrl(url);
      SessionManager.setDisplayName(name);
    }
    fetchUserData();
  }, [userManager]);

  /**
   * Close user account menu and send the user to anotehr page
   * @param {string} redirectLocation where to redirect user
   */
  function closeMenuAndRedirect(redirectLocation) {
    handleClose();
    RouteManager.redirect(redirectLocation);
  }

  return (
    <div className="topbar" data-testid="topbar-wrapper">
      <div className="appbar-container" data-testid="user-topbar">
        <AppBar className="appbar">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="logo"
              href="/home"
            >
              <img src={LogoBlack} alt="logo" style={{ width: "40px" }}></img>
            </IconButton>
            <Typography
              variant="h4"
              component="a"
              href="/home"
              fontFamily="FredokaOne"
              sx={{ flexGrow: 1 }}
            >
              Citrus
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
              display="flex"
            >
              <Typography variant="subtitle1" component="div" marginTop="4px">
                {userDisplayName}
              </Typography>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(e) => handleMenu(e)}
                color="inherit"
                data-testid="account-button"
              >
                <Avatar
                  src={userPhotoUrl}
                  alt={userDisplayName}
                  sx={{ border: "1px solid black" }}
                  imgProps={{referrerPolicy: "no-referrer" }}
                >
                  {initials}
                </Avatar>
              </IconButton>
              <Menu
                data-testid="account-menu"
                id="menu-appbar"
                anchorEl={anchorElement}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                open={open}
                onClose={() => handleClose()}
              >
                <MenuItem onClick={() => closeMenuAndRedirect("/user")}>
                  My Profile
                </MenuItem>
                <MenuItem onClick={() => closeMenuAndRedirect("/user/settings")}>
                  Settings
                </MenuItem>
              </Menu>
              <Tooltip title="Notifications">
                <IconButton
                  size="medium"
                  edge="start"
                  color="inherit"
                  aria-label="notifications-icon"
                  href="#notifications"
                >
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Bookmarks">
                <IconButton
                  size="medium"
                  edge="start"
                  color="inherit"
                  aria-label="bookmarks-icon"
                  href="/dashboard/bookmarks"
                >
                  <BookmarksIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Log-Out">
                <IconButton
                  size="medium"
                  color="inherit"
                  aria-label="logout-icon"
                  onClick={() => SessionManager.signOut()}
                  data-testid="topbar-logout-button"
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Toolbar>
        </AppBar>
      </div>
    </div>
  )
}
