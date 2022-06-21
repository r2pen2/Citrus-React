// Style imports
import "./newtransaction.scss";

// Library imports
import { Route, Routes } from "react-router-dom";

// Component imports
import GroupOrOneTimeBox from "./groupOrOneTime/GroupOrOneTime";
// import Transactions from "./transactions/Transactions";
// import Analytics from "./analytics/Analytics";

export default function NewTransaction({ user }) {
  return (
    <Routes>
      <Route path="/" element={<GroupOrOneTimeBox />} />
      <Route path="/group-or-one-time" element={<GroupOrOneTimeBox />} />
      {/* <Route pate="/transaction-or-iou" element={<TransactionOrIouBox />} /> */}
    </Routes>
  );
}
