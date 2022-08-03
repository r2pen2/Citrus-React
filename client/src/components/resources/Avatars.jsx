import { useState, useEffect } from 'react';
import { AvatarGroup, Avatar, Tooltip } from "@mui/material";
import { getDisplayNameById, getPhotoUrlById } from "../../api/dbManager";
import "./resources.scss";

export function AvatarStack({featured, secondary}) {
    
    function renderAvatarStackItems(ids, featured) {
        return (
            <AvatarGroup >
                { ids.map((id, key) => {
                    return <AvatarStackItem userId={id} index={key} featured={featured}/>
                })}
            </AvatarGroup>
        )
    }

    return (
      <div className="avatar-stack-wrapper">
          <div className="featured">
            { renderAvatarStackItems(featured, true) }
          </div>
          <div className="secondary">
            { renderAvatarStackItems(secondary, false) }
          </div>
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
                    <Avatar src={pfpUrl ? pfpUrl : ""} alt={name ? name : ""} className={"pfp " + (!props.featured ? "small" : "")}/>
            </Tooltip>
        </div>
    )
}