import "./loginHome.scss";
import { Button, Typography } from "@mui/material";
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { signInWithGoogle } from "../../../api/firebase";
import GoogleLogo from "../../../assets/images/GoogleLogo.svg";

export default function LoginHome({setUser}) {

  /**
   * Sign user in with google if button is pressed
   * Set localStorage itema and redirect to dashboard
   */
  async function handleSignIn() {
    signInWithGoogle().then((newUser) => {
        setUser(newUser);
        localStorage.setItem("citrus:user", JSON.stringify(newUser));
        window.location = "/dashboard";
    });
  }

  return (
    <div className="login-home" data-testid="login-home">
      <Button data-testid="google-button" className="login-btn"  variant="contained" onClick={() => handleSignIn()}>
        <img src={GoogleLogo} alt="Google Logo"/>
        <Typography marginLeft="10px">Sign in with Google</Typography>
      </Button>
      <Button data-testid="phone-button" className="login-btn" variant="contained" onClick={() => {window.location = "/login/phone"}}>
        <PhoneIphoneIcon/>
        <Typography marginLeft="10px">Sign in with Phone</Typography>
      </Button>
    </div>
  )
}
