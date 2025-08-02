
import { Card, CardContent } from '@/components/ui/card';

const MLModels = () => {
  const models = [
    {
      name: 'Linear Regression',
      description: 'Baseline linear model for energy consumption prediction',
      accuracy: '85.2%',
      use_case: 'Simple trend analysis and baseline predictions'
    },
    {
      name: 'Ridge Regression',
      description: 'L2 regularized linear model preventing overfitting',
      accuracy: '85.2%',
      use_case: 'Stable predictions with regularization'
    },
    {
      name: 'Lasso Regression',
      description: 'L1 regularized model with automatic feature selection',
      accuracy: '85.2%',
      use_case: 'Feature selection and sparse modeling'
    },
    {
      name: 'Random Forest',
      description: 'Ensemble of decision trees for complex pattern recognition',
      accuracy: '87.6%',
      use_case: 'Non-linear relationships and feature importance'
    },
    {
      name: 'Gradient Boosting',
      description: 'Advanced ensemble method with sequential learning',
      accuracy: '88.6%',
      use_case: 'Highest accuracy predictions and complex patterns'
    }
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Machine Learning Models</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model, index) => (
          <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/8 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">{model.name}</h3>
                <div className="text-green-400 text-2xl font-bold">{model.accuracy}</div>
              </div>
              <p className="text-gray-300 mb-4">{model.description}</p>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Best for:</div>
                <div className="text-white font-medium">{model.use_case}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default MLModels;
