// Library Imports
import { Route, Routes } from "react-router-dom";

// Component Imports
import PasswordEntry from "./passwordEntry/PasswordEntry";

export default function Authentication({ setUser }) {
  
    // Redirect to login if we're here too early
    if (!localStorage.getItem('login:phone_number')) {
        window.location = "/login";
    }

    return (
        <div className="authentication" data-testid="authentication-wrapper">
            <Routes>
                <Route path="/password-entry" element={<PasswordEntry setUser={setUser}/>}/>
            </Routes>
        </div>
    )
}
