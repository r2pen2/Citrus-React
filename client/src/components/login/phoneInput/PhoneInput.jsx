import "./phoneinput.scss"
import MuiPhoneNumber from 'material-ui-phone-number';
import { Typography, Button } from "@mui/material"


export default function PhoneInput({ setPage, setPhoneNumber }) {
    function handleOnChange(value) {
        setPhoneNumber(value);
    }

  return (
  <div>  
    <Typography variant="h4" component="div" align="center" paddingTop="20px" sx={{ flexGrow: 1 }}>
        Enter your phone number:
    </Typography>
    <div className="phone-input-container">
        <MuiPhoneNumber defaultCountry={'us'} onChange={handleOnChange}/>,
    </div>
    <div className="login-next-button-container">
        <Button variant="contained" component="div" onClick={() => setPage(2)}>Submit</Button>
    </div>
  </div>
  )
}
