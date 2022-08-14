import "./transaction.scss";
import React from 'react'
import { Route, Routes } from "react-router-dom"
import { TransactionDetail, TransactionConversation } from "../../resources/Transactions";
import { getTransactionTitleById } from "../../../api/dbManager";
import { useState } from "react";

/**
 * Set document title to transaction title
 */
    async function doPageSetup() {
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get("id");
    let transactionTitle = await getTransactionTitleById(transactionId);
    document.title = transactionTitle;
}

export default function Transaction({user}) {
    // Set up page
    doPageSetup();

    return (
        <div className="transaction-wrapper">
            <div className="transaction-pane">
                <Routes>
                    <Route path="/" element={<TransactionDetail user={user}/>}/>
                    <Route path="/conversation" element={<TransactionConversation user={user}/>}/>
                </Routes>
            </div>
        </div>
  )
}
