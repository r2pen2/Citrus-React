import "./shortcut.scss";

// Library imports
import { Card, CardContent, CardActionArea, Typography, Stack } from "@mui/material";
import { useState } from "react"

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

export default function Shortcut( {bookmarksDeployed, setBookmarksDeployed} ) {

    const [type, setType] = useState("");

    function handleTypeMouseEnter(event, t) {
        if (event.type === "mouseenter") {
            setType(t);
            setBookmarksDeployed(true);
        }
    }

    function renderTypeBookmarks(t) {

        function handleMouseUp(event, bookmark) {
            if (event.type === "mouseup") {
                window.location = "/dashboard/new-transaction/bookmarks?type=" + bookmark.type + "&id=" + bookmark.id;
            }
        }

        function getBookmarks(type) {
            if (type === "group") {
                return groupBookmarks.map((bookmark, idx) => {
                    return(
                        <div className={"mark " + type} onMouseUp={(e) => {handleMouseUp(e, bookmark)}}>
                            {bookmark.name}
                        </div>
                    )
                })
            } else if (type === "individual") {
                return individualBookmarks.map((bookmark, idx) => {
                    return (
                        <div className={"mark " + type} onMouseUp={(e) => {handleMouseUp(e, bookmark)}}>
                            {bookmark.name}
                        </div>
                    )
                })
            }
        }

        if (bookmarksDeployed) {
            return <div className="bookmarks">
                { getBookmarks(t) }
            </div>
        }
    }

    function isCardDisabled(title) {
        if (bookmarksDeployed) {
            if (title !== type) {
                return "disabled";
            }
        }
    }

    return (
    <div className="shortcut-container">
        <div className="group-or-individual">
            <Card className={"card individual " + isCardDisabled("individual")} onMouseEnter={(e) => handleTypeMouseEnter(e, "individual")}>
                <div className="text">Individuals</div>
            </Card>
            <Card className={"card group " + isCardDisabled("group")} onMouseEnter={(e) => handleTypeMouseEnter(e, "group")}>
                <div className="text">Groups</div>
            </Card>
        </div>
        { renderTypeBookmarks(type) }
    </div>
  )
}
