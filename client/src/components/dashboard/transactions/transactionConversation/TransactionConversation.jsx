import "./transactionConversation.scss";
import {Breadcrumbs} from "../../../resources/Navigation";

export default function TransactionConversation({ user }) {
  const params = new URLSearchParams(window.location.search);
  const transactionId = params.get("id");

  return (
    <div>
      <Breadcrumbs
        path={"Dashboard/Transactions/" + transactionId + "/Conversation"}
      />
      <h1>Transaction Conversation Page</h1>
      <div>Transaction Id: {transactionId}</div>
      <h2>Needs implementation</h2>
      <a href="https://github.com/r2pen2/Citrus-React/issues/100">
        Github: Implement Dashboard/Transactions/Conversation?id=transactionId
        #100
      </a>
      <ul>
        <li>
          <div>
            A chat room within the context of the transaction in urlparams
          </div>
        </li>
      </ul>
    </div>
  );
}
