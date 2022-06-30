// Style imports
import "./communal.scss";

// Library imports
import { Component, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Communal({ user }) {
  const [state, setState] = useState({
    step: 1,
  });

  const params = new URLSearchParams(window.location.search);
  const affiliation = params.get("affiliation");

  switch (state.step) {
    case 1:
      return (
        <dif>
          insert communal form for a transaction with affiliation: {affiliation}
        </dif>
      );
    default:
      return <div>error</div>;
  }
}
