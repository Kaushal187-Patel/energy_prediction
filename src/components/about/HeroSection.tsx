
import { Brain } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-6">
        <Brain className="h-4 w-4 mr-2" />
        Real Kaggle Dataset Integration
      </div>
      <h1 className="text-5xl font-bold text-white mb-6">
        How It <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Works</span>
      </h1>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto">
        Our platform combines cutting-edge machine learning with real-world energy data 
        to deliver the most accurate consumption predictions and personalized efficiency recommendations.
      </p>
    </div>
  );
};

export default HeroSection;
