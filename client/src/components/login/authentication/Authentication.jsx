// Library Imports
import { Route, Routes } from "react-router-dom";

// Component Imports
import AuthCodeInput from "./authCodeInput/AuthCodeInput";
import FetchUser from "./fetchUser/FetchUser";
import PasswordEntry from "./passwordEntry/PasswordEntry";

export default function Authentication({ setUserById }) {
  
    // Redirect to login if we're here too early
    if (!localStorage.getItem('login:phone_number')) {
        window.location = "/login";
    }
  
    return (
        <div className="authentication" data-testid="authentication-wrapper">
            <Routes>
                <Route path="/" element={<AuthCodeInput />} />
                <Route path="/check-auth" element={<AuthCodeInput />} />
                <Route path="/fetch-user" element={<FetchUser />} />
                <Route path="/password-entry" element={<PasswordEntry setUserById={setUserById}/>}/>
            </Routes>
        </div>
    )
}
