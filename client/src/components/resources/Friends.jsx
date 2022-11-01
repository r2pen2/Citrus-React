// Library imports
import { useState, useEffect } from "react";
import { Tooltip } from "@mui/material";

// API imports
import { SessionManager } from "../../api/sessionManager";
import { DBManager } from "../../api/db/dbManager";
import { AvatarIcon } from "./Avatars";

export function HomeFriendsList() {

    const userManager = SessionManager.getCurrentUserManager();
    const [friendsData, setFriendsData] = useState([]);

    useEffect(() => {
        async function fetchFriendData() {
            const friendIds = await userManager.getFriends();
            let newFriendsData = [];
            for (const friendId of friendIds) {
                const friendManager = DBManager.getUserManager(friendId);
                const pfpUrl = await friendManager.getPhotoUrl();
                const displayName = await friendManager.getDisplayName();
                newFriendsData.push({
                    id: friendId,
                    pfpUrl: pfpUrl,
                    displayName: displayName 
                });
            }
            setFriendsData(newFriendsData);
        }

        fetchFriendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function renderFriendsList() {
        return friendsData.map((friend, index) => {
            return <AvatarIcon key={index} size={64} displayName={friend.displayName} showTooltip={true} src={friend.pfpUrl} />;
        })
    }

    return (
        <div className="d-flex flex-row">
            {renderFriendsList()}
        </div>
    )
}