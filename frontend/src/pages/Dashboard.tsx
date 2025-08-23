import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DollarSign, Leaf, TrendingDown, TrendingUp, Zap, Activity, Settings } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import RealTimeMonitoring from "@/components/RealTimeMonitoring";
import AdvancedAnalytics from "@/components/AdvancedAnalytics";
import CostOptimization from "@/components/CostOptimization";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Sample data - in a real app, this would come from your backend
  const weeklyData = [
    { day: "Mon", consumption: 12.5, cost: 1.5, savings: 0.8 },
    { day: "Tue", consumption: 15.2, cost: 1.82, savings: 0.3 },
    { day: "Wed", consumption: 11.8, cost: 1.42, savings: 1.1 },
    { day: "Thu", consumption: 14.6, cost: 1.75, savings: 0.5 },
    { day: "Fri", consumption: 16.3, cost: 1.96, savings: 0.2 },
    { day: "Sat", consumption: 18.7, cost: 2.24, savings: 0.1 },
    { day: "Sun", consumption: 17.2, cost: 2.06, savings: 0.4 },
  ];

  const monthlyTrend = [
    { month: "Jan", predicted: 420, actual: 398 },
    { month: "Feb", predicted: 380, actual: 365 },
    { month: "Mar", predicted: 350, actual: 342 },
    { month: "Apr", predicted: 310, actual: 295 },
    { month: "May", predicted: 280, actual: 268 },
    { month: "Jun", predicted: 340, actual: 352 },
  ];

  const applianceData = [
    { name: "HVAC", value: 45, color: "#10B981" },
    { name: "Water Heating", value: 18, color: "#3B82F6" },
    { name: "Lighting", value: 12, color: "#F59E0B" },
    { name: "Electronics", value: 15, color: "#8B5CF6" },
    { name: "Other", value: 10, color: "#EF4444" },
  ];

  const stats = [
    {
      title: "This Month",
      value: "268 kWh",
      change: -12.5,
      icon: Zap,
      color: "text-green-400",
    },
    {
      title: "Cost Saved",
      value: "$32.15",
      change: 15.3,
      icon: DollarSign,
      color: "text-blue-400",
    },
    {
      title: "CO₂ Reduced",
      value: "145 lbs",
      change: 8.7,
      icon: Leaf,
      color: "text-green-400",
    },
    {
      title: "Efficiency Score",
      value: "87%",
      change: 5.2,
      icon: TrendingUp,
      color: "text-purple-400",
    },
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Energy Dashboard
            </h1>
            <p className="text-gray-300">
              Monitor your energy consumption and savings in real-time
            </p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            {/* <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="border-white/20 text-white hover:bg-white/10"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button> */}
            {/* <Button className="energy-gradient text-white">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button> */}
          </div>
        </div>

        {/* Stats Overview */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-r from-current/20 to-current/10 ${stat.color}`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  {stat.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.change > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {Math.abs(stat.change)}%
                  </span>
                  <span className="text-gray-400 text-sm ml-1">
                    from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Energy Analysis Results */}
        <Card
          className="bg-white/5 border-white/10 mb-8"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <CardHeader>
            <CardTitle className="text-white text-xl">
              Energy Analysis Results
            </CardTitle>
            <p className="text-gray-300 text-sm">
              Comprehensive analysis of energy consumption patterns and
              predictions
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative group">
              <img
                src="/energy_analysis_results.png"
                alt="Energy Analysis Results"
                className="w-full h-auto rounded-lg border border-white/10 group-hover:border-green-400/30 transition-all duration-300 shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Dashboard Tabs */}
        <Tabs
          defaultValue="overview"
          className="space-y-6"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <TabsList className="grid w-full grid-cols-6 bg-white/10">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="realtime"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              Real-time
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="optimization"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              Cost Optimization
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              Monthly Trend
            </TabsTrigger>
            <TabsTrigger
              value="breakdown"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              Usage Breakdown
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">
                    Weekly Consumption
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="consumption"
                        fill="url(#energyGradient)"
                        radius={[4, 4, 0, 0]}
                      />
                      <defs>
                        <linearGradient
                          id="energyGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#10B981" />
                          <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">
                    Daily Costs & Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="cost"
                        stroke="#EF4444"
                        strokeWidth={3}
                        dot={{ fill: "#EF4444", r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="savings"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ fill: "#10B981", r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="realtime">
            <div className="bg-white/5 border-white/10 rounded-lg p-6">
              <RealTimeMonitoring />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="bg-white/5 border-white/10 rounded-lg p-6">
              <AdvancedAnalytics />
            </div>
          </TabsContent>

          <TabsContent value="optimization">
            <div className="bg-white/5 border-white/10 rounded-lg p-6">
              <CostOptimization />
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">
                    Weekly Consumption
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="consumption"
                        fill="url(#energyGradient)"
                        radius={[4, 4, 0, 0]}
                      />
                      <defs>
                        <linearGradient
                          id="energyGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#10B981" />
                          <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">
                    Daily Costs & Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="cost"
                        stroke="#EF4444"
                        strokeWidth={3}
                        dot={{ fill: "#EF4444", r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="savings"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ fill: "#10B981", r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monthly">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  Monthly Prediction vs Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={{ fill: "#8B5CF6", r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: "#10B981", r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breakdown">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">
                    Energy Usage by Appliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={applianceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {applianceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">
                    Appliance Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applianceData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-white font-medium">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">
                            {item.value}%
                          </div>
                          <div className="text-gray-400 text-sm">
                            {(item.value * 2.68).toFixed(0)} kWh
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card
          className="bg-white/5 border-white/10 mt-8"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center space-y-2 border-white/20 text-white hover:bg-white/10">
                <Activity className="h-6 w-6" />
                <span className="text-sm">Live Monitor</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center space-y-2 border-white/20 text-white hover:bg-white/10">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Insights</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center space-y-2 border-white/20 text-white hover:bg-white/10">
                <DollarSign className="h-6 w-6" />
                <span className="text-sm">Cost Analysis</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center space-y-2 border-white/20 text-white hover:bg-white/10">
                <Settings className="h-6 w-6" />
                <span className="text-sm">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
