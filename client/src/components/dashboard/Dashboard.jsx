// Style imports
import "./dashboard.scss";

// Library imports
import { Backdrop } from "@mui/material"
import { Route, Routes } from "react-router-dom";
import { useState } from 'react'

// Component imports
import BottomNav from "./bottomNav/BottomNav";
import Home from "./home/Home";
import NewTransaction from "./newTransaction/NewTransaction";
import Shortcut from "./shortcut/Shortcut";

/**
 * If we're not signed in, redirect to login.
 * Othwerwise, set the document title and continue to dashboard.
 * @param {Object} user The current user (if it exists)
 */
function doPageSetup(user) {
  if (!user) {
    window.location = "/login";
  }
  document.title = "Citrus | Dashboard";
}

export default function Dashboard({ user }) {
  // Set up page
  console.log(user)
  doPageSetup(user);

  const [shortcutActive, setShortcutActive] = useState(false);        // Whether or not new transaction shortcut is active
  const [bookmarksDeployed, setBookmarksDeployed] = useState(false);  // Whether or not bookmarks are displayed in shortcut

  /**
   * Close shortcut on mouseup
   * @param {Event} event mouseEvent that triggered this function
   */
   function closeShortcut(event) {
    if (event.type === "mouseup") {
      setShortcutActive(false);
      setBookmarksDeployed(false);
    }
  }

  /**
   * Render shortcut page when active
   * @returns {Component} shortcut page
   */
  function renderShortcut() {
    // Don't render shortcut on the new transaction page
    const location = window.location.toString();
    const lastSlash = location.lastIndexOf('/');
    const afterSlash = location.substring(lastSlash + 1);
    if (afterSlash === "new-transaction") { 
      return; 
    } else {
      return (
        <Backdrop
          sx={{ color: '#fff', zIndex: 2 }}
          open={shortcutActive}
          onClick={() => {setShortcutActive(false);}}
          onMouseUp={(e) => closeShortcut(e)}
        >
          <Shortcut bookmarksDeployed={bookmarksDeployed} setBookmarksDeployed={setBookmarksDeployed}/>
        </Backdrop>
      ) 
    }
  }
  
  return (
    <div>
      {renderShortcut()}
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/home" element={<Home user={user} />} />
        <Route
          path="/new-transaction/*"
          element={<NewTransaction user={user} />}
        />
      </Routes>
      <BottomNav user={user} setShortcutActive={setShortcutActive} setBookmarksDeployed={setBookmarksDeployed} />
    </div>
  );
}
