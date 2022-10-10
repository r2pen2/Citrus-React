import { Routes, Route } from 'react-router-dom';

import GroupDashboard from './group/GroupDashboard';
import GroupInvite from "./group/GroupInvite";
import GroupMembers from "./group/GroupMembers";
import GroupNew from "./group/GroupNew";
import GroupJoin from "./group/GroupJoin";

export default function Friends() {
  return (
    <div>
        <Routes>
            <Route path="*" element={<GroupDashboard />}/>
            <Route path="/invite" element={<GroupInvite />}/>
            <Route path="/members" element={<GroupMembers />}/>
            <Route path="/new" element={<GroupNew />}/>
            <Route path="/join" element={<GroupJoin />}/>
        </Routes>
    </div>
  )
}
