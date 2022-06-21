// Style imports
import "./bottomNav.scss"

// Library imports
import { useState } from 'react';
import { AppBar, BottomNavigation, BottomNavigationAction } from "@mui/material"
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import GroupsIcon from '@mui/icons-material/Groups';

export default function BottomNav({ user }) {

  // Display only if we have a current user
  const active = user ? true : false;

  // Define constants
  const [value, setValue] = useState(getValueFromWindowLocation()); // Which element on the bottom is highlighted

  function getValueFromWindowLocation() {
    const location = window.location.toString();
    const lastSlash = location.lastIndexOf('/');
    const afterSlash = location.substring(lastSlash + 1);
    return afterSlash;
  }

  /**
   * Sets active bottomnav element to the one that was just clicked 
   * @param {Event} event the event that triggered this function call
   * @param {String} newValue the value of the new active element
   */
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Only display if there's a user logged in
  if (active) {
    return(
      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }} data-testid="bottomnav">
        <BottomNavigation sx={{ widthi: '100%' }} value={value} onChange={handleChange}>
          <BottomNavigationAction
            label="Home"
            value="home"
            href="/dashboard/home"
            icon={<HomeIcon fontSize="large" sx={{ color: "#F2DF56" }}/>}
          />
          <BottomNavigationAction
            label="New Transaction"
            value="new-transaction"
            href="/dashboard/new-transaction"
            icon={<AddBoxIcon fontSize="large" sx={{ color: "#B0C856" }}/>}
          />
          <BottomNavigationAction
            label="Groups"
            value="groups"
            href="/dashboard/groups"
            icon={<GroupsIcon fontSize="large" sx={{ color: "#FDB90F" }}/>}
          />
        </BottomNavigation>
      </AppBar>
    )
  }
}

