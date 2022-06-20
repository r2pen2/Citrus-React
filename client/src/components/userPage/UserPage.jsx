// Style imports
import "./userPage.scss";

// Library imports
import { Route, Routes } from "react-router-dom";

// Component imports
import Settings from "./settings/Settings";

export default function UserPage() {

    // Get user from LocalStorage
    const currentUser = JSON.parse(localStorage.getItem("user"));
    
    // If we have no user, redirect to login
    // Otherwise, set document title with context.
    if (!currentUser) {
        window.location = "/login";
    } else {
        document.title = "Cirtus | " + currentUser.firstName;
    }

    return (
        <Routes>
            <Route path="/" element={<div data-testid="user-profile">User Profile</div>}/>
            <Route path="/settings" element={<Settings user={currentUser} />}/>
        </Routes>
    )
}
