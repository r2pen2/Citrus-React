// Style imports
import "./style/transactions.scss";

// Library imports
import { CircularProgress, Typography, CardContent, CardActionArea, Tooltip } from '@mui/material';
import { useState, useEffect} from 'react';
import { OutlinedCard } from "./Surfaces";

// Component imports
import { AvatarStack, AvatarIcon } from "./Avatars";
import { SectionTitle } from "./Labels";
import { Breadcrumbs } from "./Navigation";

// API imports
import { getDateString, cutAtSpace } from "../../api/strings";
import formatter from "../../api/formatter";
import { sortByUTDate } from "../../api/sorting";
import { DBManager } from "../../api/db/dbManager";
import { SessionManager } from "../../api/sessionManager";
import { RouteManager } from "../../api/routeManager";

export function TransactionList(props) {
  
  const userManager = SessionManager.getCurrentUserManager();
    
  const [transactions, setTransactions] = useState(null);
  
  // Fetch transactions on mount
  useEffect(() => {
    async function fetchUserTransactions() {
      const t = await userManager.getTransactions();
      if (props.numDisplayed) {
        setTransactions(t.slice(0, props.numDisplayed));
      } else {
        setTransactions(t);
      }
    }
    fetchUserTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

   /**
  * Renders cards for each of the user's transactions
  * @param {Array} a array of user's transactions
  */
  function renderTransactions(unsortedArray) {
   const a = sortByUTDate(unsortedArray); // Sort transactions by date
   
   function renderTransactionCard(transaction, index) {
     return (
        <div>
          <div className="transaction-card" key={index} data-testid={"transaction-card-" + transaction}>
            <TransactionCard id={transaction.transactionId} />
          </div>
        </div>
      )
    }

    if (!a) { // If we don't yet have a list of transactions, just display a little loading circle
      return <div className="loading-box" key="transaction-list-loading-box"><CircularProgress /></div>
    }
  
    if (a.length <= 0) { // If there are no transactions on a user, display a message to indicate
      return    (     
        <div className="empty">
          <Typography>
            User has no transactions.
          </Typography>
        </div>
        )
    }

    // Otherwise, we have to display the transaction list
    // Populate bracket arrays
    const DAY = 86400000;
    var brackets = [[], [], [], [], [], []];
    const bracketNames = ["Today", "Yesterday", "This Week", "This Month", "This Year", "Older"];
    // Assign each transaction to a bracket associated with time since transcation creation 
    if (a) {
      for (const t of a) {
        const ageInDays = (new Date().getTime() - t.date.toDate().getTime()) / DAY;
        if (ageInDays <= 1) {
          brackets[0].push(t);
        } else if (ageInDays <= 2) {
          brackets[1].push(t);
        } else if (ageInDays <= 7) {
          brackets[2].push(t);
        } else if (ageInDays <= 30) {
          brackets[3].push(t);
        } else if (ageInDays <= 365) {
          brackets[4].push(t);
        } else {
          brackets[5].push(t);
        }
      }
    }

    // for each time bracket, render a bracket label and all of the transactions in it
    return brackets.map((bracket, bracketIdx) => { 
      return (
        <div className="transaction-bracket" key={bracketNames[bracketIdx]}>
          { (bracket.length > 0 && !props.numDisplayed) ? <SectionTitle title={bracketNames[bracketIdx]} line="hidden"/> : ""}
          { bracket.map((t, idx) => {
            return renderTransactionCard(t, idx)
          }) }
        </div>
      )
    })
  }
    
  return (
    <div className="transaction-list">
      { renderTransactions(transactions) }
    </div>
  );
}

/**
 * Render a transaction card from current user's perspective
 * @param {string} transactionId transaction id 
 */
export function TransactionCard({transactionId}) {
    
    const [context, setContext] = useState(null);

    useEffect(() => {

      /**
      * Get transaction context from user's perspective
      */
      async function getTransactionContext() {
        const transactionManager = DBManager.getTransactionManager(transactionId);
        const transactionContext = await transactionManager.getContext(SessionManager.getUserId());
        setContext(transactionContext);
      }

      getTransactionContext();
    }, [transactionId])

    function renderAvatarStack() {
        if (context) {
            var fronterIds = [];
            var payerIds = [];
            var settledPayers = [];
            for (const fronter of context.fronters) {
                fronterIds.push(fronter.id);
            }
            for (const payer of context.payers) {
                payerIds.push(payer.id);
                if (payer.settled) {
                  settledPayers.push(payer.id)
                }
            }

            return (
                <AvatarStack featured={fronterIds} secondary={payerIds} checked={settledPayers}/>
            )
        }
    }

    function generateDebtTooltip() {
        if (context) {
            if (context.role === "payer") {
                return "You still owe " + formatter.format(context.debt - context.credit) + " in this transaction.";
            } else if (context.role === "fronter") {
                return "You are still owed " + formatter.format(context.debt - context.credit) + " in this transaction.";
            }
        }
    }

    if (context) {
        return (
            <OutlinedCard key={transactionId}>
                <CardActionArea onClick={() => window.location = "/dashboard/transaction/?id=" + transactionId}>
                    <CardContent>
                        <div className="transaction-card-content-container">
                            <div className="left">
                                { renderAvatarStack() }
                            </div>
                            <div className="center">
                                <div className="text-container">
                                    <Typography variant="h6" component="div">{context.title}</Typography>
                                    <Typography variant="subtitle1" component="div" sx={{ color: "gray "}}>{getDateString(context.date.toDate())}</Typography>
                                </div>
                            </div>
                            <div className="right">
                                <Tooltip title={generateDebtTooltip()}>
                                    <div className="amount-container">
                                       <Typography align="right" variant="h5" component="div" color={context.role === "payer" ? "#ec6a60" : "#bfd679"}>{formatter.format(context.debt - context.credit)}</Typography>
                                       <Typography align="right" variant="subtitle2" component="div" color="lightgrey">/ {formatter.format(context.debt)}</Typography>
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    </CardContent>
                </CardActionArea>
            </OutlinedCard>
        )
    }
}

export function TransactionDetail() {
  const params = new URLSearchParams(window.location.search);
  const transactionId = params.get("id");

  const [transactionManager, setTransactionManager] = useState(null);

  useEffect(() => {

    async function fetchTransactionData() {
      // Check if there's an ID
      if (!transactionId || transactionId.length > 0) {
        RouteManager.redirect("/dashboard");
        return;
      }
      const tm = DBManager.getTransactionManager(transactionId);
      await tm.fetchData();
      // Make sure current user is in this transaction's user list
      let foundCurrentUser = false;
      for (const transactionUser of tm.getUsers()) {
        if (transactionUser.id === SessionManager.getUserId()) {
          foundCurrentUser = true;
        }
      }
      if (!foundCurrentUser) { 
        // If the current user wasn't found in this transaction's user list, kick them out!
        RouteManager.redirect("/dashboard");
      } else {
        // Otherwise, they're in the right place! Update the transactionManager with loaded data
        setTransactionManager(tm);
      }
    }

    // Fetch transaction data on load
    fetchTransactionData();
  }, [transactionId])

  return (
    <div>
      <Breadcrumbs path={"Dashboard/Transactions/" + transactionId} />
      <h1>Transaction Detail Page</h1>
      <TransactionDetailHeader transcationManager={transactionManager} />
      <h2>Needs implementation</h2>
      <a href="https://github.com/r2pen2/Citrus-React/issues/97">
        Github: Implement Dashboard/Transactions/Detail?id=transactionId #97
      </a>
      <ul>
        <li>
          <div>Renders information on a transaction by ID</div>
        </li>
        <li>
          <div>
            Shows a map (maybe), a button to dispute, and a button to edit
          </div>
        </li>
        <li>
          <div>Shows avatars of everyone involved in the transaction</div>
        </li>
        <li>
          <div>Shows the cost of the transaction</div>
        </li>
        <li>
          <a href={"/dashboard/transaction/conversation?id=" + transactionId}>
            Link to dispute page
          </a>
        </li>
      </ul>
    </div>
  );
}

export function TransactionConversation() {
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

/**
 * Render a card representing a TransactionRelation
 * @param {TransactionRelation} relation TransactionRelation object to render
 */
export function TransactionRelationCard({relation}) {
  return (
      <OutlinedCard>
          <CardContent>
              <div className="relation-card-content-container">
                  <div className="relation-content">
                      <AvatarIcon src={relation.from.pfpUrl} alt={"From user photo"}/>
                      <Typography variant="subtitle1" color="primary">${relation.amount}</Typography>
                      <Typography variant="subtitle1" color="primary">⟹</Typography>
                      <AvatarIcon src={relation.to.pfpUrl} alt={"To user photo"}/>
                  </div>
                  <div className="relation-content">
                      <Typography>{cutAtSpace(relation.from.displayName)} owes {cutAtSpace(relation.to.displayName)} ${relation.amount}</Typography>
                  </div>
              </div>
          </CardContent>
      </OutlinedCard>
  )
} 

function TransactionDetailHeader({transactionManager}) {
  
  const [transactionTitle, setTransactionTitle] = useState("");

  useEffect(() => {
    function managerIsValid() {
      if (!transactionManager) {
        return false;
      }
      if (!transactionManager.hasFetched()) {
        return false;
      }
      return true;
    }

    async function getTransactionDetails() {
      if (!managerIsValid()) {
        setTransactionTitle("");
      } else {
        const title = await transactionManager.getTitle(); 
        setTransactionTitle(title);
      }
    }

    getTransactionDetails();
  }, [transactionManager]);

  return (
    <div className="transaction-detail-header">
      <h1>{transactionTitle}</h1>
    </div>
  )
}