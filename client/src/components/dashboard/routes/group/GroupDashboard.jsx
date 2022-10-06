import {Breadcrumbs} from "../../../resources/Navigation";

export default function GroupDashboard() {
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
