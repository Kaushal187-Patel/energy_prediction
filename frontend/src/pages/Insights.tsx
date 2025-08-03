import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Award,
  CheckCircle,
  Clock,
  DollarSign,
  Leaf,
  Lightbulb,
  Target,
  Thermometer,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";

const Insights = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");

  const insights = [
    {
      icon: TrendingUp,
      title: "Peak Usage Pattern",
      description:
        "Your highest energy consumption occurs between 6-9 PM on weekdays.",
      recommendation:
        "Consider shifting heavy appliance usage to off-peak hours (10 PM - 6 AM) to save up to 20% on costs.",
      impact: "High",
      savings: "$15-25/month",
      category: "usage",
    },
    {
      icon: Thermometer,
      title: "HVAC Optimization",
      description:
        "Your thermostat settings are causing 15% higher consumption than average.",
      recommendation:
        "Adjust thermostat to 68°F in winter and 78°F in summer. Use programmable settings for different times.",
      impact: "High",
      savings: "$30-45/month",
      category: "hvac",
    },
    {
      icon: Lightbulb,
      title: "Lighting Efficiency",
      description: "LED conversion could reduce your lighting costs by 75%.",
      recommendation:
        "Replace remaining incandescent and CFL bulbs with LED alternatives.",
      impact: "Medium",
      savings: "$8-12/month",
      category: "lighting",
    },
    {
      icon: Zap,
      title: "Phantom Load Detection",
      description:
        "Electronics in standby mode consume 12% of your total energy.",
      recommendation:
        "Use smart power strips or unplug devices when not in use.",
      impact: "Medium",
      savings: "$18-22/month",
      category: "electronics",
    },
  ];

  const goals = [
    {
      title: "Monthly Consumption Target",
      current: 268,
      target: 250,
      unit: "kWh",
    },
    { title: "Cost Reduction Goal", current: 85, target: 100, unit: "%" },
    { title: "Efficiency Score", current: 87, target: 95, unit: "%" },
    {
      title: "Carbon Footprint Reduction",
      current: 145,
      target: 180,
      unit: "lbs CO₂",
    },
  ];

  const achievements = [
    {
      title: "Energy Saver",
      description: "Reduced consumption by 15% this month",
      icon: Award,
      earned: true,
    },
    {
      title: "Eco Warrior",
      description: "Cut carbon footprint by 100+ lbs",
      icon: Leaf,
      earned: true,
    },
    {
      title: "Peak Shifter",
      description: "Avoided peak hours 20+ times",
      icon: Clock,
      earned: false,
    },
    {
      title: "Smart Home",
      description: "Maintained 90%+ efficiency for 30 days",
      icon: Target,
      earned: false,
    },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "usage":
        return TrendingUp;
      case "hvac":
        return Thermometer;
      case "lighting":
        return Lightbulb;
      case "electronics":
        return Zap;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div
      className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-6">
            <TrendingUp className="h-4 w-4 mr-2" />
            AI-Powered Energy Insights
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Smart Energy Insights
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover personalized recommendations to optimize your energy usage
            and maximize savings
          </p>
        </div>

        <Tabs defaultValue="insights" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger
              value="insights"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
            >
              Smart Insights
            </TabsTrigger>
            <TabsTrigger
              value="goals"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
            >
              Goals & Progress
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
            >
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6">
              {insights.map((insight, index) => {
                const IconComponent = getCategoryIcon(insight.category);
                return (
                  <Card
                    key={index}
                    className="bg-white/5 border-white/10 hover:bg-white/8 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20">
                            <IconComponent className="h-6 w-6 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold text-white">
                                {insight.title}
                              </h3>
                              <Badge
                                className={`px-2 py-1 text-xs border ${getImpactColor(
                                  insight.impact
                                )}`}
                              >
                                {insight.impact} Impact
                              </Badge>
                            </div>
                            <p className="text-gray-300 mb-3">
                              {insight.description}
                            </p>
                            <p className="text-gray-200 bg-white/5 p-3 rounded-lg border-l-4 border-purple-400">
                              💡 <strong>Recommendation:</strong>{" "}
                              {insight.recommendation}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-center lg:items-end space-y-2 min-w-[140px]">
                          <div className="text-center lg:text-right">
                            <div className="text-2xl font-bold text-green-400">
                              {insight.savings}
                            </div>
                            <div className="text-sm text-gray-400">
                              Potential Savings
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            <span className="text-green-400 text-sm font-medium">
                              High ROI
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {goals.map((goal, index) => (
                <Card key={index} className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">
                      {goal.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Current</span>
                        <span className="text-white font-semibold">
                          {goal.current} {goal.unit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Target</span>
                        <span className="text-green-400 font-semibold">
                          {goal.target} {goal.unit}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(
                          (goal.current / goal.target) * 100,
                          100
                        )}
                        className="h-3 bg-white/10"
                      />
                      <div className="text-center">
                        <span
                          className={`text-sm font-medium ${
                            goal.current >= goal.target
                              ? "text-green-400"
                              : goal.current >= goal.target * 0.8
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                        >
                          {Math.min(
                            (goal.current / goal.target) * 100,
                            100
                          ).toFixed(1)}
                          % Complete
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card
                  key={index}
                  className={`border transition-all duration-300 ${
                    achievement.earned
                      ? "bg-gradient-to-br from-green-500/20 to-blue-500/20 border-green-400/30"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-4 rounded-full ${
                          achievement.earned
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {achievement.earned ? (
                          <CheckCircle className="h-8 w-8" />
                        ) : (
                          <achievement.icon className="h-8 w-8" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-semibold mb-1 ${
                            achievement.earned ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {achievement.title}
                        </h3>
                        <p
                          className={
                            achievement.earned
                              ? "text-gray-200"
                              : "text-gray-500"
                          }
                        >
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.earned && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Earned
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Insights;
