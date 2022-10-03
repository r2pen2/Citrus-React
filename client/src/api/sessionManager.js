export class SessionManager {

    /**
     * Get user object saved in localStorage
     * @returns user object or null
     */
    static getUser() {
        return JSON.parse(localStorage.getItem("citrus:user"));
    }

    /**
     * Set user object saved in localStorage
     */
    static setUser(user) {
        localStorage.setItem("citrus:user", JSON.stringify(user));
    }

    /**
     * Get profile picture URL saved in localStorage
     * @returns profile picture URL or empty string
     */
    static getPfpUrl() {
        return localStorage.getItem("citrus:pfpUrl") ? localStorage.getItem("citrus:pfpUrl") : "";
    }

    /**
     * Set profile picture URL saved in localStorage
     */
    static setPfpUrl(pfpUrl) {
        localStorage.setItem("citrus:pfpUrl", pfpUrl);
    }

    /**
     * Get display name saved in localStorage
     * @returns display name or empty string
     */
    static getDisplayName() {
        return localStorage.getItem("citrus:displayName") ? localStorage.getItem("citrus:displayName") : "";
    }

    /**
     * Set display name saved in localStorage
     */
    static setDisplayName(displayName) {
        localStorage.setItem("citrus:displayName", displayName);
    }

    /**
    * Get debug mode setting saved in localStorage
    * @returns debug mode setting
    */
    static getDebugMode() {
        return JSON.parse(localStorage.getItem("citrus:debug"));
    }

    /**
    * Set debug mode setting saved in localStorage
    */
    static setDebugMode(debugMode) {
        localStorage.setItem("citrus:debug", JSON.stringify(debugMode));
    }

    /**
     * Check whether or not a user is saved in LS
     * @returns whether or not there is a user stored in LS
     */
    static userInLS() {
        return localStorage.getItem("citrus:user") ? true : false;
    }

    /**
     * Clear all citrus related localstorage keys
     */
    static clearLS() {
        localStorage.removeItem("citrus:user");
        localStorage.removeItem("citrus:debug");
        localStorage.removeItem("citrus:pfpUrl");
        localStorage.removeItem("citrus:displayName");
    }

    /**
     * Get a JSON representation of current citrus localStorage.
     * This is for debugging
     * @returns JSON representation of localStorage
     */
    static getJSON() {
        return {
            user: this.getUser(),
            pfpUrl: this.getPfpUrl(),
            displayName: this.getDisplayName(),
            debugMode: this.getDebugMode()
        }
    }
}