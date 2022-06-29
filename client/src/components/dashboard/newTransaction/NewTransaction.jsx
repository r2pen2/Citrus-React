// Style imports
import "./newtransaction.scss";

// Library imports
import { Route, Routes } from "react-router-dom";

// Component imports
<<<<<<< HEAD
import Diagnostics from "./diagnostics/Diagnostics";
import Iou from "./iou/Iou";
import Communal from "./communal/Communal";

export default function NewTransaction({ user }) {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Diagnostics />} />
        <Route path="/diagnostics" element={<Diagnostics />} />
        <Route path="/iou" element={<Iou />} />
        <Route path="/communal" element={<Communal />} />
        {/* <Route path="/group-or-one-time" element={<GroupOrOneTimeBox />} />
        <Route path="/transaction-or-iou" element={<TransactionOrIouBox />} /> */}
      </Routes>
    </div>
=======
import GroupOrOneTimeBox from "./groupOrOneTime/GroupOrOneTime";
import BookmarkController from "./bookmarkController/BookmarkController";
// import Transactions from "./transactions/Transactions";
// import Analytics from "./analytics/Analytics";

export default function NewTransaction({ user }) {
  return (
    <Routes>
      <Route path="/" element={<GroupOrOneTimeBox />} />
      <Route path="/group-or-one-time" element={<GroupOrOneTimeBox />} />
      <Route path="/bookmarks/*" element={<BookmarkController />} />
      {/* <Route pate="/transaction-or-iou" element={<TransactionOrIouBox />} /> */}
    </Routes>
>>>>>>> 1c3f56eec3abc4bb166385ade61d7b7871412fb1
  );
}
