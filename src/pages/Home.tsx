import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Lightbulb,
  Play,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [currentStat, setCurrentStat] = useState(0);
  const stats = [
    { value: "95%", label: "Prediction Accuracy" },
    { value: "2.4kWh", label: "Average Daily Savings" },
    { value: "15K+", label: "Homes Optimized" },
    { value: "40%", label: "Energy Cost Reduction" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Predictions",
      description:
        "Advanced machine learning models analyze your usage patterns to provide accurate energy consumption forecasts.",
      color: "from-green-400 to-blue-500",
    },
    {
      icon: TrendingUp,
      title: "Smart Insights",
      description:
        "Get personalized recommendations to reduce energy consumption and lower your electricity bills.",
      color: "from-blue-400 to-purple-500",
    },
    {
      icon: Shield,
      title: "Reliable & Secure",
      description:
        "Your data is processed securely with industry-standard encryption and privacy protection.",
      color: "from-purple-400 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm font-medium mb-8 animate-float-up">
              <Zap className="h-4 w-4 mr-2" />
              Smart Energy Forecasting Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-float-up">
              <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Predict Energy
              </span>
              <br />
              <span className="text-white">Consumption</span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 animate-float-up">
              Harness the power of AI to predict your energy usage, optimize
              consumption patterns, and reduce costs with our advanced machine
              learning platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-float-up">
              <Link to="/predict">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 energy-glow"
                >
                  Start Predicting
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {/* <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-xl"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button> */}
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-float-up">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-6 rounded-xl transition-all duration-500 ${
                    index === currentStat
                      ? "glass-morphism energy-glow scale-105"
                      : "opacity-60"
                  }`}
                >
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20 bg-gradient-to-b from-transparent to-black/20"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose EnergyAI?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with user-friendly design to
              deliver the most accurate energy predictions in the industry.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <CardContent className="p-8">
                  <div
                    className={`inline-flex p-4 rounded-lg bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" data-aos="fade-up" data-aos-duration="1000">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-morphism rounded-2xl p-12">
            <Lightbulb className="h-16 w-16 text-yellow-400 mx-auto mb-6 animate-pulse-energy" />
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Optimize Your Energy Usage?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users who are already saving money and reducing
              their carbon footprint.
            </p>
            <Link to="/predict">
              <Button
                size="lg"
                className="energy-gradient text-white font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Today
                <BarChart3 className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
