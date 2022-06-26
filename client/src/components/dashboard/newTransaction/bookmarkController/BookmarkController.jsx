// Library imports
import { Route, Routes, useSearchParams } from "react-router-dom";

// Component imports
import TransactionExample from "./transactionExample/TransactionExample";

const groupBookmarks = [
    {
        name: "Roommates",
        type: "group",
        id: 1
    },
    {
        name: "Sunday Breakfast Group",
        type: "group",
        id: 2
    },
    {
        name: "Family",
        type: "group",
        id: 3
    }
]

const individualBookmarks = [
    {
        name: "Oliver Risch",
        type: "individual",
        id: 1
    },
    {
        name: "Leo Brougher",
        type: "individual",
        id: 2
    },
    {
        name: "Joe Dobbelaar",
        type: "individual",
        id: 3
    },
    {
        name: "Mom",
        type: "individual",
        id: 4
    }
]

export default function BookmarkController() {
  
    console.log("bookmark controller, here!")
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    const id = params.get("id");

    function getById(i) {
        return (type === "group") ? groupBookmarks[i] : individualBookmarks[i];
    }

    return (
    <div>This will be a transaction for the {type}: {getById(id - 1).name}</div>
  )
}
