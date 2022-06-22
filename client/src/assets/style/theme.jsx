import { createTheme } from "@mui/material/styles";

export default createTheme({
  // declare re-used variables
  palette: {
    type: "light",
    citrusGreen: {
      main: "#B0C856CC",
    },
    citrusYellow: {
      main: "#F2DF56CC",
    },
    citrusOrange: {
      main: "#FDB90F",
    },
    citrusPink: {
      main: "#F4A09A",
    },
    citrusRed: {
      main: "#EA4236",
    },
    citrusTan: {
      main: "#FDB90F33",
    },
    background: {
      main: "#E5E5E5",
    },
    primary: {
      main: "#B0C856CC", // aka citrusGreen
    },
    secondary: {
      main: "#FDB90F", // aka citrusOrange
    },
    error: {
      main: "#EA4236", // aka citrusRed
    },
    success: {
      main: "#B0C856CC", // aka citrusGreen
    },
    warning: {
      main: "#FDB90F", // aka citrusOrange
    },
    info: {
      main: "#F2DF56CC", // aka citrusYellow
    },
  },
});
