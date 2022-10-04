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
import Groups from "./groups/Groups";
import Owe from "./owe/Owe";
import AllTransactions from "./allTransactions/AllTransactions";
import Analytics from "./analytics/Analytics";
import Bookmarks from "./bookmarks/Bookmarks";
import Transaction from "./transaction/Transaction";

// API imports
import { SessionManager } from "../../api/sessionManager";
import { RouteManager } from "../../api/routeManager";

export default function Dashboard() {

  RouteManager.setTitleOrRedirectToLogin("Dashboard");

  // Get user from session
  const user = SessionManager.getUser();

  const [shortcutActive, setShortcutActive] = useState(false);        // Whether or not new transaction shortcut is active
  const [bookmarksDeployed, setBookmarksDeployed] = useState(false);  // Whether or not bookmarks are displayed in shortcut
  const [activeTab, setActiveTab] = useState("home");                 // Active tab for content selection

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

  function renderTab() {
    switch(activeTab) {
      case "home":
        return <Home user={user} setActiveTab={setActiveTab}/>;
      case "new-transaction":
        return <NewTransaction user={user} />;
      case "groups":
        return <Groups user={user} />;
      case "owe":
        return <Owe user={user} />;
      case "transactions":
        return <AllTransactions user={user} />;
      case "analytics":
        return <Analytics user={user} />;
      default:
        return <Home user={user} />;
    }
  }
  
  return (
    <div className="dashboard">
      {renderShortcut()}
      <div className="dashboard-pane">
        <Routes>
          <Route path="/" element={ renderTab() }/>
          <Route path="/home" element={ renderTab() }/>
          <Route path="/transaction" element={<Transaction user={user} />}/>
          <Route path="/bookmarks" element={<Bookmarks user={user} />}/>
        </Routes>
      </div>
      <BottomNav user={user} setShortcutActive={setShortcutActive} setBookmarksDeployed={setBookmarksDeployed} setActiveTab={setActiveTab}/>
    </div>
  );
}
