import "./transaction.scss";
import React from 'react'
import { Route, Routes } from "react-router-dom"
import { TransactionDetail, TransactionConversation } from "../../resources/Transactions";
import { BrowserManager } from "../../../api/browserManager";

export default function Transaction() {
    // Set up page
    BrowserManager.setTransactionTitleFromURL();

    return (
        <div className="transaction-wrapper">
            <div className="transaction-pane">
                <Routes>
                    <Route path="*" element={<TransactionDetail />}/>
                    <Route path="/conversation" element={<TransactionConversation />}/>
                </Routes>
            </div>
        </div>
  )
}
