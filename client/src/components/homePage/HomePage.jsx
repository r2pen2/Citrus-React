// Component imports
import { Footer, LandingPage } from "../resources/HomePage";

/**
 * Citrus Financial homepage— pretty much just static HTML
 */
export default function Home() {
  return (
    <div className="home-page-wrapper" data-testid="homepage">
      <LandingPage />
      <Footer />
    </div>
  )
}
