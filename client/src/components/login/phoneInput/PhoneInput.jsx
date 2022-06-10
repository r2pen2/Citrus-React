import "./phoneinput.scss"
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import { Typography, Button } from "@mui/material"


export default function PhoneInput({ setPage }) {
  return (
  <div>  
    <Typography variant="h4" component="div" align="center" paddingTop="20px" sx={{ flexGrow: 1 }}>
        Enter your phone number:
    </Typography>
    <div className="phone-input-container">
        <IntlTelInput
            containerClassName="intl-tel-input"
            inputClassName="form-control"
    />
    </div>
    <div className="login-next-button-container">
        <Button variant="contained" component="div" onClick={() => setPage(1)}>Submit</Button>
    </div>
  </div>
  )
}
