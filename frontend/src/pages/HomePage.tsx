import { HeroSection } from "../components/HeroSection";
import { LatestJobs } from "../components/jobComponents/LatestJobs";
import { AboutUs } from "../components/AboutUs";
import { ContactUsForm } from "../components/ContactUsForm";
import { Tips } from "../components/tips/Tips";

function HomePage() {
  return (
    <>
      <div className="home">
        <HeroSection />
        <LatestJobs />
        <AboutUs />
        <ContactUsForm />
        <Tips />
      </div>
    </>
  );
}
export default HomePage;
