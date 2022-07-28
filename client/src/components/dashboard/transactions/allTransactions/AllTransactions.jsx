import "./allTransactions.scss";
import Breadcrumbs from "../../../resources/Breadcrumbs";

export default function AllTransactions({ user }) {
  return (
    <div>
      <Breadcrumbs path="Dashboard/Transactions" />
      <h1>All Transactions Page</h1>
      <h2>Needs implementation</h2>
      <a href="https://github.com/r2pen2/Citrus-React/issues/98">
        Github: Implement Dashboard/Transactions #98
      </a>
      <ul>
        <li>
          <div>Renders all outstanding transactions</div>
        </li>
        <li>
          <div>Transactions are sorted by how recent they are</div>
        </li>
        <li>
          <div>
            Displayed in groups based on how long it's been (today, yesterday,
            last week, last month...)
          </div>
        </li>
      </ul>
    </div>
  );
}
