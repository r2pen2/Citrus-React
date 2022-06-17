// Style imports
import "./homepage.scss";

// Component imports
import LandingPage from "./landingPage/LandingPage";
import Footer from "./footer/Footer";

/**
 * Removes unnecessary localStorage registers
 */
function cleanLs() {
  localStorage.removeItem('login:phone_number');
  localStorage.removeItem('login:user_id');
  localStorage.removeItem('login:first_name');
}

export default function Home() {

  cleanLs();

  return (
    <div className="homepage" data-testid="homepage">
      <LandingPage />
      <Footer />
    </div>
  )
}
