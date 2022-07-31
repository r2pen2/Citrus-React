import React from 'react'
import { Card } from '@mui/material';

export function ColoredCard(props) {
    function getCardStyle(color) {
        return {
          backgroundColor: color,
          width: "100%",
          borderRadius: "5px",
          marginBottom: "10px",
        };
    }

  return (
    <Card
          data-testid={"colored-card-" + props.color}
          variant="outlined"
          sx={getCardStyle(props.color)}
    >
        {props.children}
    </Card>
  )
}


export function OutlinedCard(props) {
    function getCardStyle() {
        return {
            var: "outlined",
            borderRadius: "5px",
            backgroundColor: "white",
            marginBottom: "10px"
        }
    }
    
    return (
    <Card variant="outlined" sx={getCardStyle()} > 
        {props.children}
    </Card>
  )
}
