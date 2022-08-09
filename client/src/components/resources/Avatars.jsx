import { useState, useEffect } from 'react';
import { AvatarGroup, Avatar, Tooltip } from "@mui/material";
import { getDisplayNameById, getPhotoUrlById } from "../../api/dbManager";
import "./resources.scss";
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';

export function AvatarStack({featured, secondary, checked}) {
    
    function renderAvatarStackItems(ids, featured) {
        return (
            <AvatarGroup>
                { ids.map((id, key) => {
                    return <AvatarStackItem userId={id} index={key} featured={featured} checked={checked}/>
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

    function renderBadgedAvatar() {
        
        for (const payer of props.checked) {
            if (payer === props.userId) {
                return (
                    <Badge badgeContent={<div className="avatar-check">✓</div>} color="primary" anchorOrigin={{vertical: "bottom", horizontal: "right"}}>
                        <Avatar 
                        src={pfpUrl ? pfpUrl : ""} 
                        alt={name ? name : ""} 
                        className={"pfp " + (!props.featured ? "small" : "")}
                        imgProps={{referrerPolicy: "no-referrer" }}/>
                    </Badge>   
                )
            }
        }
        return <Avatar 
        src={pfpUrl ? pfpUrl : ""} 
        alt={name ? name : ""} 
        className={"pfp " + (!props.featured ? "small" : "")}
        imgProps={{referrerPolicy: "no-referrer" }}/>
    }

    return (
        <Tooltip title={name ? name : ""}>
            { renderBadgedAvatar() }
        </Tooltip>
    )
}