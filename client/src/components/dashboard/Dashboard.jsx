// Style imports
import "./dashboard.scss";

// Library imports
import { Route, Routes } from "react-router-dom";

// Component imports
import BottomNav from "./bottomNav/BottomNav";
import Home from "./home/Home";
import NewTransaction from "./newTransaction/NewTransaction";

/**
 * Removes unnecessary localStorage registers
 */
function cleanLs() {
  localStorage.removeItem("login:phone_number");
  localStorage.removeItem("login:user_id");
  localStorage.removeItem("login:first_name");
}

/**
 * If we're not signed in, redirect to login.
 * Othwerwise, set the document title and continue to dashboard.
 * @param {Object} user The current user (if it exists)
 */
function doPageSetup(user) {
  cleanLs();
  if (!user) {
    window.location = "/login";
  }
  document.title = "Citrus | Dashboard";
}

export default function Dashboard({ user }) {
  // Set up page
  doPageSetup(user);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/home" element={<Home user={user} />} />
        <Route
          path="/new-transaction/*"
          element={<NewTransaction user={user} />}
        />
      </Routes>
      <BottomNav user={user} />
    </div>
  );
}
