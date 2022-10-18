import {useState, useEffect} from 'react'
import { DBManager } from '../../api/db/dbManager';
import { RouteManager } from '../../api/routeManager';
import { SessionManager } from '../../api/sessionManager';

export default function InviteHandler() {

    const params = new URLSearchParams(window.location.search);
    const inviteId = params.get("id");
    const inviteType = params.get("type");

    const invitationManager = new DBManager.getInvitationManager(inviteId);

    const [validationStatus, setValidationStatus] = useState(null);

    async function validateInvite() {
        const inviteValid = await invitationManager.validate(inviteId, inviteType);
        setValidationStatus(inviteValid);
    }

    async function handleValidationStatus() {
        if (validationStatus !== "valid") {
            return;
        }
        if (invitationManager.inviteType === "user") {
            invitationManager.setUsed(true);
            invitationManager.push();
            RouteManager.redirect("/login");
        } else {
            const userManager = SessionManager.getCurrentUserManager();
            if (!userManager) {
                return;
            }
            const inviteTarget = await invitationManager.getTarget();
            let redirectUri = null;
            if (invitationManager.inviteType === "friend") {
                userManager.addFriend(inviteTarget);
                redirectUri = `/dashboard/groups?id=${inviteTarget}`;
            } else if (invitationManager.inviteType === "group") {
                userManager.addGroup(inviteTarget);
                redirectUri = `/dashboard/friends?id=${inviteTarget}`;
            }
            userManager.push().then(() => {
                if (redirectUri) {
                    RouteManager.redirect(redirectUri);
                }
            })
        }
    }

    useEffect(() => {
        if (!validationStatus) {
            validateInvite();
        } else {
            handleValidationStatus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [validationStatus])

    return (
        <div>{(validationStatus ? "valid" : "invalid invitation")}</div>
    )
}
