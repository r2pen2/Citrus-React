// Style imports
import "./accountTab.scss";

// Library imports
import { Typography, TextField, Avatar, Button, IconButton } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState, useEffect } from 'react'

// API imports
import { getDisplayNameById, getPhoneNumberById, getPhotoUrlById } from "../../../api/dbManager"

/**
 * Get a user's initials by first and last name
 * @param {String} f first name
 * @param {String} l last name
 * @returns {String} initials
 */
 function getInitials(name) {
    return name.charAt(0);
}

export default function AccountTab({ user }) {
  
    const [userDisplayName, setUserDisplayName] = useState("");
    const [userPhoneNumber, setUserPhoneNumber] = useState("");
    const [userPhotoUrl, setUserPhotoUrl] = useState("");

    /**
     * Get user details from DB and replace blank values
     */
    async function fetchUserDetails() {
        let name = await getDisplayNameById(user.uid);
        setUserDisplayName(name);
        let number = await getPhoneNumberById(user.uid);
        setUserPhoneNumber(number);
        let photo = await getPhotoUrlById(user.uid);
        setUserPhotoUrl(photo);
    }

    // Fetch user details on mount
    useEffect(() => {
        fetchUserDetails();
    }, [])

    return (
    <div className="account-content" data-testid="account-content">
        <Typography variant="h5" className="page-title">
            Account Settings ❯
        </Typography>
        <div className="avatar-container">
            <div className="col"></div>
            <IconButton className="col avatar-button" aria-label="account of current user" data-testid="settings-avatar">
                <Avatar src={userPhotoUrl} className="avatar" alt={userDisplayName} size="large">
                    <Typography variant="h3">
                        {getInitials(userDisplayName)}
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
                <TextField id="display-name" label="Display Name" data-testid="display-name-input" value={userDisplayName}/>
            </div>
            <div className="field long-field">
                <TextField id="phone-number" label="Phone Number" data-testid="phone-number-input" value={userPhoneNumber}/>
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
