// Style imports
import "./homepage.scss";

// Component imports
import LandingPage from "./landingPage/LandingPage";
import Footer from "./footer/Footer";

/**
 * Remove unnecessary local storage registries
 */
function cleanLS() {
  localStorage.removeItem('login:phone_number');
}

export default function Home() {

  cleanLS();

  return (
    <div className="homepage">
      <LandingPage />
      <Footer />
    </div>
  )
}
