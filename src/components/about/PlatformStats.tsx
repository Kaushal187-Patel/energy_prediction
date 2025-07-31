
const PlatformStats = () => {
  const stats = [
    { value: '95%', label: 'Prediction Accuracy' },
    { value: '15K+', label: 'Homes Analyzed' },
    { value: '40%', label: 'Average Savings' },
    { value: '2.4M', label: 'kWh Optimized' }
  ];

  return (
    <section className="text-center">
      <div className="glass-morphism rounded-2xl p-12">
        <h2 className="text-3xl font-bold text-white mb-8">Platform Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-bold text-green-400 mb-2">{stat.value}</div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformStats;
