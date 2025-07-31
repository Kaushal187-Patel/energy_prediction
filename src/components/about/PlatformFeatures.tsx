
import { 
  Brain, 
  BarChart3,
  Database,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const PlatformFeatures = () => {
  const features = [
    {
      icon: Brain,
      title: 'Advanced Machine Learning',
      description: 'Our AI models use Linear Regression and Random Forest algorithms trained on thousands of household energy consumption patterns.',
      details: ['Scikit-learn implementation', '95%+ prediction accuracy', 'Real-time model updates']
    },
    {
      icon: Database,
      title: 'Real-World Data',
      description: 'Built using comprehensive energy consumption datasets from Kaggle, ensuring predictions reflect actual usage patterns.',
      details: ['Kaggle-sourced datasets', 'Household power consumption data', 'Weather and seasonal factors']
    },
    {
      icon: BarChart3,
      title: 'Interactive Analytics',
      description: 'Comprehensive dashboards and visualizations help you understand and optimize your energy consumption.',
      details: ['Real-time charts', 'Historical trend analysis', 'Usage breakdown by appliance']
    },
    {
      icon: Lightbulb,
      title: 'Smart Recommendations',
      description: 'AI-powered insights provide personalized tips to reduce energy consumption and lower costs.',
      details: ['Personalized efficiency tips', 'Peak usage optimization', 'Cost-saving strategies']
    }
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Platform Features</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/8 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20 mr-4">
                  <feature.icon className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-300 mb-6">{feature.description}</p>
              <div className="space-y-2">
                {feature.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-gray-200">{detail}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PlatformFeatures;
