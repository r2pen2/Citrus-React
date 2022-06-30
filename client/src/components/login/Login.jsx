// Style imports
import "./login.scss"

// Library Imports
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Stack, Box, Stepper, Step, StepLabel, Paper } from "@mui/material";
import Check from '@mui/icons-material/Check';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'; 
import { Route, Routes } from "react-router-dom";
import { useState } from "react"; 

// Component Imports
import Phone from "./phone/Phone";
import NewUserForm from "./newUserForm/NewUserForm";
import LoginHome from "./loginHome/LoginHome";
import Logo from "../../assets/images/Logo256.png";

/**
 * Create a styled stepper with the current page selected 
 * @param {Number} p The current page 
 * @returns {Component} A stepper with the correct page selected
 */
function displaySteps() {

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

    /**
   * returns page index based on window.location
   * @param {String} l window location
   * @returns {Number} page index
   */
  function getPageIndex() {
    const l = window.location.toString();
    if (l.includes("/")) {
      return 1;
    } else if (l.includes("/password-entry") || l.includes("/account-creation")) {
      return 2;
    } else {
      return 0;
    }
  }

  const p = getPageIndex();
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
 * Set the document title or redirect to dashboard
 * @param {Object} user current user
 */
function doPageSetup(user) { 
  if (user) {
    window.location = "/dashboard";
  } else {
    document.title = "Citrus | Login";
  }
}

export default function Login({ user, setUser }) {
  
  // Page setup
  doPageSetup(user)

  return (
    <div className="background-controller" data-testid="login-background-controller">
      <Paper className="login-content" elevation={12} sx={{ backgroundColor: '#fafafa', borderRadius: "10px"}}>
        <Stack spacing={3} alignItems="center" justifyContent="center">
          <div className="login-logo-container"> 
            <img src={Logo} alt="logo" className="logo" data-testid="login-logo"></img>
          </div>
          <div className="login-input-window">
            <Routes>
              <Route path="/" element={<LoginHome setUser={setUser}/>}/>
              <Route path="/home" element={<LoginHome setUser={setUser}/>}/>
              <Route path="/phone" element={<Phone setUser={setUser}/>}/>
              <Route path="/account-creation" element={<NewUserForm user={user} setUser={setUser}/>}/>
            </Routes>
          </div>
        </Stack>
      </Paper>
      <div className="stepper-wrapper">
        { displaySteps() }
      </div>
    </div>
  );
}
