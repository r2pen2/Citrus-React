// Style imports
import "./accountTab.scss";

// Library imports
import { Typography, Badge, TextField, Avatar, Button, IconButton } from "@mui/material";
import EditRoundedIcon from '@mui/icons-material/EditRounded';

// Component imports
import profilePic from "../../../assets/images/pfp/testProfilePic.png"

export default function AccountTab({ user }) {
  return (
    <div className="account-content" data-testid="account-content">
        <Typography variant="h5">
            Account Settings
        </Typography>
        <div className="avatar-container">
            <IconButton aria-label="account of current user" data-testid="settings-avatar">
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={<EditRoundedIcon/>}
                    color="secondary">
                    <Avatar className="avatar" alt={user.fullName} src={profilePic} size="large"/>
                </Badge>
            </IconButton>
        </div>
        <div className="fields-container">
            <div className="field two-fields">
                <div className="left">
                    <TextField id="first-name" label="First Name" data-testid="first-name-input"/>
                </div>
                <div className="right">
                    <TextField id="last-name" label="Last Name" data-testid="last-name-input"/>
                </div>
            </div>
            <div className="field long-field">
                <TextField id="phone-number" label="Phone Number" data-testid="phone-number-input"/>
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
