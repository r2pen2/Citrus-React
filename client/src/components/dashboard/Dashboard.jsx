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
import Bookmarks from "./routes/Bookmarks";
import Transaction from "./routes/Transaction";

// API imports
import { RouteManager } from "../../api/routeManager";

export default function Dashboard() {

  RouteManager.setTitleOrRedirectToLogin("Dashboard");

  const [shortcutActive, setShortcutActive] = useState(false);        // Whether or not new transaction shortcut is active
  const [bookmarksDeployed, setBookmarksDeployed] = useState(false);  // Whether or not bookmarks are displayed in shortcut
  const [activeTab, setActiveTab] = useState(RouteManager.getHash() ? RouteManager.getHash() : "home");                 // Active tab for content selection

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
        return <Home setActiveTab={setActiveTab}/>;
      case "new-transaction":
        return <NewTransaction />;
      case "groups":
        return <Groups />;
      case "owe":
        return <Owe />;
      case "transactions":
        return <AllTransactions />;
      case "analytics":
        return <Analytics />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  }
  
  return (
    <div className="dashboard">
      {renderShortcut()}
      <div className="dashboard-pane">
        <Routes>
          <Route path="*" element={ renderTab() }/>
          <Route path="/transaction" element={<Transaction />}/>
          <Route path="/bookmarks" element={<Bookmarks />}/>
        </Routes>
      </div>
      <BottomNav activeTab={activeTab} setShortcutActive={setShortcutActive} setBookmarksDeployed={setBookmarksDeployed} setActiveTab={setActiveTab}/>
    </div>
  );
}
