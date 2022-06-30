// Style imports
import "./loadingScreen.scss";

// Component imports
import BottomNav from "../../dashboard/bottomNav/BottomNav";
import Topbar from "../../topbar/Topbar";
import Logo from "../../../assets/images/Logo256.png";

export default function LoadingScreen() {
  return (
    <div>
      <Topbar />
      <div className="logo-container animate-fading">
        <img src={Logo} className="logo"></img>
      </div>
      <BottomNav />
    </div>
  );
}
