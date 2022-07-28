import "./allDues.scss";
import Breadcrumbs from "../../../resources/Breadcrumbs";

export default function AllDues({ positive, user }) {
  return (
    <div>
      <Breadcrumbs path={"Dashboard/IOU/" + (positive ? "Owe Me" : "I Owe")} />
      <h1>All Dues Page</h1>
      <h2>Needs implementation</h2>
      <a href="https://github.com/r2pen2/Citrus-React/issues/96">
        Github: Implement Dashboard/Owe/?dir=in/out #96
      </a>
      <ul>
        <li>
          <div>
            Renders a list of all outstanding transactions in a direction
          </div>
        </li>
        <li>
          <div>
            Direction is determined by the (positive) prop passed into the
            element
          </div>
        </li>
        <li>
          <div>
            Each transaction has a button to settle and a button to venmo
          </div>
        </li>
        <li>
          <div>
            Positive version is green and has a remind button on each
            transaction
          </div>
        </li>
        <li>
          <div>Negative version is red and does not have the remind button</div>
        </li>
        <li>
          <a href="/dashboard/owe/individual?id=exampleID">
            Link to Personal Dues Page
          </a>
        </li>
      </ul>
    </div>
  );
}
