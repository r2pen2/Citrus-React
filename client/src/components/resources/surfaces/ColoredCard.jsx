import React from 'react'
import { Card } from '@mui/material';

function getCardStyle(color) {
    return {
      backgroundColor: color,
      width: "100%",
      borderRadius: "5px",
      marginBottom: "10px",
    };
}

export default function ColoredCard(props) {
  return (
    <Card
          variant="outlined"
          sx={getCardStyle(props.color)}
    >
        {props.children}
    </Card>
  )
}
