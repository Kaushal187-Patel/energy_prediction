
import { Card, CardContent } from '@/components/ui/card';

const TechStack = () => {
  const stacks = [
    { category: 'Frontend', tech: ['React.js', 'TypeScript', 'Tailwind CSS', 'Recharts'] },
    { category: 'Backend', tech: ['Flask (Python)', 'REST APIs', 'CORS Setup', 'Data Processing'] },
    { category: 'ML/AI', tech: ['Scikit-learn', 'Pandas', 'NumPy', 'Jupyter Notebooks'] },
    { category: 'Data', tech: ['Kaggle Datasets', 'CSV Processing', 'Feature Engineering', 'Model Export'] }
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Technology Stack</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stacks.map((stack, index) => (
          <Card key={index} className="bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{stack.category}</h3>
              <div className="space-y-2">
                {stack.tech.map((tech, techIndex) => (
                  <div key={techIndex} className="text-gray-700 dark:text-gray-300 text-sm">• {tech}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
