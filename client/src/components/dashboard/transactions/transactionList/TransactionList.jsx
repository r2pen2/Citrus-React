// Style imports
import "./transactionList.scss";

// Library imports
import { CircularProgress, Typography } from '@mui/material';
import { useState, useEffect} from 'react';

// Component imports
import TransactionCard from "../allTransactions/TransactionCard";

// API imports
import { getActiveTransactionsByUserId } from "../../../../api/dbManager"

export default function TransactionList(props) {
    
    const [activeTransactions, setActiveTransactions] = useState(null);

    async function fetchUserTransactions() {
      let t = await getActiveTransactionsByUserId(props.user.uid);
      if (props.numDisplayed) {
        setActiveTransactions(t.slice(0, props.numDisplayed));
      } else {
        setActiveTransactions(t);
      }
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
        <div className="transaction-card" key={index} data-testid={"transaction-card-" + transaction}>
          <TransactionCard id={transaction} user={props.user} />
        </div>
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
        <div>
            { renderTransactions(activeTransactions) }
        </div>
        );
}
