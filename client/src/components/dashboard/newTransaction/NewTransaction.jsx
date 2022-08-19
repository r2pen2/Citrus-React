// Style imports
import "./newtransaction.scss";

// Library imports;
import { Typography, Paper, Select, Tabs, Tab, Box, FormControl, MenuItem, InputLabel } from "@mui/material";
import { useState } from 'react';

// Component Imports
import Split from "./pages/Split";
import IOU from "./pages/IOU";

export default function NewTransaction({ user }) {
  const [tabValue, setTabValue] = useState(0);

  function sendTransactionToDatabase() {
    console.log("Sending transaction to database!")
  }

  function handleChangeTab(e, newValue) {
    setTabValue(newValue);
  }

  function renderTab() {
    if (tabValue === 0) {
      return (
        <Split/>
      )
    }
    if (tabValue === 1) {
      return (
        <IOU/>
      )
    } else {
      return <div>Error: Invalid tab ID</div>
    }
  }
  
  return (
    <div className="new-transaction-wrapper">
      <Paper className="new-transaction-content" elevation={12} sx={{ backgroundColor: '#fafafa', borderRadius: "10px"}}>
        <div className="tab-container">
          <Tabs variant="fullWidth" className="tabs" value={tabValue} onChange={handleChangeTab} aria-label="new transaction tabs">
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
