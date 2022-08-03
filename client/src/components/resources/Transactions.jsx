import "./resources.scss";
import { CircularProgress, Typography, CardContent, CardActionArea, Tooltip } from '@mui/material';
import { useState, useEffect} from 'react';
import { getActiveTransactionsByUserId, getPhotoUrlById, getTransactionById, getDisplayNameById } from "../../api/dbManager"
import React from 'react'
import { OutlinedCard } from "./Surfaces";
import { getDateString } from "../../api/strings";
import formatter from "../../api/formatter";
import { userIsFronter, getOtherPayers, getPayerDebt, getPayerCredit } from "../../api/transactions";
import { AvatarStack, AvatarStackItem } from "./Avatars";

export function TransactionList(props) {
    
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
              <div className="fill-line" />
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
        <div className="transaction-list">
            { renderTransactions(activeTransactions) }
        </div>
        );
}

export function TransactionCard({id, user}) {
    
    const [context, setContext] = useState(null);
    const [partnerPhoto, setPartnerPhoto] = useState("");
    const [partnerName, setPartnerName] = useState("");

    /**
     * Fetches partner details from database for avatar + tooltip
     */
    async function fetchPartnerDetails() {
        if (context) {
            let url = await getPhotoUrlById(context.partner)
            setPartnerPhoto(url);
            let name = await getDisplayNameById(context.partner)
            setPartnerName(name);
        }
    }

    /**
    * Get's an object represesnting a transaction from the current user's perspective
    * @returns {Object} transaction from current user's perspective
    */
    async function getTransactionContext() {

        let transaction = await getTransactionById(id);
        if (userIsFronter(transaction, user.uid)) {
            setContext({
                role: "fronter",
                title: transaction.title,
                fronters: transaction.fronters,
                payers: transaction.payers,
                debt: null,
                credit: null,
                date: transaction.createdAt,
            })
        } else {
            setContext({
                role: "payer",
                title: transaction.title,
                fronters: transaction.fronters,
                payers: getOtherPayers(transaction, user.uid),
                debt: getPayerDebt(transaction, user.uid),
                credit: getPayerCredit(transaction, user.uid),
                date: transaction.createdAt,
            })
        }
    }

    useEffect(() => {
        fetchPartnerDetails();
    }, [context]);

    useEffect(() => {
        getTransactionContext();
    }, [])

    function renderAvatarStack() {

        if (context) {

            var fronterIds = [];
            var payerIds = [];
            for (const fronter of context.fronters) {
                fronterIds.push(fronter.userId);
            }
            for (const payer of context.payers) {
                payerIds.push(payer.userId);
            }

            return (
                <AvatarStack featured={fronterIds} secondary={payerIds} />
            )
        }
    }

    function generateDebtTooltip() {
        if (context) {
            if (context.role === "payer") {
                return "You still owe " + formatter.format(context.debt - context.credit) + " in this transaction.";
            }
        }
    }

    if (context) {
        console.log(context);
        return (
            <OutlinedCard>
                <CardActionArea onClick={() => window.location = "/dashboard/transactions/detail?id=" + id}>
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
                                       <Typography align="right" variant="h5" component="div" color={context.debt > 0 ? "#ec6a60" : "#bfd679"}>{formatter.format(context.debt - context.credit)}</Typography>
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
