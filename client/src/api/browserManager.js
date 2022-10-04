import { Debugger } from "./debugger";

const browserManagerDebugger = new Debugger(Debugger.controllerObjects.BROWSERMANAGER);

export class BrowserManager {
    static setTitle(pageTitle) {    
        browserManagerDebugger.logWithPrefix("Setting document title to Citrus | " + pageTitle);
        document.title = "Citrus | " + pageTitle;
    }

    static setTitleNoPrefix(pageTitle) {
        browserManagerDebugger.logWithPrefix("Setting document title to " + pageTitle);
        document.title = pageTitle;
    }
}