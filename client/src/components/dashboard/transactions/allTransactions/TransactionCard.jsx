import React from 'react'
import { OutlinedCard } from "../../../resources/Surfaces";
import { CardContent, CardActionArea, Typography, Stack, Avatar } from "@mui/material";
import { useState, useEffect } from 'react';
import { getPhotoUrlById, getTransactionById } from "../../../../api/dbManager";
import formatter from "../../../../api/formatter";

export default function TransactionCard({id, user}) {
    
    const [context, setContext] = useState(null);
    const [partnerPhoto, setPartnerPhoto] = useState("")

    async function fetchPartnerPhoto() {
        if (context) {
            let url = await getPhotoUrlById(context.partner)
            setPartnerPhoto(url);
        }
    }

    /**
    * Get's an object represesnting a transaction from the current user's perspective
    * @param {String} transactionId transaction id to get context for
    * @returns {Object} transaction from current user's perspective
    */
    async function getTransactionContext(transactionId) {
        let transaction = await getTransactionById(transactionId);
        if (transaction.user1 === user.uid) {
            setContext({
                title: transaction.title,
                partner: transaction.user2,
                debt: transaction.debt1 - transaction.debt2 
            })
          } else {
            setContext({
                title: transaction.title,
                partner: transaction.user1,
                debt: transaction.debt2 - transaction.debt1 
            })
        }
    }

    useEffect(() => {
        fetchPartnerPhoto();
    }, [context]);

    useEffect(() => {
        getTransactionContext(id);
    }, [])

    if (context) {
        return (
            <OutlinedCard>
                <CardActionArea>
                    <CardContent>
                        <div className="transaction-content">
                            <div className="left">                    
                                <Avatar src={partnerPhoto} className="transaction-avatar"/>
                            </div>
                            <div className="center">
                                <div className="title">
                                    {context.title}
                                </div>
                            </div>
                            <div className="right">
                                <div className="amount">
                                    {formatter.format(context.debt)}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </CardActionArea>
            </OutlinedCard>
        )
    } else {
        return <div></div>
    }
}
