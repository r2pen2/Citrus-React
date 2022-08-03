import "./allTransactions.scss";
import { Breadcrumbs } from "../../../resources/Navigation";
import { CircularProgress, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { getActiveTransactionsByUserId } from "../../../../api/dbManager";
import { TransactionList, TransactionCard } from "../../../resources/Transactions"

export default function AllTransactions({ user }) {

  const [activeTransactions, setActiveTransactions] = useState(null);

  async function fetchUserTransactions() {
    let t = await getActiveTransactionsByUserId(user.uid);
    setActiveTransactions(t);
  }

  // Fetch transactions on mount
  useEffect(() => {
    fetchUserTransactions();
  }, [])


  /**
   * Renders cards for each of the user's transactions
   * @param {Array} a array of user's transactions
   */
  function renderTransactions(a) {

    function renderTransactionCard(transaction, index) {

      return (
        <TransactionCard id={transaction} user={user} />
      )
    }

    if (!a) {
      return <div className="loading-box"><CircularProgress /></div>
    }

    if (a.length > 0) {
      return a.map((t, idx) => {
        return renderTransactionCard(t.transactionId, idx);
      })
    } else {
      return    (     
      <div className="empty">
        <Typography>
          User has no transactions.
        </Typography>
      </div>
      )
    }
  }

  return (
    <div className="all-transactions">
      <Breadcrumbs path="Dashboard/Transactions" />
      <TransactionList user={user} showBrackets={true}/>
    </div>
  );
}
