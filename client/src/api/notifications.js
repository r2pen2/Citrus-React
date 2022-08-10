import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import MessageIcon from '@mui/icons-material/Message';
import GroupsIcon from '@mui/icons-material/Groups';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AlarmIcon from '@mui/icons-material/Alarm';
import { getPhotoUrlById  } from './dbManager';
import { Avatar } from '@mui/material';

/**
 * Parse a notification into a human-readable string
 * @param {Object} notification notification object
 * @returns string representation of notification
 */
export function getNotificationString(notification) {
    switch (notification.type) {
        case "friend-invite":
            return getFriendInviteString(notification);
        case "friend-accept":
            return getFriendAcceptString(notification);
        case "nudge":
            return getNudgeString(notification);
        case "paid":
            return getPaidString(notification);
        case "requested":
            return getRequestedString(notification);
        case "group-invite":
            return getGroupInviteString(notification);
        case "group-accept":
            return getGroupAcceptString(notification);
        case "group-leave":
            return getGroupLeaveString(notification);
        case "transaction-message":
            return getTranscationMessageString(notification);
        case "transaction-dispute":
            return getTranscactionDisputeString(notification);
        default:
            return "Error: invalid notification type";
    }
}

/**
 * Returns an icon for a given notification
 * @param {Object} notification notification object
 * @returns component to be used as icon for notification
 */
export function getNotificationIcon(notification) {

    const iconSize = "medium";

    function getErrorIcon() {
        return (
            <div className="notification-icon error">
                <ErrorOutlineIcon fontSize={iconSize} />
            </div>
        )
    }
    
    function getDisputeIcon() {
        return (
            <div className="notification-icon dispute">
                <SportsMmaIcon fontSize={iconSize} />
            </div>
        )
    }

    function getMessageIcon() {
        return (
            <div className="notification-icon message">
                <MessageIcon fontSize={iconSize} />
            </div>
        )
    }

    function getGroupIcon() {
        return (
            <div className="notification-icon group">
                <GroupsIcon fontSize={iconSize} />
            </div>
        )
    }

    function getMoneyIcon() {
        return (
            <div className="notification-icon money">
                <LocalAtmIcon fontSize={iconSize} />
            </div>
        )
    }

    function getPokeIcon() {
        return (
            <div className="notification-icon poke">
                <AlarmIcon fontSize={iconSize} />
            </div>
        )
    }

    function getFriendIcon(n) {
        const url = getPhotoUrlById(n.friend.id);
        return (
            <div className="notification-icon friend">
                <Avatar src={url} alt={n.friend.name} />
            </div>
        )
    }

    switch (notification.type) {
        case "friend-invite":
        case "friend-accept":
            return getFriendIcon(notification);
        case "nudge":
            return getPokeIcon();
        case "paid":
        case "requested":
            return getMoneyIcon();
        case "group-invite":
        case "group-accept":
        case "group-leave":
            return getGroupIcon();
        case "transaction-message":
            return getMessageIcon();
        case "transaction-dispute":
            return getDisputeIcon();
        default:
            return getErrorIcon();
    }
}