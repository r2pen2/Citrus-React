import "./groups.scss"
import { Routes, Route } from "react-router-dom"

import GroupHome from "./groupHome/GroupHome";
import JoinGroup from "./joinGroup/JoinGroup";
import NewGroup from "./newGroup/NewGroup";

export default function Groups({user}) {
  return (
    <Routes>
        <Route path="/" element={<GroupHome user={user}/>}/>
        <Route path="/join" element={<JoinGroup user={user}/>}/>
        <Route path="/new" element={<NewGroup user={user}/>}/>
    </Routes>
  )
}
