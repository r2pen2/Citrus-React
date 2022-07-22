import "./groupInvite.scss";
import Breadcrumbs from "../../../../resources/Breadcrumbs";

export default function GroupInvite() {
  const params = new URLSearchParams(window.location.search);
  const groupId = params.get("id");

  return (
    <div>
      <Breadcrumbs path={"Dashboard/Groups/" + groupId + "/Invite"} />
      <h1>Group Invite Page</h1>
      <div>Id: {groupId}</div>
      <h2>Needs implementation</h2>
      <a href="https://github.com/r2pen2/Citrus-React/issues/94">
        Github: Implement Dashboard/Groups/Group/Invite?id=groupId #93
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
      </ul>
    </div>
  );
}
