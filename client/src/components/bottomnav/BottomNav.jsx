import { useState, useEffect } from 'react';
import { AppBar, BottomNavigation, BottomNavigationAction } from "@mui/material"
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import GroupsIcon from '@mui/icons-material/Groups';

export default function BottomNav({ user }) {

  function checkForUser() {
    return user ? true : false;
  }
  const active = checkForUser();

  const [value, setValue] = useState('home');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (active) {
    return(
      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
      <BottomNavigation sx={{ widthi: '100%' }} value={value} onChange={handleChange}>
        <BottomNavigationAction
          label="Home"
          value="home"
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

