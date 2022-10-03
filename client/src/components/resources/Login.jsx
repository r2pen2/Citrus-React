import { useState } from 'react'
import Logo from "../../assets/images/Logo256.png";

export function SpinningLogo() {

    function spin() {
        const spinner = document.getElementById("login-logo-spinner");
        spinner.classList.toggle("spin");
    }

    return (
        <div className="login-logo-container" onClick={() => spin()}> 
            <img src={Logo} id="login-logo-spinner" alt="logo" className="logo" data-testid="login-logo"></img>
        </div>
    )
}
