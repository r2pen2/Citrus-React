// Style imports
import "./homepage.scss";

// Component imports
import LandingPage from "./landingPage/LandingPage";
import Footer from "./footer/Footer";

export default function Home() {
  return (
    <div className="homepage">
      <LandingPage />
      <Footer />
    </div>
  )
}
