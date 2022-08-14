// Style imports
import "./newtransaction.scss";

// Library imports;
import { Typography, Paper, Button, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useState } from 'react';

export default function NewTransaction({ user }) {

  const [title, setTitle] = useState(null);
  const [payers, setPayers] = useState(null);
  const [fronters, setFronters] = useState(null);
  const [amount, setAmount] = useState(null);
  const [submitEnable, setSubmitEnable] = useState(false);
  const [transactionTab, setTransactionTab] = useState("Split");

  function sendTransactionToDatabase() {
    console.log("Sending transaction to database!")
  }

  function renderTransactionWindow() {
    return <div>Test</div>
  }

  return (
    <div className="new-transaction-wrapper">
      <Paper className="new-transaction-content" elevation={12} sx={{ backgroundColor: '#fafafa', borderRadius: "10px"}}>
        <div className="tab-container">
          <div className="tab-selector">
            Split
          </div>
          <div className="tab-selector">
            IOU
          </div>
        </div>
        { renderTransactionWindow() }
      </Paper>
    </div>
  );
}
