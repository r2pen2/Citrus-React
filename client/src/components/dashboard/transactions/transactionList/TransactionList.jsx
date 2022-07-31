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
    const DAY = 86400000;
    var unusedBrackets = [
      {
        title: "Today",
        age: DAY * 1
      },
      {
        title: "Yesterday",
        age: DAY * 2
      },
      {
        title: "This Week",
        age: DAY * 7
      },
      {
        title: "This Month",
        age: DAY * 30
      },
      {
        title: "This Year",
        age: DAY * 365
      },
      {
        title: "Older",
        age: DAY * 3650
      }
    ];

    function renderBracket(date) {
      if (props.showBrackets) {
        const transactionAge = (new Date().getTime()) - date.getTime();
        for (var i = 0; i < unusedBrackets.length; i++) {
          if (transactionAge < unusedBrackets[i].age) {
            const title = unusedBrackets[i].title;
            for (var j = 0; j <= i; j++) {
              unusedBrackets.shift();
            }
            return (
            <div className="bracket">
              <div className="text">
                <Typography marginBottom="5px">
                  {title}
                </Typography>
              </div>
              <div className="line" />
            </div>
            )
          }
        }
      }
    }
    
    function renderTransactionCard(transaction, index) {
      return (
        <div>
          <div className="bracket">
            {renderBracket(transaction.date.toDate())}
          </div>
          <div className="transaction-card" key={index} data-testid={"transaction-card-" + transaction}>
            <TransactionCard id={transaction.transactionId} user={props.user} />
          </div>
        </div>
      )
    }

    if (!a) {
        return <div className="loading-box"><CircularProgress /></div>
      }
  
      if (a.length > 0) {
        return a.map((t, idx) => {
          return renderTransactionCard(t, idx);
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
