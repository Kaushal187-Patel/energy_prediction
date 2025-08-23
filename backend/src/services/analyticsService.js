class AnalyticsService {
  calculateEfficiencyScore(predictions) {
    if (!predictions.length) return 0;
    
    const avgConsumption = predictions.reduce((sum, p) => sum + p.predicted_consumption, 0) / predictions.length;
    const benchmark = 150; // kWh baseline
    
    return Math.max(0, Math.min(100, 100 - ((avgConsumption - benchmark) / benchmark) * 100));
  }

  detectAnomalies(predictions, threshold = 2) {
    if (predictions.length < 3) return [];
    
    const values = predictions.map(p => p.predicted_consumption);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
    
    return predictions.filter(p => 
      Math.abs(p.predicted_consumption - mean) > threshold * stdDev
    );
  }

  generateInsights(predictions, weather) {
    const insights = [];
    
    if (predictions.length > 0) {
      const latest = predictions[0];
      const efficiency = this.calculateEfficiencyScore(predictions);
      
      if (efficiency < 60) {
        insights.push({
          type: 'warning',
          title: 'Low Efficiency Detected',
          message: `Your energy efficiency score is ${efficiency.toFixed(1)}%. Consider optimizing device usage.`,
          priority: 'high'
        });
      }
      
      if (weather && weather.temperature > 30) {
        insights.push({
          type: 'tip',
          title: 'Hot Weather Alert',
          message: 'High temperatures detected. Consider setting AC to 24°C to save energy.',
          priority: 'medium'
        });
      }
      
      const anomalies = this.detectAnomalies(predictions);
      if (anomalies.length > 0) {
        insights.push({
          type: 'alert',
          title: 'Unusual Usage Pattern',
          message: `${anomalies.length} anomalous consumption patterns detected in recent predictions.`,
          priority: 'high'
        });
      }
    }
    
    return insights;
  }

  calculateCarbonFootprint(consumption, region = 'US') {
    const emissionFactors = {
      'US': 0.4, // kg CO2 per kWh
      'EU': 0.3,
      'IN': 0.8,
      'CN': 0.6
    };
    
    const factor = emissionFactors[region] || 0.4;
    return consumption * factor;
  }

  generateRecommendations(predictions, weather) {
    const recommendations = [];
    
    if (predictions.length > 0) {
      const avgConsumption = predictions.reduce((sum, p) => sum + p.predicted_consumption, 0) / predictions.length;
      
      if (avgConsumption > 200) {
        recommendations.push({
          category: 'devices',
          title: 'Optimize Device Usage',
          description: 'Consider reducing AC usage during peak hours',
          impact: 'High',
          savings: '15-25%'
        });
      }
      
      if (weather && weather.temperature < 20) {
        recommendations.push({
          category: 'heating',
          title: 'Efficient Heating',
          description: 'Use programmable thermostat to optimize heating schedules',
          impact: 'Medium',
          savings: '10-15%'
        });
      }
      
      recommendations.push({
        category: 'general',
        title: 'LED Lighting',
        description: 'Switch to LED bulbs for 80% lighting energy savings',
        impact: 'Low',
        savings: '5-10%'
      });
    }
    
    return recommendations;
  }
}

export default new AnalyticsService();