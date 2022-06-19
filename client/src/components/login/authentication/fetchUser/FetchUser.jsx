// Style imports
import "./fetchuser.scss";

// Library imports
import { Typography, CircularProgress} from '@mui/material/';

// API imports
import axios from '../../../../api/axios';

export default function FetchUser() {
    
    // Set phone number from localStorage
    const phoneNumber = localStorage.getItem('login:phone_number');

    // Redirect to login if we don't have a phone number stored
    if (!phoneNumber) {
        window.location = "/login";
    } else {
        // Get user from DB
        axios.post("database/get-user-id-by-number", { phoneNumber: phoneNumber }).then((res) => {
            if (res.status === 200) {
                localStorage.setItem('login:user_id', JSON.stringify(res.data.id));
                localStorage.setItem('login:first_name', JSON.stringify(res.data.firstName));
                if (localStorage.getItem('login:user_id') === 'undefined') {
                    window.location = "/login/account-creation";
                }
                window.location = "/login/authentication/password-entry";
            } else {
                console.log(res.status);
            }
        });
    }

  return (
    <div className="fetching-container" data-testid="fetch-container">
        <Typography variant="h5" component="div" align="center" sx={{ flexGrow: 1 }} data-testid="fetch-text">
          Fetching user data...
        </Typography>
        <CircularProgress color="inherit" margintop="60px" data-testid="fetch-spinner"/>
    </div>
  )
}
