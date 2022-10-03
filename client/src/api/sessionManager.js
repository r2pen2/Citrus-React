export class SessionManager {

    static getUser() {
        return JSON.parse(localStorage.getItem("citrus:user"));
    }

    static setUser(user) {
        localStorage.setItem("citrus:user", JSON.stringify(user));
    }

    static getPfpUrl() {
        return localStorage.getItem("citrus:pfpUrl");
    }

    static setPfpUrl(pfpUrl) {
        localStorage.setItem("citrus:pfpUrl", pfpUrl);
    }

    static getDisplayName() {
        return localStorage.getItem("citrus:displayName");
    }

    static setDisplayName(displayName) {
        localStorage.setItem("citrus:displayName", displayName);
    }

    static log() {
        const jsonObject = {
            user: this.getUser(),
            pfpUrl: this.getPfpUrl(),
            displayName: this.getDisplayName()
        }
        console.log(jsonObject);
    }

    static LSExists() {
        return localStorage.getItem("citrus:user") ? true : false;
    }

    static clearLS() {
        localStorage.removeItem("citrus:session");
    }
}