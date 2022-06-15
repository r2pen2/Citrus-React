// Style imports
import "./bottomnav.scss"

// Library imports
import { useState, useEffect } from 'react';
import { AppBar, BottomNavigation, BottomNavigationAction } from "@mui/material"
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import GroupsIcon from '@mui/icons-material/Groups';

export default function BottomNav({ user }) {

  // Display only if we have a current user
  const active = user ? true : false;

  // Define constants
  const [value, setValue] = useState('dashboard'); // Which element on the bottom is highlighted

  /**
   * Sets active bottomnav element to the one that was just clicked 
   * @param {Event} event the event that triggered this function call
   * @param {String} newValue the value of the new active element
   * @returns {State} the active bottomnav element will have updated
   */
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Only display if there's a user logged in
  if (active) {
    return(
      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <BottomNavigation sx={{ widthi: '100%' }} value={value} onChange={handleChange}>
          <BottomNavigationAction
            label="Dashboard"
            value="dashboard"
            icon={<HomeIcon fontSize="large" sx={{ color: "#F2DF56" }}/>}
          />
          <BottomNavigationAction
            label="New Transaction"
            value="new"
            icon={<AddBoxIcon fontSize="large" sx={{ color: "#B0C856" }}/>}
          />
          <BottomNavigationAction
            label="Groups"
            value="groups"
            icon={<GroupsIcon fontSize="large" sx={{ color: "#FDB90F" }}/>}
          />
        </BottomNavigation>
      </AppBar>
    )
  }
}

