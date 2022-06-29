// Style imports
import "./newtransaction.scss";

// Library imports
import { Route, Routes } from "react-router-dom";

// Component imports
import GroupOrOneTimeBox from "./groupOrOneTime/GroupOrOneTime";
import BookmarkController from "./bookmarkController/BookmarkController";
// import Transactions from "./transactions/Transactions";
// import Analytics from "./analytics/Analytics";

export default function NewTransaction({ user }) {
  return (
    <Routes>
      <Route path="/" element={<Diagnostics />} />
      <Route path="/diagnostics" element={<Diagnostics />} />
      <Route path="/iou" element={<Iou />} />
      <Route path="/communal" element={<Communal />} />
      <Route path="/bookmarks/*" element={<BookmarkController />} />
    </Routes>
  );
}
