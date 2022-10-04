import { useState, useEffect } from 'react';
import { AvatarGroup, Avatar, Tooltip, Typography } from "@mui/material";
import { DBManager } from "../../api/db/dbManager";
import "./resources.scss";
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
        const userManager = DBManager.getUserManager(props.userId);
        let photo = await userManager.getPhotoUrl();
        setPfpUrl(photo);
        let displayName = await userManager.getDisplayName();
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

export function AvatarIcon(props) {
    const [pfpUrl, setPfpUrl] = useState(props.src ? props.src : null);
    const [alt, setAlt] = useState(props.alt ? props.alt : "");

    useEffect(() => {

        const userManager = DBManager.getUserManager(props.id);

        async function fetchUserData() {
            if (!props.src) {
                let url = await userManager.getPhotoUrl();
                setPfpUrl(url);
            }
            if (!props.alt) {
                let name = await userManager.getDisplayName();
                setAlt(name);
            }
        }

        fetchUserData();
        
    }, [props.id])

    return <Avatar src={pfpUrl} alt={alt} />
}

export function AvatarToggle(props) {

    function renderName() {
        if (props.displayName) {
            const shortenedName = props.displayName.substring(0, props.displayName.indexOf(" "));
            return (
                <Typography color={props.outlined ? "primary" : "black"}>{shortenedName}</Typography>
            )
        }
    }

    return (
        <div className="avatar-toggle">
            <div className={"avatar-toggle-icon-element " + (props.outlined ? "outlined" : "")}>
                <AvatarIcon id={props.id} src={props.src ? props.src : null}/>
            </div>
            { renderName() }
        </div>
    )
}