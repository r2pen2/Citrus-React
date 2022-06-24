// Style imports
import "./newtransaction.scss";

// Library imports
import { Route, Routes } from "react-router-dom";

// Component imports
import Diagnostics from "./diagnostics/Diagnostics";
import Iou from "./iou";
import Communal from "./communal";

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
  );
}
