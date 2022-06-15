import "./landingpage.scss"

import down from "../../../assets/images/down.png"
import React from 'react'
import { Typography, Button, Stack, IconButton, Tooltip } from '@mui/material'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

function generateArrow(b) {
  return (b ? <a href="#footer"><img src={down} alt="down"></img></a> : <div></div>);
}

export default function LandingPage() {
  return (
    <div className="background-wave">
      <div className="landingpage" id="landingpage">
    <div className="column left">
      <div className="left-wrapper">
        <Stack marginLeft="40px" alignItems="left" spacing="20px">
          <Typography variant="h2" className="header">Split payments without the headache.</Typography>
          <Typography variant="h6" className="paragraph">An app aimed to revolutionize the way you track and split expenses amongst your friends, roommates, and more! Coming soon.</Typography>
          <Button variant="contained" size="large" component="div" className="button" onClick={() => {window.location = "/login"}}>Get Started</Button>
        </Stack>
        <div className="links-container">
            <Stack direction="row" alignItems="center">
              <Typography variant="h5" marginRight="20px" className="unselectable">Come visit us:</Typography>
              <Tooltip title="LinkedIn">
                <IconButton target="_blank" href="https://www.linkedin.com/company/citrus-financial/">
                  <LinkedInIcon fontSize="large" sx={{color: "white" }}/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Instagram">
                <IconButton target="_blank" href="https://www.instagram.com/">
                  <InstagramIcon fontSize="large" sx={{color: "white" }}/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Facebook">
                <IconButton target="_blank" href="https://www.facebook.com/">
                  <FacebookIcon fontSize="large" sx={{color: "white" }}/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Twitter">
                <IconButton target="_blank" href="https://www.twitter.com/">
                  <TwitterIcon fontSize="large" sx={{color: "white" }}/>
                </IconButton>
              </Tooltip>
            </Stack>
          </div>
      </div>
    </div>
    <div className="column right">
      { generateArrow(false) }
    </div>
  </div>
    </div>
  )
}
