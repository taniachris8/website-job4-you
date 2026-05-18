import { HeroSection } from "../../components/hero-section/HeroSection";
import { LatestJobs } from "../../components/job-components/latest-jobs/LatestJobs";

import { AboutUs } from "../../components/about-us/AboutUs";
import { ContactUsForm } from "../../components/contact-us-form/ContactUsForm";
import { Tips } from "../../components/tips/tips/Tips";
import { useAppSelector } from "../../store/hooks";

function HomePage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <>
      <div className="home">
        <HeroSection />
        <LatestJobs />
        <AboutUs />
        {user?.role !== "admin" && <ContactUsForm />}
        <Tips />
      </div>
    </>
  );
}
export default HomePage;
