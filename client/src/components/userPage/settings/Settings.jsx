import "./settings.scss"

export default function Settings({ user }) {

    // Redirect or set document title
    if (!user) {
        window.location = "/login";
    } else {
        document.title = "Citrus | Settings";
    }

    return (
      <div className="user-settings" data-testid="user-settings-wrapper">Settings</div>
    )
}
