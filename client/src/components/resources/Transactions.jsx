// Style imports
import "./style/transactions.scss";

// Library imports
import { CircularProgress, Typography, CardContent, CardActionArea, Tooltip, Button } from '@mui/material';
import { useState, useEffect} from 'react';
import { OutlinedCard } from "./Surfaces";

// Component imports
import { AvatarStack, AvatarIcon } from "./Avatars";
import { SectionTitle } from "./Labels";
import { Breadcrumbs } from "./Navigation";

// API imports
import { getDateString, cutAtSpace } from "../../api/strings";
import formatter from "../../api/formatter";
import { sortByDataCreatedAt } from "../../api/sorting";
import { DBManager } from "../../api/db/dbManager";
import { SessionManager } from "../../api/sessionManager";
import { RouteManager } from "../../api/routeManager";

export function TransactionList(props) {
  
  const userManager = SessionManager.getCurrentUserManager();
    
  const bracketNames = ["Today", "Yesterday", "This Week", "This Month", "This Year", "Older"];
  const [listState, setListState] = useState({
    numFetched: -1,
    brackets: [[], [], [], [], [], []]
  })
  
  // Fetch transactions on mount
  useEffect(() => {
    async function fetchUserTransactions() {
        // Get all transaction IDs that user is in
        let transactionIds = await userManager.getTransactions();
        let newTransactionManagers = [];
        for (const transactionId of transactionIds) {
            const transactionManager = DBManager.getTransactionManager(transactionId);
            await transactionManager.fetchData();
            newTransactionManagers.push(transactionManager);
        }
        newTransactionManagers = sortByDataCreatedAt(newTransactionManagers);
        if (props.numDisplayed) { // Throw out extra transactions if we're limiting the number we're displaying
            newTransactionManagers = newTransactionManagers.slice(0, props.numDisplayed);
        }
        // Sort transactionManagers into brackets
        const day = 86400000;
        let newBrackets = [[], [], [], [], [], []];
        for (const transactionManager of newTransactionManagers) {
          const ageInDays = (new Date().getTime() - new Date(transactionManager.createdAt).getTime() / day);
          if (ageInDays <= 1) {
            newBrackets[0].push(transactionManager);
          } else if (ageInDays <= 2) {
            newBrackets[1].push(transactionManager);
          } else if (ageInDays <= 7) {
            newBrackets[2].push(transactionManager);
          } else if (ageInDays <= 30) {
            newBrackets[3].push(transactionManager);
          } else if (ageInDays <= 365) {
            newBrackets[4].push(transactionManager);
          } else {
            newBrackets[5].push(transactionManager);
          }
        }
        // Set state
        setListState({
          numFetched: newTransactionManagers.length,
          brackets: newBrackets
        })
    }

    fetchUserTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

   /**
  * Renders cards for each of the user's transactions
  * @param {Array} a array of user's transactions
  */
  function renderTransactions() {

    if (listState.numFetched === -1) { // If we don't yet have a list of transactions, just display a little loading circle
      return (
        <div className="d-flex flex-row justify-content-center">
          <CircularProgress />
        </div>
      )
    }
  
    if (listState.numFetched === 0) { // If there are no transactions on a user, display a message to indicate
      return    (     
        <div className="d-flex flex-row mh-100 align-items-center justify-content-center">
          <Typography>
            User has no transactions.
          </Typography>
        </div>
        )
    }

    // for each time bracket, render a bracket label and all of the transactions in it
    return listState.brackets.map((bracket, bracketIdx) => { 
      return (
        <div key={bracketNames[bracketIdx]}>
          { (bracket.length > 0 && !props.numDisplayed) ? <SectionTitle title={bracketNames[bracketIdx]} line="hidden"/> : ""}
          { bracket.map((transactionManager, idx) => {
            return (
              <div key={idx} data-testid={"transaction-card-" + transactionManager.getDocumentId()}>
                <TransactionCard transactionManager={transactionManager} />
              </div>
            )
          }) }
        </div>
      )
    })
  }
    
  return (
    <div>
      { renderTransactions() }
    </div>
  );
}

/**
 * Render a transaction card from current user's perspective
 * @param {string} transactionManager TransactionManager for this transaction 
 */
export function TransactionCard({transactionManager}) {
    
    const [context, setContext] = useState({
      title: "",
      initialBalance: 0,
      currentBanalce: 0,
      allUsers: [],
      settledUsers: [],
      createdAt: null,
      dateString: "",
    });


    useEffect(() => {
      /**
      * Get transaction context from user's perspective
      */
       async function getTransactionContext() {
        const title = await transactionManager.getTitle();
        const transactionUser = await transactionManager.getUser(SessionManager.getUserId());
        const createdAt = await transactionManager.getCreatedAt();
        let allUsers = [];
        let settledUsers = [];
        // Go through tranasctions and pick out all users that aren't current user
        // Also populate "settled" array
        const transactionUsers = await transactionManager.getUsers();
        for (const transactionUser of transactionUsers) {
          if (transactionUser.id !== SessionManager.getUserId()) {
            allUsers.push(transactionUser.id);
          }
          if (transactionUser.getSettled()) {
            settledUsers.push(transactionUser.id);
          }
        }
        allUsers.unshift(SessionManager.getUserId());
        setContext({
          title: title,
          initialBalance: transactionUser.initialBalance,
          currentBalance: transactionUser.currentBalance,
          allUsers: allUsers,
          settledUsers: settledUsers,
          createdAt: createdAt,
          dateString: getDateString(createdAt ? createdAt.toDate() : new Date())
        });
      }

      getTransactionContext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function getFractionTooltip() {
      const amtString = formatter.format(Math.abs(context.currentBalance));
      if (context.initialBalance >= 0 ) {
        return `You are still owed ${amtString}`;
      } else {
        return `You still owe ${amtString}`;
      }
    }

    return (
        <OutlinedCard key={transactionManager.getDocumentId()}>
            <CardActionArea onClick={() => window.location = "/dashboard/transactions?id=" + transactionManager.getDocumentId()}>
                <CardContent>
                    <div className="transaction-card-content d-flex flex-row align-items-center">
                        <div className="side">
                          <AvatarStack ids={context.allUsers} checked={context.settledUsers}/>
                        </div>
                        <div className="center d-flex flex-row overflow-hidden justify-content-center">
                            <div className="d-flex flex-column align-items-center">
                                <Typography variant="h1">{context.title}</Typography>
                                <Typography variant="subtitle1" sx={{ color: "gray "}}>{context.dateString}</Typography>
                            </div>
                        </div>
                        <div className="side">
                            <Tooltip title={getFractionTooltip()}>
                                <div>
                                   <Typography align="right" variant="h5" component="div" color={context.initialBalance < 0 ? "#ec6a60" : "#bfd679"}>{formatter.format(Math.abs(context.currentBalance))}</Typography>
                                   <Typography align="right" variant="subtitle2" component="div" color="lightgrey">/ {formatter.format(Math.abs(context.initialBalance))}</Typography>
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                </CardContent>
            </CardActionArea>
        </OutlinedCard>
    )
}

export function TransactionDetail() {
  const params = new URLSearchParams(window.location.search);
  const transactionId = params.get("id");

  const [transactionData, setTransactionData] = useState({
    title: "",
    total: 0,
    relations: [],
    users: [],
    manager: null,
  });

  useEffect(() => {

    async function fetchTransactionData() {
      // Check if there's an ID
      console.log(transactionId)
      if (!transactionId || transactionId.length <= 0) {
        RouteManager.redirect("/dashboard");
        return;
      }
      const tm = DBManager.getTransactionManager(transactionId);
      await tm.fetchData();
      // Make sure current user is in this transaction's user list
      let foundCurrentUser = false;
      const transactionUsers = await tm.getUsers();
      for (const transactionUser of transactionUsers) {
        if (transactionUser.id === SessionManager.getUserId()) {
          foundCurrentUser = true;
        }
      }
      if (!foundCurrentUser) { 
        // If the current user wasn't found in this transaction's user list, kick them out!
        RouteManager.redirect("/dashboard");
      } else {
        // Otherwise, they're in the right place! Update the transactionData with loaded data
        const title = await tm.getTitle();
        const total = await tm.getTotal();
        const relations = await tm.getRelations();
        const users = await tm.getUsers();
        setTransactionData({
          title: title,
          total: total,
          relations: relations,
          users: users,
          manager: tm
        });
      }
    }

    // Fetch transaction data on load
    fetchTransactionData();
  }, [transactionId])

  // One of the buttons should be different whether or not we owe money in this transaction
  function getPayButtonByRole() {
    // First we find the current user in this transaction
    for (const user of transactionData.users) {
      if (user.id === SessionManager.getUserId()) {
        // We've found the current user
        // Then we check if we're owed money or owe money
        if (user.initialBalance > 0) {
          // Initial balance was positive, so we're owed money
          return <Button variant="contained" color="primary" onClick={() => {}}>Send Reminders</Button>
        } else {
          // Otherwise we ove money
          return <Button variant="contained" color="primary" onClick={() => {}}>Settle my Debts</Button>;
        }
      }
    }
  }

  function handleDelete() {
    transactionData.manager.cleanDelete();
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <Breadcrumbs path={`Dashboard/Transactions/${transactionData.title}`}/>
      <TransactionDetailHeader title={transactionData.title} users={transactionData.users}/>
      <TransactionRelationList relations={transactionData.relations} />
      <div className="d-flex flex-row justify-content-between w-75 m-5">
        {getPayButtonByRole()}
        <Button variant="contained" color="primary" onClick={() => {}}>Go to Conversation</Button>
      </div>
      <Tooltip title="The nuclear option">      
        <Button variant="outlined" color="error" onClick={() => {handleDelete()}}>Delete this Transaction</Button>
      </Tooltip>
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

export function TransactionRelationList({relations}) {
  function mapRelations() {
    return relations.map((relation, index) => {
      return <TransactionRelationCard relation={relation} key={index} />;
    })
  } 
  return (
    <div className="m-5 w-100">
      {mapRelations()}
    </div>
  );
}

function TransactionDetailHeader({title, users}) {

  function getUserIds() {
    let userIds = [];
    for (const user of users) {
      userIds.push(user.id);
    }
    return userIds;
  }

  function getSettledUsers() {
    let settledUsers = [];
    for (const user of users) {
      if (user.settled) {
        settledUsers.push(user.id);
      }
    }
    return settledUsers;
  }

  function getOweString() {
    // First we find the current user in this transaction
    console.log( users)
    for (const user of users) {
      if (user.id === SessionManager.getUserId()) {
        // We've found the current user
        if (user.settled) {
          return <Typography variant="subtitle1" color="primary">You're settled in this transaction!</Typography>
        }
        // Then we check if we're owed money or owe money
        if (user.initialBalance > 0) {
          // Initial balance was positive, so we're owed money
          return <Typography variant="subtitle1">You are still owed {formatter.format(user.currentBalance)}</Typography>
        } else {
          // Otherwise we ove money
          return <Typography variant="subtitle1">You still owe {formatter.format(Math.abs(user.currentBalance))}</Typography>
        }
      }
    }
  }

  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-row justify-content-center">
        <Typography variant="h1">{title}</Typography>
      </div>
      <AvatarStack ids={getUserIds()} checked={getSettledUsers()}/>
      {getOweString()}
    </div>
  )
}