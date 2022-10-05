import "./owe.scss";
import { Route, Routes } from "react-router-dom";
import AllDues from "./allDues/AllDues";
import PersonalDues from "./personalDues/PersonalDues";

function getPos() {
    const params = new URLSearchParams(window.location.search);
    const direction = params.get("dir");
    return (direction === "in") ? true : false;
}

export default function Owe() {

    const pos = getPos();

  return (
    <div>
        <Routes>
            <Route path="/" element={<AllDues positive={pos} />}/>
            <Route path="/individual" element={<PersonalDues positive={pos} />}/>
        </Routes>
    </div>
  )
}
