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

import {
  Brain,
  Calendar,
  Database,
  Monitor,
  Thermometer,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import LoginModal from "@/components/LoginModal";

const Predict = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [autoMode, setAutoMode] = useState<boolean>(false);
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [locationData, setLocationData] = useState<any>(null);
  const [energyTips, setEnergyTips] = useState<string[]>([]);
  const [peakHours, setPeakHours] = useState<any>(null);
  const [costEstimate, setCostEstimate] = useState<number>(0);
  const [timeOfDay, setTimeOfDay] = useState<number>(12);
  const [dayType, setDayType] = useState<string>("weekday");
  const [devices, setDevices] = useState<{device: string, hours: number}[]>([{device: "AC", hours: 480}]);

  // New input states matching the screenshot
  const [homeId, setHomeId] = useState<number>(13);
  const [applianceType, setApplianceType] = useState<string>("Refrigerator");
  const [startTime, setStartTime] = useState<string>("05:00");
  const [endTime, setEndTime] = useState<string>("05:00");
  const [date, setDate] = useState<string>("2025-09-03");
  const [season, setSeason] = useState<string>("Summer");
  const [householdSize, setHouseholdSize] = useState<number>(12);

  const [prediction, setPrediction] = useState<{
    value: number;
    confidence: number;
    model: string;
    factors: { name: string; value: number }[];
  } | null>(null);

  const [comparison, setComparison] = useState<
    { model: string; accuracy: number; prediction: number }[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<string>("Checking API...");

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
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
    fetchEnergyTips();
    fetchPeakHours();
    calculateCostEstimate();
  }, [temperature, season, householdSize, devices]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoMode) {
      interval = setInterval(() => {
        fetchCurrentWeather();
        setCurrentDateTime();
        fetchRealTimeData();
        fetchEnergyTips();
        fetchPeakHours();
        calculateCostEstimate();
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [autoMode, temperature, season, householdSize, devices]);

  const setCurrentDateTime = () => {
    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    setStartTime(now.toTimeString().slice(0, 5));
    setSeason(getCurrentSeason());
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'Spring';
    if (month >= 6 && month <= 8) return 'Summer';
    if (month >= 9 && month <= 11) return 'Autumn';
    return 'Winter';
  };

  const fetchRealTimeData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/analytics/efficiency', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRealTimeData(data);
      }
    } catch (error) {
      console.log('Real-time data fetch failed');
    }
  };

  const fetchLocationData = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationData({ lat: latitude, lon: longitude });
        try {
          const response = await fetch(`http://localhost:3001/api/weather/current?lat=${latitude}&lon=${longitude}`);
          if (response.ok) {
            const weather = await response.json();
            setTemperature(Math.round(weather.temperature));
            setWeatherData(weather);
          }
        } catch (error) {
          console.log('Location weather fetch failed');
        }
      });
    }
  };

  const fetchEnergyTips = () => {
    const tips = [
      `At ${temperature}°C, set AC to ${temperature + 2}°C to save 10% energy`,
      `Peak hours 6-9 PM. Shift heavy appliances to save costs`,
      `${season}: Use natural ventilation when possible`,
      `Household ${householdSize}: LED bulbs save ₹500/month`,
      `Current weather ideal for air drying clothes`
    ];
    setEnergyTips(tips.slice(0, 3));
  };

  const fetchPeakHours = () => {
    const currentHour = new Date().getHours();
    const isPeak = currentHour >= 18 && currentHour <= 21;
    setPeakHours({
      current: currentHour,
      isPeak,
      rate: isPeak ? '₹8.5/kWh' : '₹5.2/kWh'
    });
  };

  const calculateCostEstimate = () => {
    const baseRate = peakHours?.isPeak ? 8.5 : 5.2;
    const deviceCost = devices.reduce((total, device) => {
      const rates = { AC: 2.5, TV: 0.15, Refrigerator: 0.4, WashingMachine: 1.5, Heater: 3.0, Lights: 0.1 };
      return total + ((rates[device.device as keyof typeof rates] || 1) * (device.hours / 60) * baseRate);
    }, 0);
    setCostEstimate(Math.round(deviceCost * 100) / 100);
  };

  const fetchCurrentWeather = async () => {
    setWeatherLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/weather/current');
      if (response.ok) {
        const weather = await response.json();
        console.log('Weather data:', weather);
        const newTemp = Math.round(weather.temperature);
        console.log('Setting temperature to:', newTemp);
        setTemperature(newTemp);
        setWeatherData(weather);
      } else {
        setTemperature(25);
      }
    } catch (error) {
      console.log('Weather fetch error:', error);
      setTemperature(25);
    }
    setWeatherLoading(false);
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowLoginModal(false);
    checkApiStatus();
  };

  const checkApiStatus = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "Outdoor Temperature (°C)": 25,
          "Household Size": 4,
        }),
      });
      if (response.ok) {
        setApiStatus("ML Models Ready");
        setDataLoaded(true);
      } else {
        setApiStatus("API Error");
      }
    } catch (error) {
      setApiStatus("API Offline - Start predict_api.py");
    }
  };

  const handleTrainModels = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
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

  const handlePredict = async () => {
    if (!dataLoaded) {
      alert("ML API is not available. Please start predict_api.py");
      return;
    }

    if (temperature === null) {
      alert("Please click 'Current Weather' to get temperature first");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperature: temperature,
          householdSize: householdSize,
          applianceType: applianceType,
          startTime: startTime,
          season: season,
          date: date,
          devices: devices,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Use the actual ML model predictions
        const lrPrediction = Math.round(data.linear_regression * 100) / 100;
        const knnPrediction = Math.round(data.knn * 100) / 100;
        const rfPrediction = Math.round(data.random_forest * 100) / 100;

        // Calculate factor impacts for display
        const temperatureImpact = Math.round(Math.abs(temperature - 22) * 2.5);
        const seasonImpact =
          season === "Summer" ? 15 : season === "Winter" ? 20 : 10;
        const householdImpact = Math.round(Math.abs(householdSize - 4) * 5);
        const dayOfWeek = new Date(date).getDay();
        const dayTypeImpact =
          dayType === "weekend" || dayOfWeek === 0 || dayOfWeek === 6 ? 12 : 8;
        const deviceImpact = devices.reduce((total, d) => {
          const deviceMultiplier = d.device === 'AC' ? 0.3 : d.device === 'TV' ? 0.15 : d.device === 'Refrigerator' ? 0.2 : 0.1;
          return total + (d.hours * deviceMultiplier / 10);
        }, 0);
        const startHour = parseInt(startTime.split(":")[0], 10);
        const endHour = parseInt(endTime.split(":")[0], 10);
        const duration =
          endHour >= startHour ? endHour - startHour : 24 - startHour + endHour;
        const durationImpact = Math.round((duration / 24) * 100);

        setPrediction({
          value: rfPrediction,
          confidence: Math.round(data.model_scores.random_forest * 100),
          model: "Random Forest",
          factors: [
            { name: "Temperature Impact", value: temperatureImpact },
            { name: "Season Impact", value: seasonImpact },
            { name: "Usage Duration", value: durationImpact },
            { name: "Household Size Impact", value: householdImpact },
            { name: "Day Type Impact", value: dayTypeImpact },
            { name: "Devices Usage Impact", value: Math.round(deviceImpact) },
          ],
        });

        setComparison([
          {
            model: "Linear Regression",
            accuracy: Math.round(data.model_scores.linear_regression * 100),
            prediction: lrPrediction,
          },
          {
            model: "K-Nearest Neighbors",
            accuracy: Math.round(data.model_scores.knn * 100),
            prediction: knnPrediction,
          },
          {
            model: "Random Forest",
            accuracy: Math.round(data.model_scores.random_forest * 100),
            prediction: rfPrediction,
          },
        ]);
        
        // Store prediction in database
        const token = localStorage.getItem('token');
        if (token) {
          try {
            await fetch('http://localhost:3001/api/store-prediction', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                temperature,
                householdSize,
                season,
                date,
                devices,
                predictedConsumption: rfPrediction,
                modelUsed: 'Random Forest',
                confidence: Math.round(data.model_scores.random_forest * 100)
              })
            });
          } catch (error) {
            console.log('Failed to store prediction:', error);
          }
        }
      } else {
        const errorData = await response.json();
        alert(`Prediction failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      alert(
        "Failed to connect to ML API. Please ensure predict_api.py is running."
      );
    }

    setIsLoading(false);
  };

  if (showLoginModal) {
    return <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 px-3 sm:px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12" data-aos="fade-up" data-aos-duration="1000">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Database className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            {apiStatus}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            Predict Your Energy Consumption
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-300 px-2">
            Enter your details below to predict your energy consumption using
            our model.
          </p>
        </div>

        {/* Input Form */}
        <section className="mb-6 sm:mb-8" data-aos="fade-up" data-aos-duration="1000">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Input Parameters</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Appliance Type */}
                {/* <div>
                  <label className="text-gray-200 text-xs sm:text-sm font-medium mb-2 block">
                    Appliance Type
                  </label>
                  <Select
                    onValueChange={setApplianceType}
                    defaultValue={applianceType}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={applianceType} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Refrigerator">Refrigerator</SelectItem>
                      <SelectItem value="AC">AC</SelectItem>
                      <SelectItem value="WashingMachine">
                        Washing Machine
                      </SelectItem>
                      <SelectItem value="Heater">Heater</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}

                {/* Date */}
                <div>
                  <label className="text-gray-200 text-xs sm:text-sm font-medium mb-2 block">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-white/10 text-white rounded p-2 sm:p-3 w-full text-sm sm:text-base"
                  />
                </div>

                {/* Outdoor Temperature */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Thermometer className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-400" />
                      <label
                        htmlFor="temperature"
                        className="text-gray-200 text-xs sm:text-sm font-medium"
                      >
                        Temperature (°C): {temperature !== null ? temperature : 'Click Current Weather'}
                      </label>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={fetchCurrentWeather}
                      disabled={weatherLoading}
                      className="text-xs"
                    >
                      {weatherLoading ? 'Loading...' : 'Current Weather'}
                    </Button>
                  </div>
                  {weatherData && (
                    <div className="text-xs text-gray-400 mb-2">
                      🌡️ {weatherData.temperature}°C, {weatherData.description}, 💧 {weatherData.humidity}%, 🌬️ {weatherData.windSpeed}m/s
                    </div>
                  )}
                  {!weatherData && (
                    <div className="text-xs text-yellow-400 mb-2">
                      ⚠️ Click "Current Weather" to get real temperature from your location
                    </div>
                  )}
                  <Slider
                    id="temperature"
                    value={[temperature || 20]}
                    max={40}
                    min={5}
                    step={1}
                    onValueChange={(value) => setTemperature(value[0])}
                    className="mb-4"
                    disabled={temperature === null}
                  />
                </div>

                {/* Season */}
                <div>
                  <label className="text-gray-200 text-xs sm:text-sm font-medium mb-2 block">
                    Season
                  </label>
                  <Select onValueChange={setSeason} defaultValue={season}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={season} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Summer">Summer</SelectItem>
                      <SelectItem value="Winter">Winter</SelectItem>
                      <SelectItem value="Rainy">Rainy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Household Size */}
                {/* <div>
                  <label className="text-gray-200 text-xs sm:text-sm font-medium mb-2 block">
                    Household Size: {householdSize}
                  </label>
                  <Slider
                    defaultValue={[householdSize]}
                    max={15}
                    min={1}
                    step={1}
                    onValueChange={(value) => setHouseholdSize(value[0])}
                    className="mb-4"
                  />
                </div> */}

                {/* Day Type */}
                <div>
                  <div className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-400" />
                    <label className="text-gray-200 text-xs sm:text-sm font-medium">
                      Day Type
                    </label>
                  </div>
                  <Select onValueChange={setDayType} defaultValue={dayType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select day type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekday">Weekday</SelectItem>
                      <SelectItem value="weekend">Weekend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>

              {/* Devices Section */}
              <div className="mt-4 sm:mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                  <div className="flex items-center">
                    <Monitor className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-400" />
                    <label className="text-gray-200 text-xs sm:text-sm font-medium">
                      Devices & Usage Minutes
                    </label>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDevices([...devices, {device: "AC", hours: 480}])}
                    className="text-xs sm:text-sm"
                  >
                    Add Device
                  </Button>
                </div>
                
                {devices.map((device, index) => (
                  <div key={index} className="mb-3 sm:mb-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center mb-2">
                      <div className="flex-1 w-full">
                        <Select
                          value={device.device}
                          onValueChange={(value) => {
                            const newDevices = [...devices];
                            newDevices[index].device = value;
                            setDevices(newDevices);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AC">Air Conditioner</SelectItem>
                            <SelectItem value="TV">Television</SelectItem>
                            <SelectItem value="Refrigerator">Refrigerator</SelectItem>
                            <SelectItem value="WashingMachine">Washing Machine</SelectItem>
                            <SelectItem value="Heater">Heater</SelectItem>
                            <SelectItem value="Lights">Lights</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="text-gray-200 text-xs sm:text-sm min-w-[80px] sm:min-w-[100px]">
                        {device.hours} minutes
                      </div>
                    </div>
                    <div className="mb-2">
                      <Slider
                        value={[device.hours]}
                        max={1440}
                        min={1}
                        step={1}
                        onValueChange={(value) => {
                          const newDevices = [...devices];
                          newDevices[index].hours = value[0];
                          setDevices(newDevices);
                        }}
                      />
                    </div>
                    <div className="flex justify-end">
                      {devices.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => setDevices(devices.filter((_, i) => i !== index))}
                          className="text-xs sm:text-sm"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Auto Mode Toggle */}
              <div className="flex items-center justify-between mt-4 p-3 bg-white/5 rounded-lg">
                <div>
                  <label className="text-gray-200 text-sm font-medium">Auto Mode</label>
                  <p className="text-xs text-gray-400">Automatically update data every 30 seconds</p>
                </div>
                <Button
                  type="button"
                  variant={autoMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoMode(!autoMode)}
                  className="text-xs"
                >
                  {autoMode ? 'ON' : 'OFF'}
                </Button>
              </div>

              {/* Real-time Data Display */}
              {realTimeData && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h4 className="text-sm font-medium text-green-400 mb-2">Live System Data</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-gray-300">Efficiency: <span className="text-green-400">{realTimeData.efficiency?.toFixed(1)}%</span></div>
                    <div className="text-gray-300">Anomalies: <span className="text-yellow-400">{realTimeData.anomalies || 0}</span></div>
                  </div>
                </div>
              )}

              {/* Location & Peak Hours */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-blue-400">Location</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={fetchLocationData}
                      className="text-xs"
                    >
                      Get Location
                    </Button>
                  </div>
                  {locationData ? (
                    <div className="text-xs text-gray-300">
                      Lat: {locationData.lat.toFixed(2)}, Lon: {locationData.lon.toFixed(2)}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">Click to get location</div>
                  )}
                </div>

                {peakHours && (
                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <h4 className="text-sm font-medium text-orange-400 mb-2">Peak Hours</h4>
                    <div className="text-xs text-gray-300">
                      <div>Status: {peakHours.isPeak ? 'Peak Time' : 'Off-Peak'}</div>
                      <div>Rate: {peakHours.rate}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cost & Tips */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {costEstimate > 0 && (
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-400 mb-2">Cost Estimate</h4>
                    <div className="text-lg font-bold text-white">₹{costEstimate}</div>
                    <div className="text-xs text-gray-400">Daily cost estimate</div>
                  </div>
                )}

                {energyTips.length > 0 && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-400 mb-2">Smart Tips</h4>
                    <div className="space-y-1">
                      {energyTips.map((tip, index) => (
                        <div key={index} className="text-xs text-gray-300">• {tip}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Fill Buttons */}
              <div className="mt-4">
                <label className="text-gray-200 text-sm font-medium mb-2 block">Quick Fill</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTemperature(25);
                      setHouseholdSize(4);
                      setSeason('Summer');
                      setDevices([{device: 'AC', hours: 480}]);
                    }}
                    className="text-xs"
                  >
                    Summer Home
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTemperature(15);
                      setHouseholdSize(3);
                      setSeason('Winter');
                      setDevices([{device: 'Heater', hours: 600}]);
                    }}
                    className="text-xs"
                  >
                    Winter Home
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTemperature(22);
                      setHouseholdSize(2);
                      setSeason('Spring');
                      setDevices([{device: 'TV', hours: 300}, {device: 'Refrigerator', hours: 1440}]);
                    }}
                    className="text-xs"
                  >
                    Office Mode
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const now = new Date();
                      const hour = now.getHours();
                      const temp = hour < 6 || hour > 20 ? 18 : hour > 12 ? 28 : 24;
                      setTemperature(temp);
                      setCurrentDateTime();
                      fetchCurrentWeather();
                    }}
                    className="text-xs"
                  >
                    Smart Auto
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTemperature(35);
                      setHouseholdSize(6);
                      setSeason('Summer');
                      setDevices([{device: 'AC', hours: 720}, {device: 'Refrigerator', hours: 1440}]);
                    }}
                    className="text-xs"
                  >
                    High Usage
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
                <Button
                  onClick={handlePredict}
                  disabled={isLoading || !dataLoaded}
                  className="flex-1 text-sm sm:text-base py-2 sm:py-3"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M12 4V2m0 16v2M4.22 4.22l-1.42 1.42M18.36 18.36l1.42 1.42M4 12H2m16 0h2M4.22 19.78l-1.42-1.42M18.36 5.64l1.42-1.42M15.535 15.536a5.5 5.5 0 10-7.07-7.072l.708-.707a6.5 6.5 0 118.485 8.485l-.708.707z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Predict Consumption
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleTrainModels}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1 text-sm sm:text-base py-2 sm:py-3"
                >
                  <Brain className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Retrain Models
                </Button>
                <Button
                  onClick={() => {
                    fetchCurrentWeather();
                    fetchLocationData();
                    fetchRealTimeData();
                    fetchEnergyTips();
                    fetchPeakHours();
                    calculateCostEstimate();
                  }}
                  variant="outline"
                  className="text-sm sm:text-base py-2 sm:py-3"
                >
                  Refresh All
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Prediction Results */}
        {prediction && (
          <section data-aos="fade-up" data-aos-duration="1000">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2 inline-block" />
                  Predicted Energy Consumption
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="mb-4">
                  <div className="text-gray-300 mb-1 text-sm sm:text-base">
                    Estimated Consumption:
                    <span className="font-bold text-white ml-1">
                      {prediction.value} kWh
                    </span>
                  </div>
                  <Progress value={prediction.confidence} className="mb-2" />
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400">
                    <span>Confidence Level</span>
                    <span>{prediction.confidence}%</span>
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    <Brain className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    {prediction.model}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white mb-3">
                    Factors Influencing Prediction
                  </h4>
                  <ul className="list-none pl-0">
                    {prediction.factors.map((factor, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-white/10"
                      >
                        <span className="text-gray-300 text-xs sm:text-sm">{factor.name}</span>
                        <span className="text-green-400 text-xs sm:text-sm">{factor.value}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Model Comparison */}
        {comparison.length > 0 && (
          <section className="mt-6 sm:mt-8" data-aos="fade-up" data-aos-duration="1000">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
              Model Comparison
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {comparison.map((model, index) => (
                <Card key={index} className="bg-white/5 border-white/10">
                  <CardContent className="p-4 sm:p-6">
                    <h4 className="text-sm sm:text-lg font-bold text-white mb-2">
                      {model.model}
                    </h4>
                    <div className="text-gray-300 mb-2 text-xs sm:text-sm">
                      Accuracy:{" "}
                      <span className="text-green-400">{model.accuracy}%</span>
                    </div>
                    <div className="text-gray-300 text-xs sm:text-sm">
                      Prediction:{" "}
                      <span className="text-blue-400">
                        {model.prediction} kWh
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Predict;