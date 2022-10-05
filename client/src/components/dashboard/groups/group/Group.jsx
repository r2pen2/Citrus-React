import "./group.scss";
import { Routes, Route } from 'react-router-dom';

import GroupDashboard from './groupDashboard/GroupDashboard';
import GroupInvite from "./groupInvite/GroupInvite";
import GroupMembers from "./groupMembers/GroupMembers";

export default function Group() {
  return (
    <div>
        <Routes>
            <Route path="*" element={<GroupDashboard />}/>
            <Route path="/invite" element={<GroupInvite />}/>
            <Route path="/members" element={<GroupMembers />}/>
        </Routes>
    </div>
  )
}
