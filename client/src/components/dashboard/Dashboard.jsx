// Style imports
import "./dashboard.scss";

// Library imports
import { Route, Routes } from "react-router-dom";

// Component imports
import BottomNav from "./bottomNav/BottomNav";
import Home from "./home/Home";

/**
 * If we're not signed in, redirect to login.
 * Othwerwise, set the document title and continue to dashboard.
 * @param {Object} user The current user (if it exists)
 * @returns {State} Either a redirect or continues to dashboard
 */
 function doPageSetup(user) {
  if (!user) {
    window.location = "/login";
  }
  document.title = "Citrus | Dashboard";
}

export default function Dashboard({ user }) {

  // Set up page
  doPageSetup(user)

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home user={user} />}/>
        <Route path="/home" element={<Home user={user} />}/>
      </Routes>
      <BottomNav user={user}/>
    </div>
  )
}