// Library Imports
import { Route, Routes } from "react-router-dom";

// Component Imports
import PasswordEntry from "./passwordEntry/PasswordEntry";

export default function Authentication({ user, setUser }) {
    return (
        <div className="authentication" data-testid="authentication-wrapper">
            <Routes>
                <Route path="/password-entry" element={<PasswordEntry user={user} setUser={setUser}/>}/>
            </Routes>
        </div>
    )
}
