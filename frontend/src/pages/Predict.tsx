"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import LoginModal from "@/components/LoginModal";
import {
  AlertTriangle,
  Battery,
  Brain,
  Cloud,
  Database,
  Droplets,
  Factory,
  Home,
  Leaf,
  Monitor,
  Sun,
  Thermometer,
  TrendingDown,
  TrendingUp,
  Users,
  Wind,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

// Type definitions
interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  solarRadiation: number;
  rainfall: number;
  cloudCover: number;
  description: string;
}

interface Device {
  device: string;
  hours: number;
}

interface EnergyDemand {
  predicted_consumption: number;
  peak_demand: number;
  off_peak_demand: number;
  demand_trend: string;
}

interface EnergyGeneration {
  solar_generation: number;
  wind_generation: number;
  renewable_total: number;
  fossil_fuel_required: number;
  generation_capacity: number;
}

interface SupplyDemandBalance {
  surplus_shortage: number;
  status: string;
  grid_stress_index: number;
  recommendation: string;
}

interface LoadAnalysis {
  residential_load: number;
  industrial_load: number;
  population_activity: number;
  is_peak_hour: boolean;
  is_weekend: boolean;
}

interface WeatherImpact {
  temperature: number;
  humidity: number;
  comfort_index: number;
  cooling_need: number;
  heating_need: number;
  weather_severity: string;
}

interface FactorContributions {
  temperature_impact: number;
  humidity_impact: number;
  time_impact: number;
  household_impact: number;
  device_impact: number;
  weather_impact: number;
  renewable_offset: number;
}

interface PredictionResult {
  linear_regression: number;
  knn: number;
  random_forest: number;
  gradient_boosting: number;
  neural_network: number;
  ensemble: number;
  model_scores: Record<string, number>;
  energy_demand: EnergyDemand;
  energy_generation: EnergyGeneration;
  supply_demand_balance: SupplyDemandBalance;
  load_analysis: LoadAnalysis;
  weather_impact: WeatherImpact;
  factor_contributions: FactorContributions;
}

interface GridStatus {
  current_load: number;
  max_capacity: number;
  energy_mix: {
    solar: number;
    wind: number;
    hydro: number;
    nuclear: number;
    natural_gas: number;
    coal: number;
  };
  renewable_percentage: number;
  carbon_intensity: number;
  is_peak: boolean;
  price_per_kwh: number;
}

const Predict = () => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  // Weather states
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);

  // Input states - Basic
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number>(60);
  const [windSpeed, setWindSpeed] = useState<number>(5);
  const [solarRadiation, setSolarRadiation] = useState<number>(400);
  const [rainfall, setRainfall] = useState<number>(0);
  const [cloudCover, setCloudCover] = useState<number>(30);

  // Input states - Time & Date
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState<string>("12:00");
  const [season, setSeason] = useState<string>("Summer");

  // Input states - Household
  const [householdSize, setHouseholdSize] = useState<number>(4);
  const [applianceType, setApplianceType] = useState<string>("AC");
  const [devices, setDevices] = useState<Device[]>([
    { device: "AC", hours: 300 },
    { device: "Refrigerator", hours: 1440 },
    { device: "TV", hours: 120 },
    { device: "Lights", hours: 360 },
    { device: "WashingMachine", hours: 90 },
  ]);

  // Input states - Energy Source
  const [energySourceType, setEnergySourceType] = useState<string>("mixed");
  const [hasBackupPower, setHasBackupPower] = useState<boolean>(false);

  // Input states - Special Conditions
  const [unexpectedEvent, setUnexpectedEvent] = useState<string>("none");
  const [policyRegulation, setPolicyRegulation] = useState<string>("standard");

  // Prediction states
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [gridStatus, setGridStatus] = useState<GridStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<string>("Checking API...");
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  // Cost estimation
  const [costEstimate, setCostEstimate] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      checkApiStatus();
      setCurrentDateTime();
    } else {
      setShowLoginModal(true);
    }
  }, []);

  useEffect(() => {
    calculateCostEstimate();
  }, [temperature, devices, prediction]);

  const setCurrentDateTime = () => {
    const now = new Date();
    setDate(now.toISOString().split("T")[0]);
    setStartTime(now.toTimeString().slice(0, 5));
    setSeason(getCurrentSeason());
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return "Spring";
    if (month >= 6 && month <= 8) return "Summer";
    if (month >= 9 && month <= 11) return "Autumn";
    return "Winter";
  };

  const checkApiStatus = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/health");
      if (response.ok) {
        const data = await response.json();
        setApiStatus(`ML Models Ready (${data.models_loaded} models)`);
        setDataLoaded(true);
      } else {
        setApiStatus("API Error");
      }
    } catch (error) {
      setApiStatus("API Offline - Start predict_api.py");
    }
  };

  const fetchCurrentWeather = async () => {
    setWeatherLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/weather/current");
      if (response.ok) {
        const weather = await response.json();
        setWeatherData(weather);
        setTemperature(Math.round(weather.temperature));
        setHumidity(Math.round(weather.humidity));
        setWindSpeed(Math.round(weather.windSpeed * 10) / 10);
        setSolarRadiation(Math.round(weather.solarRadiation));
        setRainfall(Math.round(weather.rainfall * 10) / 10);
        setCloudCover(Math.round(weather.cloudCover));
      }
    } catch (error) {
      console.log("Weather fetch failed, using defaults");
      setTemperature(25);
    }
    setWeatherLoading(false);
  };

  const fetchGridStatus = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/grid/status");
      if (response.ok) {
        const status = await response.json();
        setGridStatus(status);
      }
    } catch (error) {
      console.log("Grid status fetch failed");
    }
  };

  const calculateCostEstimate = () => {
    const baseRate = prediction?.load_analysis?.is_peak_hour ? 8.5 : 5.2;
    const deviceCost = devices.reduce((total, device) => {
      const rates: Record<string, number> = {
        AC: 2.5,
        TV: 0.15,
        Refrigerator: 0.4,
        WashingMachine: 1.5,
        Heater: 3.0,
        Lights: 0.1,
      };
      return total + (rates[device.device] || 1) * (device.hours / 60) * baseRate;
    }, 0);
    setCostEstimate(Math.round(deviceCost * 100) / 100);
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowLoginModal(false);
    checkApiStatus();
  };

  const handlePredict = async () => {
    if (!dataLoaded) {
      alert("ML API is not available. Please start predict_api.py");
      return;
    }

    if (temperature === null) {
      alert("Please click 'Get Weather Data' to load temperature first");
      return;
    }

    setIsLoading(true);

    try {
      const requestData = {
        temperature,
        humidity,
        windSpeed,
        solarRadiation,
        rainfall,
        cloudCover,
        householdSize,
        applianceType,
        startTime,
        season,
        date,
        devices,
        energySourceType,
        unexpectedEvent,
        policyRegulation,
      };

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data: PredictionResult = await response.json();
        setPrediction(data);

        // Fetch grid status after prediction
        fetchGridStatus();

        // Store prediction in database
        const token = localStorage.getItem("token");
        if (token) {
          try {
            await fetch("http://localhost:3001/api/store-prediction", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                temperature,
                householdSize,
                season,
                date,
                devices,
                predictedConsumption: data.ensemble,
                modelUsed: "Ensemble",
                confidence: Math.round((data.model_scores?.random_forest || 0.9) * 100),
              }),
            });
          } catch (error) {
            console.error("Failed to store prediction:", error);
          }
        }
      } else {
        const errorData = await response.json();
        alert(`Prediction failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      alert("Failed to connect to ML API. Please ensure predict_api.py is running.");
    }

    setIsLoading(false);
  };

  const handleTrainModels = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/train", {
        method: "POST",
      });

      if (response.ok) {
        alert("Models trained successfully!");
        checkApiStatus();
      } else {
        const errorData = await response.json();
        alert(`Training failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      alert("Failed to connect to training API.");
    }
    setIsLoading(false);
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
        <div className="text-center mb-8" data-aos="fade-up">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm font-medium mb-4">
            <Database className="h-4 w-4 mr-2" />
            {apiStatus}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Advanced Energy Prediction System
          </h1>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive energy forecasting using ML models with weather conditions,
            time-based factors, population patterns, and energy source analysis.
          </p>
        </div>

        {/* Main Input Tabs */}
        <Tabs defaultValue="weather" className="mb-6">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="weather" className="text-xs sm:text-sm">
              <Cloud className="h-4 w-4 mr-1 hidden sm:inline" />
              Weather
            </TabsTrigger>
            <TabsTrigger value="time" className="text-xs sm:text-sm">
              <Zap className="h-4 w-4 mr-1 hidden sm:inline" />
              Time & Usage
            </TabsTrigger>
            <TabsTrigger value="household" className="text-xs sm:text-sm">
              <Home className="h-4 w-4 mr-1 hidden sm:inline" />
              Household
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs sm:text-sm">
              <Factory className="h-4 w-4 mr-1 hidden sm:inline" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* Weather Tab */}
          <TabsContent value="weather">
            <Card className="bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Cloud className="h-5 w-5 mr-2 text-blue-400" />
                    Weather Conditions
                  </CardTitle>
                  <Button onClick={fetchCurrentWeather} disabled={weatherLoading} size="sm">
                    {weatherLoading ? "Loading..." : "Get Weather Data"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Temperature */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Thermometer className="h-4 w-4 mr-2 text-red-400" />
                    <label className="text-sm font-medium">
                      Temperature: {temperature ?? "—"}°C
                    </label>
                  </div>
                  <Slider
                    value={[temperature ?? 25]}
                    min={-10}
                    max={50}
                    step={1}
                    onValueChange={(v) => setTemperature(v[0])}
                    disabled={temperature === null}
                  />
                </div>

                {/* Humidity */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Droplets className="h-4 w-4 mr-2 text-blue-400" />
                    <label className="text-sm font-medium">Humidity: {humidity}%</label>
                  </div>
                  <Slider
                    value={[humidity]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(v) => setHumidity(v[0])}
                  />
                </div>

                {/* Wind Speed */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Wind className="h-4 w-4 mr-2 text-cyan-400" />
                    <label className="text-sm font-medium">Wind Speed: {windSpeed} m/s</label>
                  </div>
                  <Slider
                    value={[windSpeed]}
                    min={0}
                    max={30}
                    step={0.5}
                    onValueChange={(v) => setWindSpeed(v[0])}
                  />
                </div>

                {/* Solar Radiation */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Sun className="h-4 w-4 mr-2 text-yellow-400" />
                    <label className="text-sm font-medium">
                      Solar Radiation: {solarRadiation} W/m²
                    </label>
                  </div>
                  <Slider
                    value={[solarRadiation]}
                    min={0}
                    max={1200}
                    step={10}
                    onValueChange={(v) => setSolarRadiation(v[0])}
                  />
                </div>

                {/* Rainfall */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Cloud className="h-4 w-4 mr-2 text-gray-400" />
                    <label className="text-sm font-medium">Rainfall: {rainfall} mm</label>
                  </div>
                  <Slider
                    value={[rainfall]}
                    min={0}
                    max={50}
                    step={0.5}
                    onValueChange={(v) => setRainfall(v[0])}
                  />
                </div>

                {/* Cloud Cover */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Cloud className="h-4 w-4 mr-2 text-gray-500" />
                    <label className="text-sm font-medium">Cloud Cover: {cloudCover}%</label>
                  </div>
                  <Slider
                    value={[cloudCover]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(v) => setCloudCover(v[0])}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time & Usage Tab */}
          <TabsContent value="time">
            <Card className="bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  Time-Based Factors
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 rounded border bg-white dark:bg-white/10 border-gray-300 dark:border-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 rounded border bg-white dark:bg-white/10 border-gray-300 dark:border-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Season</label>
                  <Select value={season} onValueChange={setSeason}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Spring">Spring</SelectItem>
                      <SelectItem value="Summer">Summer</SelectItem>
                      <SelectItem value="Autumn">Autumn</SelectItem>
                      <SelectItem value="Winter">Winter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Day Type</label>
                  <div className="text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-100 dark:bg-white/5 rounded">
                    {new Date(date).getDay() === 0 || new Date(date).getDay() === 6
                      ? "Weekend"
                      : "Weekday"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Household Tab */}
          <TabsContent value="household">
            <Card className="bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Home className="h-5 w-5 mr-2 text-green-400" />
                  Household & Devices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-400" />
                      <label className="text-sm font-medium">
                        Household Size: {householdSize} people
                      </label>
                    </div>
                    <Slider
                      value={[householdSize]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(v) => setHouseholdSize(v[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Primary Appliance</label>
                    <Select value={applianceType} onValueChange={setApplianceType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AC">Air Conditioner</SelectItem>
                        <SelectItem value="Heater">Heater</SelectItem>
                        <SelectItem value="Refrigerator">Refrigerator</SelectItem>
                        <SelectItem value="WashingMachine">Washing Machine</SelectItem>
                        <SelectItem value="TV">Television</SelectItem>
                        <SelectItem value="Computer">Computer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Devices Section */}
                <div className="border-t dark:border-white/10 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Monitor className="h-4 w-4 mr-2 text-purple-400" />
                      <label className="text-sm font-medium">Devices & Usage (minutes/day)</label>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDevices([...devices, { device: "AC", hours: 480 }])}
                    >
                      Add Device
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {devices.map((device, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Select
                          value={device.device}
                          onValueChange={(value) => {
                            const newDevices = [...devices];
                            newDevices[index].device = value;
                            setDevices(newDevices);
                          }}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AC">Air Conditioner</SelectItem>
                            <SelectItem value="TV">Television</SelectItem>
                            <SelectItem value="Refrigerator">Refrigerator</SelectItem>
                            <SelectItem value="WashingMachine">Washing Machine</SelectItem>
                            <SelectItem value="Heater">Heater</SelectItem>
                            <SelectItem value="Lights">Lights</SelectItem>
                            <SelectItem value="Computer">Computer</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex-1">
                          <Slider
                            value={[device.hours]}
                            max={1440}
                            min={1}
                            step={15}
                            onValueChange={(value) => {
                              const newDevices = [...devices];
                              newDevices[index].hours = value[0];
                              setDevices(newDevices);
                            }}
                          />
                        </div>
                        <span className="text-sm w-20 text-right">{device.hours} min</span>
                        {devices.length > 1 && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDevices(devices.filter((_, i) => i !== index))}
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced">
            <Card className="bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Factory className="h-5 w-5 mr-2 text-orange-400" />
                  Advanced Factors
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Energy Source Type */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Leaf className="h-4 w-4 mr-2 text-green-400" />
                    <label className="text-sm font-medium">Energy Source Mix</label>
                  </div>
                  <Select value={energySourceType} onValueChange={setEnergySourceType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mixed">Standard Grid Mix</SelectItem>
                      <SelectItem value="renewable">Renewable Priority</SelectItem>
                      <SelectItem value="solar">Solar Primary</SelectItem>
                      <SelectItem value="wind">Wind Primary</SelectItem>
                      <SelectItem value="fossil">Conventional Grid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Unexpected Events */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-400" />
                    <label className="text-sm font-medium">Unexpected Events</label>
                  </div>
                  <Select value={unexpectedEvent} onValueChange={setUnexpectedEvent}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="equipment_failure">Equipment Failure</SelectItem>
                      <SelectItem value="weather_event">Severe Weather</SelectItem>
                      <SelectItem value="grid_outage">Grid Outage</SelectItem>
                      <SelectItem value="maintenance">Scheduled Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Policy Regulation */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Battery className="h-4 w-4 mr-2 text-blue-400" />
                    <label className="text-sm font-medium">Policy/Regulation</label>
                  </div>
                  <Select value={policyRegulation} onValueChange={setPolicyRegulation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Rates</SelectItem>
                      <SelectItem value="peak_pricing">Peak Hour Pricing</SelectItem>
                      <SelectItem value="renewable_subsidy">Renewable Subsidy</SelectItem>
                      <SelectItem value="conservation">Conservation Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Backup Power */}
                <div className="space-y-2 col-span-full">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasBackupPower}
                      onChange={(e) => setHasBackupPower(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Has Backup Power (Battery/Generator)</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Button
            onClick={handlePredict}
            disabled={isLoading || !dataLoaded}
            className="flex-1 py-3"
            size="lg"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Generate Comprehensive Prediction
              </>
            )}
          </Button>
          <Button onClick={handleTrainModels} disabled={isLoading} variant="outline" size="lg">
            <Brain className="h-5 w-5 mr-2" />
            Retrain Models
          </Button>
          <Button
            onClick={() => {
              fetchCurrentWeather();
              fetchGridStatus();
            }}
            variant="outline"
            size="lg"
          >
            Refresh Data
          </Button>
        </div>

        {/* Prediction Results */}
        {prediction && (
          <div className="space-y-6" data-aos="fade-up">
            {/* Main Prediction Card */}
            <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-green-400" />
                  Energy Prediction Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Main Prediction */}
                  <div className="text-center p-4 bg-white/10 rounded-lg">
                    <div className="text-4xl font-bold text-green-400 mb-2">
                      {prediction.ensemble} kWh
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Ensemble Prediction
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      <Brain className="h-3 w-3 mr-1" />
                      {Math.round((prediction.model_scores?.random_forest || 0.9) * 100)}%
                      Confidence
                    </Badge>
                  </div>

                  {/* Supply/Demand Status */}
                  <div className="text-center p-4 bg-white/10 rounded-lg">
                    <div
                      className={`text-3xl font-bold mb-2 ${
                        prediction.supply_demand_balance.status === "surplus"
                          ? "text-green-400"
                          : prediction.supply_demand_balance.status === "shortage"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {prediction.supply_demand_balance.surplus_shortage > 0 ? "+" : ""}
                      {prediction.supply_demand_balance.surplus_shortage} kWh
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {prediction.supply_demand_balance.status === "surplus"
                        ? "Energy Surplus"
                        : prediction.supply_demand_balance.status === "shortage"
                        ? "Energy Shortage"
                        : "Balanced"}
                    </div>
                    <Badge
                      variant={
                        prediction.supply_demand_balance.status === "surplus"
                          ? "default"
                          : prediction.supply_demand_balance.status === "shortage"
                          ? "destructive"
                          : "secondary"
                      }
                      className="mt-2"
                    >
                      Grid Stress: {prediction.supply_demand_balance.grid_stress_index}%
                    </Badge>
                  </div>

                  {/* Cost Estimate */}
                  <div className="text-center p-4 bg-white/10 rounded-lg">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      ₹{costEstimate}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Estimated Daily Cost
                    </div>
                    <Badge variant="outline" className="mt-2">
                      {prediction.load_analysis.is_peak_hour ? "Peak Rates" : "Off-Peak Rates"}
                    </Badge>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                    <p className="text-sm">{prediction.supply_demand_balance.recommendation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Energy Demand */}
              <Card className="bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-orange-400" />
                    Energy Demand Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Predicted Consumption
                    </span>
                    <span className="font-medium">
                      {prediction.energy_demand.predicted_consumption} kWh
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Peak Demand</span>
                    <span className="font-medium text-red-400">
                      {prediction.energy_demand.peak_demand} kWh
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Off-Peak Demand</span>
                    <span className="font-medium text-green-400">
                      {prediction.energy_demand.off_peak_demand} kWh
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Trend</span>
                    <Badge
                      variant={
                        prediction.energy_demand.demand_trend === "increasing"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {prediction.energy_demand.demand_trend === "increasing" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {prediction.energy_demand.demand_trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Energy Generation */}
              <Card className="bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Sun className="h-5 w-5 mr-2 text-yellow-400" />
                    Energy Generation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <Sun className="h-4 w-4 mr-1 text-yellow-500" /> Solar
                    </span>
                    <span className="font-medium">
                      {prediction.energy_generation.solar_generation} kWh
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <Wind className="h-4 w-4 mr-1 text-cyan-500" /> Wind
                    </span>
                    <span className="font-medium">
                      {prediction.energy_generation.wind_generation} kWh
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Renewable Total</span>
                    <span className="font-medium text-green-400">
                      {prediction.energy_generation.renewable_total}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Fossil Fuel Required
                    </span>
                    <span className="font-medium text-orange-400">
                      {prediction.energy_generation.fossil_fuel_required} kWh
                    </span>
                  </div>
                  <Progress value={prediction.energy_generation.renewable_total} className="h-2" />
                </CardContent>
              </Card>

              {/* Load Analysis */}
              <Card className="bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-400" />
                    Load Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Residential Load
                      </span>
                      <span className="text-sm">{prediction.load_analysis.residential_load}%</span>
                    </div>
                    <Progress value={prediction.load_analysis.residential_load} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Industrial Load
                      </span>
                      <span className="text-sm">{prediction.load_analysis.industrial_load}%</span>
                    </div>
                    <Progress value={prediction.load_analysis.industrial_load} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Population Activity
                      </span>
                      <span className="text-sm">
                        {prediction.load_analysis.population_activity}%
                      </span>
                    </div>
                    <Progress value={prediction.load_analysis.population_activity} className="h-2" />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={prediction.load_analysis.is_peak_hour ? "destructive" : "default"}>
                      {prediction.load_analysis.is_peak_hour ? "Peak Hour" : "Off-Peak"}
                    </Badge>
                    <Badge variant="outline">
                      {prediction.load_analysis.is_weekend ? "Weekend" : "Weekday"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Weather Impact */}
              <Card className="bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Thermometer className="h-5 w-5 mr-2 text-red-400" />
                    Weather Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Temperature</span>
                    <span className="font-medium">{prediction.weather_impact.temperature}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Humidity</span>
                    <span className="font-medium">{prediction.weather_impact.humidity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Comfort Index</span>
                    <span className="font-medium">{prediction.weather_impact.comfort_index}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cooling Need</span>
                    <span className="font-medium text-blue-400">
                      {prediction.weather_impact.cooling_need}°
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Heating Need</span>
                    <span className="font-medium text-orange-400">
                      {prediction.weather_impact.heating_need}°
                    </span>
                  </div>
                  <Badge
                    variant={
                      prediction.weather_impact.weather_severity === "extreme"
                        ? "destructive"
                        : prediction.weather_impact.weather_severity === "moderate"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {prediction.weather_impact.weather_severity.toUpperCase()} Weather
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Factor Contributions */}
            <Card className="bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Factor Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(prediction.factor_contributions).map(([key, value]) => (
                    <div key={key} className="p-3 bg-gray-100 dark:bg-white/5 rounded-lg">
                      <div className="text-lg font-bold text-blue-400">{value}%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Model Comparison */}
            <Card className="bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Model Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { name: "Linear Regression", value: prediction.linear_regression },
                    { name: "K-Nearest Neighbors", value: prediction.knn },
                    { name: "Random Forest", value: prediction.random_forest },
                    { name: "Gradient Boosting", value: prediction.gradient_boosting },
                    { name: "Neural Network", value: prediction.neural_network },
                    { name: "Ensemble", value: prediction.ensemble, highlight: true },
                  ].map((model) => (
                    <div
                      key={model.name}
                      className={`p-3 rounded-lg text-center ${
                        model.highlight
                          ? "bg-green-500/20 border border-green-500/30"
                          : "bg-gray-100 dark:bg-white/5"
                      }`}
                    >
                      <div
                        className={`text-lg font-bold ${
                          model.highlight ? "text-green-400" : ""
                        }`}
                      >
                        {model.value} kWh
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{model.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Grid Status */}
            {gridStatus && (
              <Card className="bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Battery className="h-5 w-5 mr-2 text-green-400" />
                    Current Grid Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{gridStatus.current_load}%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Current Load</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {gridStatus.renewable_percentage}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Renewable</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">
                        {gridStatus.carbon_intensity}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">g CO₂/kWh</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        ₹{gridStatus.price_per_kwh}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">per kWh</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium mb-2">Energy Mix</div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {Object.entries(gridStatus.energy_mix).map(([source, value]) => (
                        <div key={source} className="text-center p-2 bg-gray-100 dark:bg-white/5 rounded">
                          <div className="text-sm font-medium">{value}%</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                            {source.replace(/_/g, " ")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Predict;
