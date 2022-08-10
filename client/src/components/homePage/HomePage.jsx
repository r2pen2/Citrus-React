// Style imports
import "./homePage.scss";

// Component imports
import LandingPage from "./landingPage/LandingPage";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="homepage" data-testid="homepage">
      <LandingPage />
      <Footer />
    </div>
  )
}
