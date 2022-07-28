import "./personalDues.scss";
import Breadcrumbs from "../../../resources/Breadcrumbs";

export default function PersonalDues({ positive, user }) {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("id");

  return (
    <div>
      <Breadcrumbs path={"Dashboard/IOU/" + userId} />
      <h1>Personal Dues Page</h1>
      <div>With user: {userId}</div>
      <h2>Needs implementation</h2>
      <a href="https://github.com/r2pen2/Citrus-React/issues/95">
        Github: Implement Dashboard/Owe/Individual?id=userId #95
      </a>
      <ul>
        <li>
          <div>
            Renders a list of outstanding transactions between user and another
            person
          </div>
        </li>
        <li>
          <div>Has that other person's profile picture</div>
        </li>
        <li>
          <div>Has total balance between you two</div>
        </li>
        <li>
          <div>
            Has buttons to settle (outside the app), send money via Venmo, and
            to remind them
          </div>
        </li>
      </ul>
    </div>
  );
}
