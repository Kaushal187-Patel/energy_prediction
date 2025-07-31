
import { Brain, Database, TrendingUp, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ProcessFlow = () => {
  const steps = [
    { step: '1', title: 'Data Input', description: 'Enter home details like temperature, time, appliances', icon: Database },
    { step: '2', title: 'AI Processing', description: 'Machine learning models analyze patterns and relationships', icon: Brain },
    { step: '3', title: 'Prediction', description: 'Generate accurate energy consumption forecast', icon: TrendingUp },
    { step: '4', title: 'Recommendations', description: 'Provide personalized efficiency tips and savings', icon: Lightbulb }
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">How Predictions Work</h2>
      <div className="grid md:grid-cols-4 gap-6">
        {steps.map((item, index) => (
          <Card key={index} className="bg-white/5 border-white/10 text-center">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg mb-4">
                {item.step}
              </div>
              <div className="mb-4">
                <item.icon className="h-8 w-8 text-green-400 mx-auto" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-300 text-sm">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProcessFlow;
