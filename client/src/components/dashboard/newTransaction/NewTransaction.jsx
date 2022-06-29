// Style imports
import "./newtransaction.scss";

// Library imports
import { Route, Routes } from "react-router-dom";

// Component imports
import Diagnostics from "./diagnostics/Diagnostics";
import Iou from "./iou/Iou";
import Communal from "./communal/Communal";
import BookmarkController from "./bookmarkController/BookmarkController";

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
