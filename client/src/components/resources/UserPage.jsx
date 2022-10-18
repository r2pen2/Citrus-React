// Library imports
import { Typography, TextField, Avatar, Button, IconButton } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState, useEffect } from 'react'

// API imports
import { SessionManager } from "../../api/sessionManager";

// Create UserManager
const userManager = SessionManager.getCurrentUserManager();

/**
 * Settings page account tab
 */
export function AccountTab() {

    const [userDisplayName, setUserDisplayName] = useState(SessionManager.getDisplayName());
    const [userPhotoUrl, setUserPhotoUrl] = useState(SessionManager.getPfpUrl());
    const [userPhoneNumber, setUserPhoneNumber] = useState(SessionManager.getPhoneNumber());
    const [userInitials, setUserInitials] = useState("");

    // Fetch user details on mount
    useEffect(() => {
         /**
        * Get user details from DB and replace blank values
        */
        async function fetchUserDetails() {
            const name = await userManager.getDisplayName();
            setUserDisplayName(name);
            const number = await userManager.getPhoneNumber();
            setUserPhoneNumber(number);
            const photo = await userManager.getPhotoUrl();
            setUserPhotoUrl(photo);
            const initials = await userManager.getInitials();
            setUserInitials(initials);
        }

        fetchUserDetails();
    }, [userManager])

    return (
    <div className="account-content" data-testid="account-content">
        <Typography variant="h5" className="page-title">
            Account Settings ❯
        </Typography>
        <div className="avatar-container">
            <div className="col"></div>
            <IconButton className="col avatar-button" aria-label="account of current user" data-testid="settings-avatar">
                <Avatar src={userPhotoUrl} className="avatar" alt={userDisplayName ? userDisplayName : ""} size="large">
                    <Typography variant="h3">
                        {userInitials}
                    </Typography>
                </Avatar>
            </IconButton>
            <div className="col edit-pfp">
                <Button className="upload-button" variant="outlined" color="primary">
                    <CloudUploadIcon/>
                </Button>
            </div>
        </div>
        <div className="fields-container">
            <div className="field long-field">
                <TextField id="display-name" label="Display Name" data-testid="display-name-input" value={userDisplayName ? userDisplayName : ""}/>
            </div>
            <div className="field long-field">
                <TextField id="phone-number" label="Phone Number" data-testid="phone-number-input" value={userPhoneNumber ? userPhoneNumber : ""}/>
            </div>
            <div className="field long-field">
                <TextField id="address" label="Address" data-testid="address-input" value="1600 Pennsylvania Avenue NW"/>
            </div>
            <div className="field two-fields">
                <div className="left">
                    <TextField id="city" label="City" data-testid="city-input" value="Washington, DC"/>
                </div>
                <div className="right">
                    <TextField id="state" label="State" data-testid="state-input" value="District of Columbia"/>
                </div>
            </div>
            <div className="field two-fields">
                <div className="left">
                    <TextField id="zip-code" label="Zip Code" data-testid="zip-code-input" value="20500"/>
                </div>
                <div className="right">
                    <TextField id="country" label="Country" data-testid="country-input" value="United States"/>
                </div>
            </div>
            <div className="save-button">
                <Button type="submit-button" variant="contained">Save</Button>
            </div>
        </div>
    </div>
  )
}
