// Style imports
import "./newtransaction.scss";

// Library imports
import { Route, Routes } from "react-router-dom";

// Component imports
import GroupOrOneTimeBox from "./groupOrOneTime/GroupOrOneTime";
import TransactionOrIouBox from "./transactionOrIou/TransactionOrIou";

export default function NewTransaction({ user }) {
  return (
    <div>
      <Routes>
        <Route path="/" element={<GroupOrOneTimeBox />} />
        <Route path="/group-or-one-time" element={<GroupOrOneTimeBox />} />
        <Route path="/transaction-or-iou" element={<TransactionOrIouBox />} />
      </Routes>
    </div>
  );
}
