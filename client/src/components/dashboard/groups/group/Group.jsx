import "./group.scss";
import { Routes, Route } from 'react-router-dom';

import GroupDashboard from './groupDashboard/GroupDashboard';
import GroupInvite from "./groupInvite/GroupInvite";

export default function Group({user}) {
  return (
    <div>
        <Routes>
            <Route path="/" element={<GroupDashboard user={user} />}/>
            <Route path="/dashboard" element={<GroupDashboard user={user} />}/>
            <Route path="/invite" element={<GroupInvite />}/>
        </Routes>
    </div>
  )
}
