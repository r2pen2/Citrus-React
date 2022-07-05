import "./transactions.scss";
import {Routes, Route} from 'react-router-dom';
import AllTransactions from "./allTransactions/AllTransactions";
import TransactionDetail from "./transactionDetail/TransactionDetail";
import TransactionConversation from "./transactionConversation/TransactionConversation";

export default function Transactions({user}) {
  return (
    <div>
        <Routes>
            <Route path="/" element={<AllTransactions user={user} />}/>
            <Route path="/detail" element={<TransactionDetail user={user}/>}/> 
            <Route path="/conversation" element={<TransactionConversation user={user}/>}/> 
        </Routes>
    </div>
  )
}
