import React from 'react'
import { OutlinedCard } from "../../../resources/Surfaces";
import { CardContent, CardActionArea, Typography, Stack, Avatar, Tooltip } from "@mui/material";
import { useState, useEffect } from 'react';
import { getPhotoUrlById, getTransactionById, getDisplayNameById } from "../../../../api/dbManager";
import { getDateString } from "../../../../api/strings";
import formatter from "../../../../api/formatter";

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
        if (transaction.user1 === user.uid) {
            setContext({
                title: transaction.title,
                partner: transaction.user2,
                debt: transaction.debt1 - transaction.debt2, 
                date: transaction.createdAt
            })
          } else {
            setContext({
                title: transaction.title,
                partner: transaction.user1,
                debt: transaction.debt2 - transaction.debt1 ,
                date: transaction.createdAt
            })
        }
    }

    useEffect(() => {
        fetchPartnerDetails();
    }, [context]);

    useEffect(() => {
        getTransactionContext();
    }, [])

    if (context) {
        return (
            <OutlinedCard>
                <CardActionArea onClick={() => window.location = "/dashboard/transactions/detail?id=" + id}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Stack direction="row" alignItems="center" component="div">
                                <Tooltip title={partnerName}>
                                    <Avatar sx={{ marginRight: "10px" }} src={partnerPhoto} />
                                </Tooltip>
                                <Stack direction="column" alignItems="left" align="left">
                                    <Typography variant="h6" component="div">{context.title}</Typography>
                                    <Typography variant="subtitle1" component="div" sx={{ color: "gray "}}>{getDateString(context.date.toDate())}</Typography>
                                </Stack>
                            </Stack>
                            <Typography align="right" variant="h5" component="div">{formatter.format(context.debt)}</Typography>
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </OutlinedCard>
        )
    } else {
        return <div></div>
    }
}
