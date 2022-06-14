import React from 'react'

export default function LoginRedirect({ signedIn }) {
    if (signedIn) {
        window.location = "/dashboard"
    } else {
        window.location = "/login"
    }
}
