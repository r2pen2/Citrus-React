import "./newGroup.scss";
import Breadcrumbs from "../../../miscellaneous/navigation/breadcrumbs/Breadcrumbs";

export default function NewGroup() {
  return (
    <div>
      <Breadcrumbs path="Dashboard/Groups/New"/>
        <h1>New Group Page</h1>
        <h2>Needs implementation</h2>
        <a href="https://github.com/r2pen2/Citrus-React/issues/92">Github: Implement Dashboard/Groups/New #92</a>
        <ul>
            <li><div>Page needs a name input</div></li>
            <li><div>Page needs a description input</div></li>
            <li><div>Page needs to redirect to the invite page for the new group (/dashboard/groups/group/?id=newGroupId)</div></li>
        </ul>
    </div>
  )
}
