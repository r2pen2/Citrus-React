import "./allTransactions.scss";
import { Breadcrumbs } from "../../resources/Navigation";
import { TransactionList } from "../../resources/Transactions"

export default function AllTransactions({ user }) {

  return (
    <div className="all-transactions">
      <Breadcrumbs path="Dashboard/Transactions" />
      <TransactionList user={user} showBrackets={true}/>
    </div>
  );
}
