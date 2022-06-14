import "./homepage.scss"
import { Typography, Button, Stack } from '@mui/material'
import LandingPage from "./landingPage/LandingPage"
import Footer from "./footer/Footer"

//<a href="https://www.freepik.com/vectors/liquid-splash">Liquid splash vector created by pikisuperstar - www.freepik.com</a>

export default function Home() {
  return (
    <div className="sections">
      <LandingPage/>
      <Footer />
    </div>
  )
}
