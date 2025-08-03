import DatasetInfo from "../components/about/DatasetInfo";
import HeroSection from "../components/about/HeroSection";
import MLModels from "../components/about/MLModels";
import PlatformFeatures from "../components/about/PlatformFeatures";
import PlatformStats from "../components/about/PlatformStats";
import ProcessFlow from "../components/about/ProcessFlow";
import TechStack from "../components/about/TechStack";

const About = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div data-aos="fade-up" data-aos-duration="1000">
          <HeroSection />
        </div>
        <div data-aos="fade-up" data-aos-duration="1000">
          <DatasetInfo />
        </div>
        <div data-aos="fade-up" data-aos-duration="1000">
          <MLModels />
        </div>
        <div data-aos="fade-up" data-aos-duration="1000">
          <PlatformFeatures />
        </div>
        <div data-aos="fade-up" data-aos-duration="1000">
          <ProcessFlow />
        </div>
        <div data-aos="fade-up" data-aos-duration="1000">
          <TechStack />
        </div>
        <div data-aos="fade-up" data-aos-duration="1000">
          <PlatformStats />
        </div>
      </div>
    </div>
  );
};

export default About;
