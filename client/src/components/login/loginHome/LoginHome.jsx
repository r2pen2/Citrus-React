import "./loginhome.scss"
import { Typography, Button } from "@mui/material"

export default function LoginHome({ setPage }) {
  return (
  <div>
    <Typography variant="h4" component="div" align="center" paddingTop="20px" sx={{ flexGrow: 1 }}>
        Track and Split Bills
    </Typography>
    <div className="login-next-button-container">
        <Button variant="contained" component="div" onClick={() => setPage(1)}>Get Started</Button>
    </div>
  </div>
  )
}
