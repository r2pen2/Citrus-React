import "./footer.scss";
import { Typography } from '@mui/material'

export default function Footer() {
  return (
    <div className="footer" id="footer">
        <div className="column">
          <Typography variant="h4">PRODUCT</Typography>
          <Typography component="a" href="/">Home</Typography>
          <Typography component="a" href="/features">Features</Typography>
          <Typography component="a" href="/apps">Apps</Typography>
          <Typography component="a" href="/pricing">Pricing</Typography>
          <Typography component="a" href="/faq">FAQs</Typography>
        </div>
        <div className="column">
          <Typography variant="h4">RESOURCES</Typography>
          <Typography component="a" href="/billing">Billing Portal</Typography>
          <Typography component="a" href="/roadmap">Roadmap</Typography>
          <Typography component="a" href="/blog">Blog</Typography>
          <Typography component="a" href="/support">Support</Typography>
          <Typography component="a" href="/status">Status Page</Typography>
        </div>
        <div className="column">
          <Typography variant="h4">LEGAL</Typography>
          <Typography component="a" href="/privacy">Privacy Policy</Typography>
          <Typography component="a" href="/terms">Terms of Use</Typography>
          <Typography component="a" href="/eula">EULA</Typography>
          <Typography component="a" href="/credits">Credits</Typography>
        </div>
    </div>
  )
}
