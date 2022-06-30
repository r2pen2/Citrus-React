// Style imports
import "./iou.scss";

// Library imports
import { Component, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Iou({ user }) {
  const [state, setState] = useState({
    step: 1,
  });

  const params = new URLSearchParams(window.location.search);
  const affiliation = params.get("affiliation");

  switch (state.step) {
    case 1:
      return (
        <dif>
          insert IOU form for a transaction with affiliation: {affiliation}
        </dif>
      );
    default:
      return <div>error</div>;
  }
}
