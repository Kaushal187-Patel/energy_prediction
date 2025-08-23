import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DollarSign, TrendingDown, Clock, Zap } from 'lucide-react';

interface CostData {
  hour: string;
  rate: number;
  consumption: number;
  cost: number;
}

interface Optimization {
  device: string;
  currentCost: number;
  optimizedCost: number;
  savings: number;
  recommendation: string;
}

const CostOptimization: React.FC = () => {
  const [tariffType, setTariffType] = useState('time-of-use');
  const [budgetLimit, setBudgetLimit] = useState([100]);
  const [optimizations, setOptimizations] = useState<Optimization[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);

  // Mock time-of-use rates and consumption data
  const costData: CostData[] = [
    { hour: '00', rate: 0.08, consumption: 80, cost: 6.4 },
    { hour: '06', rate: 0.12, consumption: 120, cost: 14.4 },
    { hour: '12', rate: 0.18, consumption: 180, cost: 32.4 },
    { hour: '18', rate: 0.25, consumption: 220, cost: 55.0 },
    { hour: '21', rate: 0.18, consumption: 150, cost: 27.0 },
    { hour: '24', rate: 0.08, consumption: 90, cost: 7.2 }
  ];

  const peakHours = [
    { period: 'Off-Peak (11PM-6AM)', rate: '$0.08/kWh', color: '#82ca9d' },
    { period: 'Mid-Peak (6AM-5PM)', rate: '$0.12/kWh', color: '#ffc658' },
    { period: 'Peak (5PM-11PM)', rate: '$0.25/kWh', color: '#ff7300' }
  ];

  useEffect(() => {
    calculateOptimizations();
  }, [tariffType, budgetLimit]);

  const calculateOptimizations = () => {
    const mockOptimizations: Optimization[] = [
      {
        device: 'Air Conditioning',
        currentCost: 45.20,
        optimizedCost: 32.15,
        savings: 13.05,
        recommendation: 'Pre-cool during off-peak hours, raise temp during peak'
      },
      {
        device: 'Water Heater',
        currentCost: 28.50,
        optimizedCost: 19.80,
        savings: 8.70,
        recommendation: 'Heat water during off-peak hours only'
      },
      {
        device: 'Washing Machine',
        currentCost: 12.30,
        optimizedCost: 7.40,
        savings: 4.90,
        recommendation: 'Run cycles during off-peak hours'
      },
      {
        device: 'Electric Vehicle',
        currentCost: 35.60,
        optimizedCost: 21.40,
        savings: 14.20,
        recommendation: 'Charge overnight during lowest rates'
      }
    ];

    setOptimizations(mockOptimizations);
    setTotalSavings(mockOptimizations.reduce((sum, opt) => sum + opt.savings, 0));
  };

  const getCurrentCost = () => {
    return costData.reduce((sum, data) => sum + data.cost, 0);
  };

  const getOptimizedCost = () => {
    return getCurrentCost() - totalSavings;
  };

  const getSavingsPercentage = () => {
    const current = getCurrentCost();
    return current > 0 ? (totalSavings / current) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Cost Optimization</h2>
        <Badge variant="outline">
          Potential Savings: ${totalSavings.toFixed(2)}/month
        </Badge>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tariff Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tariff Type</label>
              <Select value={tariffType} onValueChange={setTariffType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time-of-use">Time of Use</SelectItem>
                  <SelectItem value="flat-rate">Flat Rate</SelectItem>
                  <SelectItem value="tiered">Tiered Pricing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Monthly Budget Limit: ${budgetLimit[0]}</label>
              <Slider
                value={budgetLimit}
                onValueChange={setBudgetLimit}
                max={200}
                min={50}
                step={10}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Current Monthly Cost:</span>
              <span className="font-bold">${getCurrentCost().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Optimized Cost:</span>
              <span className="font-bold text-green-600">${getOptimizedCost().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Savings:</span>
              <span className="font-bold text-green-600">
                ${totalSavings.toFixed(2)} ({getSavingsPercentage().toFixed(1)}%)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rate Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Time-of-Use Rate Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {peakHours.map((period, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded" 
                  style={{ backgroundColor: period.color }}
                />
                <div>
                  <div className="font-medium text-sm">{period.period}</div>
                  <div className="text-xs text-muted-foreground">{period.rate}</div>
                </div>
              </div>
            ))}
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'rate' ? `$${value}/kWh` : `$${value}`,
                  name === 'rate' ? 'Rate' : 'Cost'
                ]}
              />
              <Area type="monotone" dataKey="cost" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Line type="monotone" dataKey="rate" stroke="#ff7300" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Device Optimization Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizations.map((opt, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{opt.device}</h4>
                  <Badge variant="outline">
                    Save ${opt.savings.toFixed(2)}/month
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Current:</span>
                    <div className="font-medium">${opt.currentCost.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Optimized:</span>
                    <div className="font-medium text-green-600">${opt.optimizedCost.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Savings:</span>
                    <div className="font-medium text-green-600">
                      {((opt.savings / opt.currentCost) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{opt.recommendation}</p>
                
                <Button size="sm" variant="outline">
                  Apply Optimization
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Cost-Saving Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Clock className="h-6 w-6" />
              <span className="text-sm">Schedule Devices</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <TrendingDown className="h-6 w-6" />
              <span className="text-sm">Peak Shaving</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Zap className="h-6 w-6" />
              <span className="text-sm">Load Balancing</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <DollarSign className="h-6 w-6" />
              <span className="text-sm">Budget Alerts</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostOptimization;