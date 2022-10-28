// Library imports
import React from 'react'
import { Card } from '@mui/material';

export function ColoredCard(props) {
    function getCardStyle(color) {
        return {
          backgroundColor: color,
          width: "100%",
          borderRadius: props.borderRadius ? props.borderRadius : "10px",
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

/**
 * 
 * @param {string} borderStyle border style (solid, dashed, dotted, etc) 
 * @param {string} borderWeight weight of border in pixels 
 * @param {string} borderRadius border radius value 
 * @param {boolean} disableMarginBottom whether or not to disable bottom margin 
 * @param {string} color outline color 
 * @returns 
 */
export function OutlinedCard(props) {
    function getCardStyle() {
        return {
            var: "outlined",
            borderRadius: props.borderRadius ? props.borderRadius : "10px",
            backgroundColor: "white",
            width: "100%",
            marginBottom: props.disableMarginBottom ? "0px" : "10px",
            border: (props.borderWeight ? props.borderWeight : "1px") + " " + (props.borderStyle ? props.borderStyle : "solid") + " " + (props.borderColor ? props.borderColor : "darkgrey"),
            color: props.color ? props.color : "black"
        }
    }
    
    return (
    <Card variant="outlined" sx={getCardStyle()} > 
        {props.children}
    </Card>
  )
}