import "./groups.scss"
import { Routes, Route } from "react-router-dom"

import GroupHome from "./groupHome/GroupHome";
import JoinGroup from "./joinGroup/JoinGroup";
import NewGroup from "./newGroup/NewGroup";
import Group from "./group/Group";

export default function Groups({user}) {
  return (
    <div>
        <Routes>
            <Route path="/" element={<GroupHome user={user}/>}/>
            <Route path="/join" element={<JoinGroup user={user}/>}/>
            <Route path="/new" element={<NewGroup user={user}/>}/>
            <Route path="/group/*" element={<Group user={user}/>}/>
        </Routes>
    </div>
  )
}
