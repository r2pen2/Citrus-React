import "./transactionDetail.scss";

export default function TransactionDetail({user}) {
    
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get("id");

  return (
    <div>
        <h1>Transaction Detail Page</h1>
        <div>Transaction Id: {transactionId}</div>
        <h2>Needs implementation</h2>
        <a href="https://github.com/r2pen2/Citrus-React/issues/97">Github: Implement Dashboard/Transactions/Detail?id=transactionId #97</a>
        <ul>
            <li><div>Renders information on a transaction by ID</div></li>
            <li><div>Shows a map (maybe), a button to dispute, and a button to edit</div></li>
            <li><div>Shows avatars of everyone involved in the transaction</div></li>
            <li><div>Shows the cost of the transaction</div></li>
        </ul>
    </div>
  )
}
