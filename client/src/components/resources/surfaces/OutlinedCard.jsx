import React from 'react'

import { Card } from '@mui/material';

function getCardStyle() {
    return {
        var: "outlined",
        borderRadius: "5px",
        backgroundColor: "white",
        marginBottom: "10px"
    }
}

export default function OutlinedCard(props) {
  return (
    <Card variant="outlined" sx={getCardStyle()} > 
        {props.children}
    </Card>
  )
}
