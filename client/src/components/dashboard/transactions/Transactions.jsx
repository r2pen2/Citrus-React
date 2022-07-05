import "./transactions.scss";
import {Routes, Route} from 'react-router-dom';
import AllTransactions from "./allTransactions/AllTransactions";
import TransactionDetail from "./transactionDetail/TransactionDetail";

export default function Transactions({user}) {
  return (
    <div>
        <Routes>
            <Route path="/" element={<AllTransactions user={user} />}/>
            <Route path="/detail" element={<TransactionDetail user={user}/>}/>
        </Routes>
    </div>
  )
}
