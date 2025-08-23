import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import io from 'socket.io-client';

interface MonitoringData {
  timestamp: string;
  consumption: number;
  temperature: number;
  efficiency: number;
  cost: number;
}

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}

const RealTimeMonitoring: React.FC = () => {
  const [data, setData] = useState<MonitoringData[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    consumption: 0,
    efficiency: 0,
    cost: 0,
    status: 'normal'
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:3001');
    
    socket.on('connect', () => {
      setIsConnected(true);
      const userId = localStorage.getItem('userId');
      if (userId) {
        socket.emit('subscribe_monitoring', userId);
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('energy_update', (update: MonitoringData) => {
      setData(prev => [...prev.slice(-23), update]);
      setCurrentMetrics({
        consumption: update.consumption,
        efficiency: update.efficiency,
        cost: update.cost,
        status: update.consumption > 200 ? 'high' : 'normal'
      });
    });

    socket.on('alert', (alert: Alert) => {
      setAlerts(prev => [alert, ...prev.slice(0, 4)]);
    });

    // Simulate real-time data for demo
    const interval = setInterval(() => {
      const now = new Date();
      const newData: MonitoringData = {
        timestamp: now.toISOString(),
        consumption: 120 + Math.random() * 80,
        temperature: 22 + Math.random() * 8,
        efficiency: 75 + Math.random() * 20,
        cost: 15 + Math.random() * 10
      };
      
      setData(prev => [...prev.slice(-23), newData]);
      setCurrentMetrics({
        consumption: newData.consumption,
        efficiency: newData.efficiency,
        cost: newData.cost,
        status: newData.consumption > 200 ? 'high' : 'normal'
      });
    }, 5000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'destructive';
      case 'normal': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Real-Time Monitoring</h2>
        <Badge variant={isConnected ? 'default' : 'destructive'}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Usage</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.consumption.toFixed(1)} kWh</div>
            <Badge variant={getStatusColor(currentMetrics.status)} className="mt-1">
              {currentMetrics.status}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.efficiency.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Energy efficiency score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Cost</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMetrics.cost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Today's cost</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">Active alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Energy Consumption Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: number) => [`${value.toFixed(1)} kWh`, 'Consumption']}
              />
              <Line 
                type="monotone" 
                dataKey="consumption" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.map((alert) => (
              <Alert key={alert.id} variant={alert.type === 'error' ? 'destructive' : 'default'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {alert.message}
                  <span className="text-xs text-muted-foreground ml-2">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeMonitoring;