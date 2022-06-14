export default function LoginRedirect({ user }) {
    if (user) {
        window.location = "/dashboard"
    } else {
        window.location = "/login"
    }
}
