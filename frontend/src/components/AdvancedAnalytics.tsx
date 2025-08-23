import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Lightbulb, Leaf, Download, AlertCircle } from 'lucide-react';

interface Insight {
  type: 'warning' | 'tip' | 'alert';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

interface Recommendation {
  category: string;
  title: string;
  description: string;
  impact: string;
  savings: string;
}

const AdvancedAnalytics: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [efficiency, setEfficiency] = useState(0);
  const [carbonFootprint, setCarbonFootprint] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const consumptionByDevice = [
    { name: 'AC', value: 45, color: '#8884d8' },
    { name: 'Heating', value: 25, color: '#82ca9d' },
    { name: 'Lighting', value: 15, color: '#ffc658' },
    { name: 'Appliances', value: 15, color: '#ff7300' }
  ];

  const hourlyPattern = [
    { hour: '00', consumption: 80 },
    { hour: '06', consumption: 120 },
    { hour: '12', consumption: 180 },
    { hour: '18', consumption: 220 },
    { hour: '24', consumption: 90 }
  ];

  const efficiencyMetrics = [
    { metric: 'Heating', current: 85, benchmark: 90 },
    { metric: 'Cooling', current: 78, benchmark: 85 },
    { metric: 'Lighting', current: 92, benchmark: 95 },
    { metric: 'Appliances', current: 88, benchmark: 90 }
  ];

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/analytics/insights', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights || []);
        setRecommendations(data.recommendations || []);
      }

      const efficiencyResponse = await fetch('http://localhost:3001/api/analytics/efficiency', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (efficiencyResponse.ok) {
        const effData = await efficiencyResponse.json();
        setEfficiency(effData.efficiency || 0);
      }

      // Mock carbon footprint calculation
      setCarbonFootprint(150 * 0.4); // 150 kWh * 0.4 kg CO2/kWh
      
    } catch (error) {
      console.error('Analytics fetch error:', error);
      // Set mock data for demo
      setInsights([
        {
          type: 'warning',
          title: 'High Peak Usage',
          message: 'Your energy usage spikes during 6-9 PM. Consider shifting some activities.',
          priority: 'high'
        },
        {
          type: 'tip',
          title: 'Optimize AC Settings',
          message: 'Setting AC to 24°C can save up to 20% energy.',
          priority: 'medium'
        }
      ]);
      
      setRecommendations([
        {
          category: 'devices',
          title: 'Smart Thermostat',
          description: 'Install programmable thermostat for automated temperature control',
          impact: 'High',
          savings: '15-25%'
        },
        {
          category: 'lighting',
          title: 'LED Upgrade',
          description: 'Replace remaining incandescent bulbs with LED',
          impact: 'Medium',
          savings: '10-15%'
        }
      ]);
      
      setEfficiency(78);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/export/csv', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'energy_analytics.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'tip': return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'alert': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Advanced Analytics</h2>
        <Button onClick={exportData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{efficiency.toFixed(1)}%</div>
            <Badge variant={efficiency > 80 ? 'default' : 'destructive'}>
              {efficiency > 80 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carbonFootprint.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground">CO2 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45</div>
            <p className="text-xs text-muted-foreground">Monthly potential</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="patterns">Usage Patterns</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    {getInsightIcon(insight.type)}
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <Badge variant={insight.priority === 'high' ? 'destructive' : 'default'}>
                      {insight.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{insight.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Consumption by Device</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={consumptionByDevice}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {consumptionByDevice.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hourly Usage Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyPattern}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} kWh`, 'Consumption']} />
                    <Bar dataKey="consumption" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Efficiency vs Benchmark</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={efficiencyMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Current" dataKey="current" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Benchmark" dataKey="benchmark" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rec.title}</CardTitle>
                    <Badge variant="outline">{rec.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  <div className="flex justify-between text-sm">
                    <span>Impact: <strong>{rec.impact}</strong></span>
                    <span>Savings: <strong>{rec.savings}</strong></span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;