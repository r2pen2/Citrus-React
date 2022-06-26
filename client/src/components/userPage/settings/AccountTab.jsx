// Style imports
import "./accountTab.scss";

// Library imports
import { Typography, TextField, Avatar, Button, IconButton } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

/**
 * Get a user's initials by first and last name
 * @param {String} f first name
 * @param {String} l last name
 * @returns {String} initials
 */
 function getInitials(f, l) {
    return f.charAt(0) + l.charAt(0);
}

export default function AccountTab({ user }) {
  return (
    <div className="account-content" data-testid="account-content">
        <Typography variant="h5" className="page-title">
            Account Settings ❯
        </Typography>
        <div className="avatar-container">
            <div className="col"></div>
            <IconButton className="col avatar-button" aria-label="account of current user" data-testid="settings-avatar">
                <Avatar className="avatar" alt={user.fullName} size="large">{getInitials(user.firstName, user.lastName)}</Avatar>
            </IconButton>
            <div className="col edit-pfp">
                <Button className="upload-button" variant="outlined" color="primary">
                    <CloudUploadIcon/>
                </Button>
            </div>
        </div>
        <div className="fields-container">
            <div className="field two-fields">
                <div className="left">
                    <TextField id="first-name" label="First Name" data-testid="first-name-input" value={user.firstName}/>
                </div>
                <div className="right">
                    <TextField id="last-name" label="Last Name" data-testid="last-name-input" value={user.lastName}/>
                </div>
            </div>
            <div className="field long-field">
                <TextField id="phone-number" label="Phone Number" data-testid="phone-number-input" value={user.phoneNumber}/>
            </div>
            <div className="field long-field">
                <TextField id="address" label="Address" data-testid="address-input"/>
            </div>
            <div className="field two-fields">
                <div className="left">
                    <TextField id="city" label="City" data-testid="city-input"/>
                </div>
                <div className="right">
                    <TextField id="state" label="State" data-testid="state-input"/>
                </div>
            </div>
            <div className="field two-fields">
                <div className="left">
                    <TextField id="zip-code" label="Zip Code" data-testid="zip-code-input"/>
                </div>
                <div className="right">
                    <TextField id="country" label="Country" data-testid="country-input"/>
                </div>
            </div>
            <div className="field long-field">
                <TextField id="password" label="Password" data-testid="password-input" type="password"/>
            </div>
            <div className="save-button">
                <Button type="submit-button" variant="contained">Save</Button>
            </div>
        </div>
    </div>
  )
}
