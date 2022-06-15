// Imports
import "./login.scss"
import { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Stack, Box, Stepper, Step, StepLabel, Paper } from "@mui/material";
import Check from '@mui/icons-material/Check';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector' 
import logo from "../../assets/images/Logo256.png";
import axios from '../../api/axios'
import LoginHome from "./loginHome/LoginHome";
import PhoneInput from "./phoneInput/PhoneInput";
import AuthCodeInput from "./authCodeInput/AuthCodeInput";
import PasswordEntry from "./passwordEntry/PasswordEntry";

// Styling for Stepper
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#784af4',
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

// Stepper Logic
function displaySteps(p) {
  const steps = [
    'Enter your phone number',
    'Verify your phone number',
    'Sign in',
    'Start splitting payments'
  ];

  if (p > 0) {
    return (
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={p-1} alternativeLabel connector={<QontoConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={QontoStepIcon} >{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    );
  }
}

// Database-related functions
function setUserById(id) {
  axios.post("/database/get-user-by-id", { id: id }).then((res) => {
    if (res.data) {
      localStorage.setItem("user", JSON.stringify(res.data));
      window.location = "/dashboard"
    }
  })
}

function findUserByPhoneNumber(num) {
  console.log("Checking if user is in database...");
    try {
      axios.post("/database/get-user-by-number", { phoneNumber: num }).then((res) => {
        console.log(res)
      });
    } catch (err) {
      console.log(err);
    }
}


// Export Function
export default function Login({ user }) {

  const signedIn = user ? true : false;

  // Redirect to dashboard if we're signed in
  if (signedIn) {
   window.location = "/dashboard";
  }

  const [page, setPage] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneString, setPhoneString] = useState("");

  document.title = "Citrus | Login";

  function getLoginPage(page) {
    switch (page) {
      case 0:
        return <LoginHome setPage={setPage} />;
      case 1:
        return <PhoneInput setPage={setPage} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} setPhoneString={setPhoneString}/>;
      case 2:
        return <AuthCodeInput setPage={setPage} phoneNumber={phoneNumber} findUser={findUserByPhoneNumber}/>;
      case 3:
        return <PasswordEntry phoneNumber={phoneNumber} user={user} setUserById={setUserById}/>;
      default:
        return <div>Error 404: Page not found</div>;
    }
  }

  return (
    <div className="background-controller">
      <Paper className="login-content" elevation={12} sx={{ backgroundColor: '#fafafa', borderRadius: "10px"}}>
        <Stack spacing={3} alignItems="center" justifyContent="center">
          <div className="login-logo-container"> 
            <img src={logo} alt="logo" className="logo"></img>
          </div>
          { getLoginPage(page) }
        </Stack>
      </Paper>
      <div className="stepper-wrapper">
        { displaySteps(page) }
      </div>
    </div>
  )
}
