// Style imports
import "./userpage.scss";

// Library imports
import { Route, Routes } from "react-router-dom";

export default function UserPage() {
  return (
    <Routes>
        <Route path="/" element={<div>User Profile</div>}/>
        <Route path="/settings" element={<div>User Settings</div>}/>
    </Routes>
  )
}
