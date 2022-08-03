import { useState, useEffect } from 'react';
import { Avatar, Tooltip } from "@mui/material";
import { getDisplayNameById, getPhotoUrlById } from "../../api/dbManager";

export function AvatarStack(props) {
    return (
      <div className="avatar-stack-wrapper">
          {props.children}
      </div>
    )
}

export function AvatarStackItem(props) {

    const [pfpUrl, setPfpUrl] = useState(null);
    const [name, setName] = useState(null);

    async function fetchUserData() {
        let photo = await getPhotoUrlById(props.userId);
        setPfpUrl(photo);
        let displayName = await getDisplayNameById(props.userId);
        setName(displayName);
    }

    useEffect(() => {
        fetchUserData();
    }, [])

    return (
        <div className="avatar-stack-item" key={props.index}>
            <Tooltip title={name ? name : ""}>
                <Avatar src={pfpUrl ? pfpUrl : ""} alt={name ? name : ""}/>
            </Tooltip>
        </div>
    )
}