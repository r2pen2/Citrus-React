// Style imports
import "./settings.scss"

// Library imports
import { ListItem, Drawer, List, Paper, Divider, ListItemIcon, ListItemText } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import SecurityIcon from '@mui/icons-material/Security';
import LinkIcon from '@mui/icons-material/Link';
import { useState } from 'react';

// Component imports
import AccountTab from './AccountTab.jsx';

export default function Settings({ user }) {

    // Redirect or set document title
    if (!user) {
        window.location = "/login";
    } else {
        document.title = "Citrus | Settings";
    }

    /**
     * Sets hash constant to the hash value or account if none
     * @returns {String} the hash to initialize page with
     */
    function getInitialHash() {
        if (window.location.hash === "") {
            window.location.hash = "#account";
            return window.location.hash;
        } else {
            return window.location.hash;
        }
    }

    const [hash, setHash] = useState(getInitialHash());           // The current window.location.hash (for displaying the correct page)

    /**
     * Set url hash to menu item path
     * @param {String} path href of menu item 
     */
    function handleDrawerClick(path) {
        setHash(path);
        window.location.hash = path;
    }

    /**
     * Checks whether a menu item should be considered active based on the hash
     * @param {String} text text for menu item
     * @returns {Boolean} whether or not the item is "selected"
     */
    function isElementActive(text) {
        const formattedHash = hash.toLowerCase().substring(1);
        const formattedText = text.toLowerCase();
        return formattedHash === formattedText;
    }
    
    function getSettingsPageByHash(currentUser) {
        switch (hash) {
            case "#account":
                return <AccountTab user={currentUser} />;
            case "#appearance":
                return <div>Appearance</div>;
            case "#connections":
                return <div>Connections</div>;
            case "#security":
                return <div>Security</div>;
            default:
                return <div>Account</div>
        }
    }

    // List of menu items to be displayed on left. Easy to add/remove/edit items.
    const menuItems = [
        {
            text: 'Account',
            icon: <AccountCircleIcon color="secondary"/>,
            path: '#account'
        },
        {
            text: 'Appearance',
            icon: <ColorLensIcon color="secondary"/>,
            path: '#appearance'
        },
        {
            text: 'Connections',
            icon: <LinkIcon color="secondary"/>,
            path: '#connections'
        },
        {
            text: 'Security',
            icon: <SecurityIcon color="secondary"/>,
            path: '#security'
        },
        
    ]

    return (
      <div className="user-settings" data-testid="user-settings-wrapper">
        <Paper className="settings-content" data-testid="settings-paper" elevation={12} sx={{ backgroundColor: '#fafafa', borderRadius: "10px"}}>

            
            { /* side drawer */ }
            <Drawer
                className="side-drawer"
                variant="permanent"
                anchor="left"
                classes={{ paper: "drawer-paper" }}
                data-testid="settings-drawer"
            >
                
                { /* list / links */ }
                <List>
                    {menuItems.map(item => (
                    <div>
                        <ListItem 
                            button 
                            key={item.text} 
                            onClick={() => handleDrawerClick(item.path)} 
                            data-testid={"drawer-item-" + item.text} 
                            className={isElementActive(item.text) ? "active" : ""}
                            display="flex"
                        >
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.text} />
                        </ListItem>  
                        <Divider variant="middle" />
                    </div>
                    ))}
                </List>

            </Drawer>

            { /* Then display the right page based on the url */ }
            { getSettingsPageByHash(user) }
        </Paper>
      </div>
    )
}
