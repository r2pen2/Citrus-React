import "./landingpage.scss"

import down from "../../../assets/images/down.png"
import React from 'react'
import { Typography, Button, Stack } from '@mui/material'

export default function LandingPage() {
  return (
    <div className="landingpage" id="landingpage">
    <div className="column left">
      <div className="left-wrapper">
        <Stack marginLeft="40px" alignItems="left" spacing="20px">
          <Typography variant="h2" className="header">Split payments without the headache.</Typography>
          <Typography variant="p" className="paragraph">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste deserunt quae perferendis non eum voluptates amet ea dolorem repudiandae alias laudantium distinctio maxime eveniet dolor, rerum, earum mollitia, sapiente optio.</Typography>
          <Button variant="contained" component="div" className="button">Get Started</Button>
        </Stack>
      </div>
    </div>
    <div className="column right">
        <a href="#footer">
          <img src={down} alt="down"></img>
        </a>
    </div>
  </div>
  )
}
