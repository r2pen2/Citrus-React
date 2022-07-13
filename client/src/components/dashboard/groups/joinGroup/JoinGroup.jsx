import './joinGroup.scss';
import Breadcrumbs from "../../../miscellaneous/navigation/breadcrumbs/Breadcrumbs";

export default function JoinGroup({user}) {
  return (
    <div>
        <Breadcrumbs path="Dashboard/Groups/Join"/>
        <h1>Join Group Page</h1>
        <h2>Needs implementation</h2>
        <a href="https://github.com/r2pen2/Citrus-React/issues/91">Github: Implement Dashboard/Groups/Join #91</a>
        <ul>
            <li><div>Page needs a search bar</div></li>
            <li><div>Page needs to be able to load with url params that immediately add the group to the user</div></li>
            <li><div>Page needs a QR reader</div></li>
        </ul>
    </div>
  )
}
