import React from 'react'
import "./transactionCard.scss";
import { OutlinedCard } from "../../../resources/Surfaces";
import { CardContent, CardActionArea, Typography, Stack } from "@mui/material";
import { useState, useEffect } from 'react';
import { getPhotoUrlById, getTransactionById, getDisplayNameById } from "../../../../api/dbManager";
import { getDateString } from "../../../../api/strings";
import formatter from "../../../../api/formatter";
import { userIsFronter, getOtherPayers, getPayerDebt, getPayerCredit } from "../../../../api/transactions";
import { AvatarStack, AvatarStackItem } from "../../../resources/Avatars";

export default function TransactionCard({id, user}) {
    
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

        function renderFronterAvatar(fronter, idx) {
            return <AvatarStackItem userId={fronter.userId} featured={true} index={idx} />
        }

        function renderPayerAvatar(payer, idx) {
            return <AvatarStackItem userId={payer.userId} featured={false} index={idx} />
        }

        if (context) {
            return (
                <AvatarStack>
                    { context.fronters.map((fronter, idx) => {
                        return renderFronterAvatar(fronter, idx);
                    })}
                    { context.payers.map((payer, idx) => {
                        return renderPayerAvatar(payer, idx);
                    }) }
                </AvatarStack>
            )
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
                                <Typography align="right" variant="h5" component="div">{formatter.format(context.debt)}</Typography>
                            </div>
                        </div>
                    </CardContent>
                </CardActionArea>
            </OutlinedCard>
        )
    }
}
