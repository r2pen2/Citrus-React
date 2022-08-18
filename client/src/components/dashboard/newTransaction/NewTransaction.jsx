// Style imports
import "./newtransaction.scss";

// Library imports;
import { Typography, Paper, TabPanel, Tabs, Tab, Box } from "@mui/material";
import { useState } from 'react';

export default function NewTransaction({ user }) {

  const [title, setTitle] = useState(null);
  const [payers, setPayers] = useState(null);
  const [fronters, setFronters] = useState(null);
  const [amount, setAmount] = useState(null);
  const [submitEnable, setSubmitEnable] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  function sendTransactionToDatabase() {
    console.log("Sending transaction to database!")
  }

  function handleChange(e, newValue) {
    setTabValue(newValue);
  }

  function renderTab() {
    if (tabValue === 0) {
      return (
        <div>
          
        </div>
      )
    }
    if (tabValue === 1) {
      return (
        <div>IOU</div>
      )
    } else {
      return <div>Error: Invalid tab ID</div>
    }
  }
  
  return (
    <div className="new-transaction-wrapper">
      <Paper className="new-transaction-content" elevation={12} sx={{ backgroundColor: '#fafafa', borderRadius: "10px"}}>
        <div className="tab-container">
          <Tabs variant="fullWidth" className="tabs" value={tabValue} onChange={handleChange} aria-label="new transaction tabs">
            <Tab className="tab-item left" label="Split" />
            <Tab className="tab-item" label="IOU"/>
          </Tabs>
        </div>  
        <div className="tab-content">
          { renderTab() }
        </div>
      </Paper>
    </div>
  );
}
