// Style imports
import "./login.scss"

// Library Imports
import { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Stack, Box, Stepper, Step, StepLabel, Paper } from "@mui/material";
import Check from '@mui/icons-material/Check';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'; 
import axios from '../../api/axios';
import { Route, Routes } from "react-router-dom";

// Component Imports
import PhoneInput from "./phoneInput/PhoneInput";
import NewUserForm from "./newUserForm/NewUserForm";
import Authentication from "./authentication/Authentication";
import Logo from "../../assets/images/Logo256.png";

/**
 * Create a styled stepper with the current page selected 
 * @param {Number} p The current page 
 * @returns {Component} A stepper with the correct page selected
 */
function displaySteps(p) {
  
  const steps = [
    'Enter your phone number',
    'Verify your phone number',
    'Sign in',
    'Start splitting payments'
  ];

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

  /**
   * Renders QontoStepIcon based on style props passed
   * @param {Object} props props for stepIcon
   * @returns {QontoStepIconRoot} styled step icon
   */
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

  if (p >= 0) {
    return (
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={p} alternativeLabel connector={<QontoConnector />}>
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

/**
 * Sign-in a user by their ID
 * @param {Number} id userID returned from password input
 * @returns {State} user is logged in and redirected to dashboard
 */
function setUserById(id) {
  axios.post("/database/get-user-by-id", { id: id }).then((res) => {
    if (res.data) {
      localStorage.setItem("user", JSON.stringify(res.data));
      window.location = "/dashboard"
    }
  })
}

/**
 * If we're signed in, redirect to dashboard.
 * Othwerwise, set the document title and continue to login.
 * @param {Object} user The current user (if it exists)
 * @returns {State} Either a redirect or continues with login
 */
function doPageSetup(user) {
  if (user) {
    window.location = "/dashboard";
  }
  document.title = "Citrus | Login";
}

/**
 * returns page index based on window.location
 * @param {String} l window location
 * @returns {Number} page index
 */
function getPageIndex(l) {
  if (l.includes("/authentication")) {
    return 1;
  } else if (l.includes("/password-entry") || l.includes("/account-creation")) {
    return 2;
  } else {
    return 0;
  }
}

export default function Login({ user }) {
  
  // Page setup
  doPageSetup(user)

  // Define constants
  const [page, setPage] = useState(getPageIndex(window.location.toString()));   // The current login page (ex. Phone Input, Auth Code Input...)
  const [phoneNumber, setPhoneNumber] = useState("");                           // The current user's phone number
  const [phoneString, setPhoneString] = useState("");                           // A stylized string representation of the current user's phone number

  return (
    <div className="background-controller">
      <Paper className="login-content" elevation={12} sx={{ backgroundColor: '#fafafa', borderRadius: "10px"}}>
        <Stack spacing={3} alignItems="center" justifyContent="center">
          <div className="login-logo-container"> 
            <img src={Logo} alt="logo" className="logo"></img>
          </div>
          <Routes>
            <Route path="/" element={<PhoneInput />}/>
            <Route path="/phone-number" element={<PhoneInput />}/>
            <Route path="/authentication/*" element={<Authentication setUserById={setUserById}/>}/>
            <Route path="/account-creation" element={<NewUserForm setUserById={setUserById}/>}/>
          </Routes>
        </Stack>
      </Paper>
      <div className="stepper-wrapper">
        { displaySteps(page) }
      </div>
    </div>
  );
}
