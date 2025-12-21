"use client";

import LoginModal from "@/components/LoginModal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  BarChart3,
  Brain,
  Calendar,
  Clock,
  Database,
  RefreshCw,
  Target,
  Thermometer,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Prediction {
  id: string;
  temperature: number;
  householdSize: number;
  season: string;
  date: string;
  devices: { device: string; hours: number }[];
  predictedConsumption: number;
  modelUsed: string;
  confidence: number;
  createdAt: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  totalPredictions: number;
  averageConsumption: number;
  favoriteModel: string;
  lastPrediction: string;
}

const Profile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [stats, setStats] = useState({
    totalPredictions: 0,
    averageConsumption: 0,
    highestConsumption: 0,
    lowestConsumption: 0,
    mostUsedModel: "",
    totalDevices: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    console.log(
      "Profile page loaded - Token:",
      token ? "Exists" : "Missing",
      "User:",
      userData ? "Exists" : "Missing"
    );

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      fetchUserProfile();
      fetchPredictionHistory();
    } else {
      console.log("No token or user data, showing login modal");
      setShowLoginModal(true);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(
        "Fetching user profile with token:",
        token ? "Token exists" : "No token"
      );

      const response = await fetch("http://localhost:3001/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Profile response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Profile data received:", data);
        setProfile(data);
        setError("");
      } else {
        const errorText = await response.text();
        console.log("Failed to fetch profile:", response.status, errorText);
        setError(`Profile fetch failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.log("Failed to fetch user profile:", error);
      setError(`Profile fetch error: ${error}`);
    }
  };

  const fetchPredictionHistory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      console.log(
        "Fetching prediction history with token:",
        token ? "Token exists" : "No token"
      );

      if (!token) {
        setError("No authentication token found. Please login again.");
        setPredictions([]);
        calculateStats([]);
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:3001/api/predictions/history",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Prediction history response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Prediction history data received:", data);
        const predictionsList = Array.isArray(data.predictions) ? data.predictions : [];
        setPredictions(predictionsList);
        calculateStats(predictionsList);
        setError("");
      } else {
        const errorText = await response.text();
        let errorMessage = `Predictions fetch failed: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage += ` - ${errorData.error || errorData.details || errorText}`;
        } catch {
          errorMessage += ` - ${errorText}`;
        }
        console.log("Failed to fetch predictions:", response.status, errorText);
        setError(errorMessage);
        setPredictions([]);
        calculateStats([]);
      }
    } catch (error) {
      console.error("Failed to fetch prediction history:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`Predictions fetch error: ${errorMessage}`);
      setPredictions([]);
      calculateStats([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    setError("");
    await Promise.all([fetchUserProfile(), fetchPredictionHistory()]);
    setIsRefreshing(false);
  };

  const calculateStats = (predictionList: Prediction[]) => {
    if (predictionList.length === 0) {
      setStats({
        totalPredictions: 0,
        averageConsumption: 0,
        highestConsumption: 0,
        lowestConsumption: 0,
        mostUsedModel: "",
        totalDevices: 0,
      });
      return;
    }

    const consumptions = predictionList
      .map((p) => p.predictedConsumption)
      .filter((c) => c != null && !isNaN(c));
    
    if (consumptions.length === 0) {
      setStats({
        totalPredictions: predictionList.length,
        averageConsumption: 0,
        highestConsumption: 0,
        lowestConsumption: 0,
        mostUsedModel: "",
        totalDevices: 0,
      });
      return;
    }

    const models = predictionList
      .map((p) => p.modelUsed)
      .filter((m) => m != null && m !== "");
    
    const deviceCounts = predictionList.reduce((total, p) => {
      const devices = Array.isArray(p.devices) ? p.devices : [];
      return total + devices.length;
    }, 0);

    const modelCounts = models.reduce((acc, model) => {
      acc[model] = (acc[model] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsedModel = Object.keys(modelCounts).length > 0
      ? Object.entries(modelCounts).reduce((a, b) =>
          modelCounts[a[0]] > modelCounts[b[0]] ? a : b
        )[0]
      : "";

    setStats({
      totalPredictions: predictionList.length,
      averageConsumption:
        Math.round(
          (consumptions.reduce((a, b) => a + b, 0) / consumptions.length) * 100
        ) / 100,
      highestConsumption: Math.max(...consumptions),
      lowestConsumption: Math.min(...consumptions),
      mostUsedModel,
      totalDevices: deviceCounts,
    });
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowLoginModal(false);
    setError("");
    fetchUserProfile();
    fetchPredictionHistory();
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const getDeviceSummary = (devices: { device: string; hours: number }[] | null | undefined) => {
    if (!devices || !Array.isArray(devices) || devices.length === 0) {
      return "No devices";
    }
    return devices.map((d) => {
      const deviceName = d?.device || "Unknown";
      const hours = d?.hours || 0;
      return `${deviceName} (${hours}h)`;
    }).join(", ");
  };

  if (showLoginModal) {
    return (
      <LoginModal
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 px-3 sm:px-4 lg:px-8 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 dark:from-transparent dark:via-transparent dark:to-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div
          className="text-center mb-8 sm:mb-12"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <User className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Energy Prediction Profile
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Your Energy Consumption History
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 px-2">
            Track your prediction history and energy consumption patterns over
            time.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="text-red-400 text-sm">⚠️</div>
              <div className="text-red-400 text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* User Info & Refresh */}
        <section
          className="mb-6 sm:mb-8"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <Card className="bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {user?.name || "User"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{user?.email}</p>
                    <p className="text-gray-600 dark:text-gray-500 text-xs">
                      Member since{" "}
                      {profile?.joinDate ? formatDate(profile.joinDate) : "N/A"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={refreshData}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  <span className="text-sm">Refresh Data</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Profile Overview */}
        <section
          className="mb-6 sm:mb-8"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <Card className="bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl flex items-center text-gray-900 dark:text-white">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Prediction Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Database className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Total Predictions
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {stats.totalPredictions}
                  </div>
                </div>

                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      Avg Consumption
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {stats.averageConsumption} kWh
                  </div>
                </div>

                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      Favorite Model
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {stats.mostUsedModel || "N/A"}
                  </div>
                </div>

                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Zap className="h-4 w-4 text-orange-600 dark:text-orange-400 mr-2" />
                    <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      Total Devices
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {stats.totalDevices}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Detailed Statistics */}
        <section
          className="mb-6 sm:mb-8"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <Card className="bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl flex items-center text-gray-900 dark:text-white">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Consumption Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Highest Consumption
                    </span>
                    <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.highestConsumption} kWh
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Peak usage recorded
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Lowest Consumption
                    </span>
                    <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.lowestConsumption} kWh
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Minimum usage recorded
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Prediction
                    </span>
                    <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {profile?.lastPrediction
                      ? formatDate(profile.lastPrediction)
                      : "N/A"}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Most recent prediction
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Prediction History */}
        <section
          className="mb-6 sm:mb-8"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <Card className="bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl flex items-center text-gray-900 dark:text-white">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Prediction History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading prediction history...</p>
                </div>
              ) : predictions.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No predictions found. Start predicting to see your history!
                  </p>
                  <p className="text-gray-600 dark:text-gray-500 text-sm mt-2">
                    Go to the Predict page to make your first energy consumption
                    prediction.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {predictions.map((prediction, index) => (
                    <div
                      key={prediction.id || index}
                      className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              <Brain className="h-3 w-3 mr-1" />
                              {prediction.modelUsed || "N/A"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Thermometer className="h-3 w-3 mr-1" />
                              {prediction.temperature != null ? `${prediction.temperature}°C` : "N/A"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {prediction.date ? formatDate(prediction.date) : "N/A"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Predicted:</span>
                              <span className="text-gray-900 dark:text-white font-semibold ml-2">
                                {prediction.predictedConsumption != null 
                                  ? `${prediction.predictedConsumption} kWh` 
                                  : "N/A"}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                              <span className="text-green-600 dark:text-green-400 font-semibold ml-2">
                                {prediction.confidence != null 
                                  ? `${prediction.confidence}%` 
                                  : "N/A"}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Household:</span>
                              <span className="text-gray-900 dark:text-white font-semibold ml-2">
                                {prediction.householdSize != null 
                                  ? `${prediction.householdSize} people` 
                                  : "N/A"}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Season:</span>
                              <span className="text-gray-900 dark:text-white font-semibold ml-2">
                                {prediction.season || "N/A"}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2">
                            <span className="text-gray-600 dark:text-gray-400 text-xs">
                              Devices:
                            </span>
                            <p className="text-gray-900 dark:text-white text-xs mt-1">
                              {getDeviceSummary(prediction.devices)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {prediction.createdAt ? formatDate(prediction.createdAt) : "N/A"}
                          </div>
                          <Progress
                            value={prediction.confidence != null ? prediction.confidence : 0}
                            className="w-20"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Profile;
