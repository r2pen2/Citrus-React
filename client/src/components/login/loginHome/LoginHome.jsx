import "./loginHome.scss";
import { Button, Typography } from "@mui/material";
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { signInWithGoogle } from "../../../api/firebase";
import GoogleLogo from "../../../assets/images/GoogleLogo.svg";

export default function LoginHome({setUser}) {

  async function handleSignIn() {
    signInWithGoogle().then((newUser) => {
        setUser(newUser);
        localStorage.setItem("citrus:user", JSON.stringify(newUser));
        window.location = "/dashboard";
    });
  }

  return (
    <div className="login-home">
      <Button className="login-btn"  variant="contained" onClick={() => handleSignIn()}>
        <img src={GoogleLogo} alt="Google Logo"/>
        <Typography marginLeft="10px">Sign in with Google</Typography>
      </Button>
      <Button className="login-btn" variant="contained" onClick={() => {window.location = "/login/phone"}}>
        <PhoneIphoneIcon/>
        <Typography marginLeft="10px">Sign in with Phone</Typography>
      </Button>
    </div>
  )
}
