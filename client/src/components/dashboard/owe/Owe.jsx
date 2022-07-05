import "./owe.scss";
import { Route, Routes } from "react-router-dom";
import AllDues from "./allDues/AllDues";
import PersonalDues from "./personalDues/PersonalDues";

function getPos() {
    const params = new URLSearchParams(window.location.search);
    const direction = params.get("dir");
    return (direction === "in") ? true : false;
}

export default function Owe({user}) {

    const pos = getPos();

  return (
    <div>
        <Routes>
            <Route path="/" element={<AllDues positive={pos} user={user}/>}/>
            <Route path="/individual" element={<PersonalDues positive={pos} user={user}/>}/>
        </Routes>
    </div>
  )
}
