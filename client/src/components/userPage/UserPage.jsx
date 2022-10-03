// Style imports
import "./userPage.scss";

// Library imports
import { Route, Routes } from "react-router-dom";

// Component imports
import Settings from "./settings/Settings";

// API imports
import { SessionManager } from "../../api/sessionManager";
import { RouteManager } from "../../api/routeManager";
import { BrowserManager } from "../../api/browserManager";

export default function UserPage() {
    
    const user = SessionManager.getUser();

    // If we have no user, redirect to login
    // Otherwise, set document title with context.
    if (!user) {
        RouteManager.redirect("/login");
    } else {
        BrowserManager.setTitle(user.firstName)
    }

    return (
        <Routes>
            <Route path="/" element={<div data-testid="user-profile">User Profile</div>}/>
            <Route path="/settings" element={<Settings/>}/>
        </Routes>
    )
}
