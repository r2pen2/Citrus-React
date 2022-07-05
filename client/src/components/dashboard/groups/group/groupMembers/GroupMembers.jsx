import "./groupMembers.scss";

export default function GroupMembers() {

    const params = new URLSearchParams(window.location.search);
    const groupId = params.get("id");

  return (
    <div>
        <h1>Group Members Page</h1>
        <div>Group: {groupId}</div>
        <h2>Needs implementation</h2>
        <a href="https://github.com/r2pen2/Citrus-React/issues/99">Github: Implement Dashboard/Groups/Group/Members?id=groupId #99</a>
        <ul>
            <li><div>Renders a list of group members by groupId from urlparams</div></li>
        </ul>
    </div>
  )
}
