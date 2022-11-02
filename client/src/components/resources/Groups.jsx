// Style Imports
import "./style/groups.scss";

// Library Imports
import { FormControl, TextField, Typography, Button, IconButton, Tooltip} from "@mui/material";
import { useState, useEffect } from "react"
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Component Imports
import {Breadcrumbs} from "./Navigation";

// API Imports
import { RouteManager } from "../../api/routeManager";
import { SessionManager } from "../../api/sessionManager";
import { DBManager } from "../../api/db/dbManager";

export function GroupNew() {

  const userManager = SessionManager.getCurrentUserManager();

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  function checkSubmitEnable() {
      return groupName.length > 0;
  }

  /**
   * Creates a group, adds the current user to that group, and redirects the user
   * to the invitation page for this new group
   */
  async function handleSubmit() {
    const groupManager = DBManager.getGroupManager();
    // Set group metadata
    groupManager.setCreatedAt(new Date());
    groupManager.setCreatedBy(SessionManager.getUserId());
    // Set user-facing group data
    groupManager.setDescription(groupDescription.length > 0 ? groupDescription : null);
    groupManager.setName(groupName);
    // Add current user to group
    groupManager.addUser(SessionManager.getUserId());
    // Create a code
    // Push changes to new group, then add the group to current user if successful
    await groupManager.push();
    await groupManager.generateInvites();
    userManager.addGroup(groupManager.getDocumentId());
    await userManager.push();
    RouteManager.redirectToGroupInvite(groupManager.getDocumentId());
  }

  return (
    <div className="group-form">
      <Breadcrumbs path="Dashboard/Groups/New" />
      <div className="d-flex flex-column align-items-center justify-content-center w-100 gap-10">
          <Typography variant="h1">Create a Group</Typography>
          <FormControl className="gap-10">
              <TextField
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  inputProps={{min: 0, style: { textAlign: 'center' }}}
                  label="Group Title"
              >
              </TextField>
              <TextField
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  inputProps={{min: 0, style: { textAlign: 'center' }}}
                  label="Description (Optional)"
              >
              </TextField>
          </FormControl>
          <Button variant="contained" color="primary" disabled={!checkSubmitEnable()} onClick={() => handleSubmit()}>
              Create Group
          </Button>
      </div>
    </div>
  );
}

export function GroupMembers({ user }) {
    const params = new URLSearchParams(window.location.search);
    const groupId = params.get("id");
  
    return (
      <div>
        <Breadcrumbs path={"Dashboard/Groups/" + groupId + "/Members"} />
        <h1>Group Members Page</h1>
        <div>Group: {groupId}</div>
        <h2>Needs implementation</h2>
        <a href="https://github.com/r2pen2/Citrus-React/issues/99">
          Github: Implement Dashboard/Groups/Group/Members?id=groupId #99
        </a>
        <ul>
          <li>
            <div>Renders a list of group members by groupId from urlparams</div>
          </li>
        </ul>
      </div>
    );
}

export function GroupInvite() {

    const params = new URLSearchParams(window.location.search);
    const groupId = params.get("id");
  
    const [groupInviteData, setGroupInviteData] = useState({
        link: null,
        qr: null,
        code: null,
      });
    const [clipboardTooltip, setClipboardtooltip] = useState("Copy to Clipboard");
      
    useEffect(() => {
        async function loadGroupData() {
          const groupManager = DBManager.getGroupManager(groupId);
          const link = await groupManager.getLinkInvite();
          const qr = await groupManager.getQrInvite();
          const code = await groupManager.getCodeInvite();
          setGroupInviteData({
            link: link,
            qr: qr,
            code: code,
          });
        }

        loadGroupData();
    }, [groupId])

    /**
     * Reset clipboard tooltip after 1 second
     */
    useEffect(() => {
      setTimeout(() => {
        setClipboardtooltip("Copy to Clipboard");
      }, 1000);
    }, [clipboardTooltip]);

    function copyLink() {
      if (groupInviteData.link) {
        navigator.clipboard.writeText(groupInviteData.link);
        setClipboardtooltip("Copied!");
      }
    }

    return (
        <div className="group-form">
          <div className="d-flex flex-column align-item-center justify-content-center w-100 gap-10">
            <div className="d-flex flex-row align-items-center justify-content-center w-100 gap-2">
              <Tooltip title={clipboardTooltip}>
                <IconButton onClick={() => copyLink()}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              <TextField
                label="Invitation Link"
                value={groupInviteData.link ? groupInviteData.link : "Generating invite link..."}
                id="outlined-size-small"
                size="small"
                className="w-100"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className="d-flex flex-row align-items-center justify-content-center w-100 gap-2">
              <Tooltip title={clipboardTooltip}>
                <IconButton onClick={() => copyLink()}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              <TextField
                label="Invitation Code"
                value={groupInviteData.code ? groupInviteData.code : "Generating code..."}
                id="outlined-size-small"
                size="small"
                className="w-100"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
          </div>
        </div>
    );
}

export function GroupDashboard() {
    const params = new URLSearchParams(window.location.search);
    const groupId = params.get("id");
  
    return (
      <div>
        <Breadcrumbs path={"Dashboard/Groups/" + groupId} />
        <h1>Group Dashboard Page</h1>
        <div>Id: {groupId}</div>
        <h2>Needs implementation</h2>
        <a href="https://github.com/r2pen2/Citrus-React/issues/93">
          Github: Implement Dashboard/Groups/Group?id=groupId #93
        </a>
        <ul>
          <li>
            <div>
              Renders a dashboard element with context from groupId in urlparams
            </div>
          </li>
          <li>
            <a href={"/dashboard/groups/group/invite?id=" + groupId}>
              Invite Someone
            </a>
          </li>
          <li>
            <a href={"/dashboard/groups/group/members?id=" + groupId}>
              View Group Members
            </a>
          </li>
        </ul>
      </div>
    );
}

export function GroupAdd() {
  
    const [groupCode, setGroupCode] = useState("");

    function checkSubmitEnable() {
        return groupCode.length > 5;
    }

    return (
      <div className="group-form">
        <Breadcrumbs path="Dashboard/Groups/Add" />
        <div className="d-flex flex-column align-items-center justify-content-center w-100 gap-10">
            <Typography variant="h1">Add a Group</Typography>
            <FormControl>
                <TextField
                    value={groupCode}
                    onChange={(e) => setGroupCode(e.target.value)}
                    inputProps={{min: 0, style: { textAlign: 'center' }}}
                    label="Group Code"
                >
                </TextField>
            </FormControl>
            <Button variant="contained" color="primary" disabled={!checkSubmitEnable()} onClick={() => {}}>
                Join
            </Button>
            <Button variant="outlined" color="primary" onClick={() => RouteManager.redirect("/dashboard/groups/new")}>
                Or create a new group
            </Button>
        </div>
      </div>
    );
}