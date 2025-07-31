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
        <HeroSection data-aos="fade-up" data-aos-duration="1000" />
        <DatasetInfo data-aos="fade-up" data-aos-duration="1000" />
        <MLModels data-aos="fade-up" data-aos-duration="1000" />
        <PlatformFeatures data-aos="fade-up" data-aos-duration="1000" />
        <ProcessFlow data-aos="fade-up" data-aos-duration="1000" />
        <TechStack data-aos="fade-up" data-aos-duration="1000" />
        <PlatformStats data-aos="fade-up" data-aos-duration="1000" />
      </div>
    </div>
  );
};

export default About;
