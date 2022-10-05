import "./groups.scss"
import { Routes, Route } from "react-router-dom"

import GroupHome from "./groupHome/GroupHome";
import JoinGroup from "./joinGroup/JoinGroup";
import NewGroup from "./newGroup/NewGroup";
import Group from "./group/Group";

export default function Groups() {
  return (
    <div>
        <Routes>
            <Route path="/" element={<GroupHome />}/>
            <Route path="/join" element={<JoinGroup />}/>
            <Route path="/new" element={<NewGroup />}/>
            <Route path="/group/*" element={<Group />}/>
        </Routes>
    </div>
  )
}
