import fetch from 'node-fetch';

class WeatherService {
  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    
    if (!this.apiKey || this.apiKey === 'demo_key' || this.apiKey === 'your_openweather_api_key_here') {
      console.log('⚠️  Weather API: Using mock data. Get a free API key from https://openweathermap.org/api');
    } else {
      console.log('✅ Weather API: Connected with API key');
    }
  }

  async getCurrentWeather(lat = 40.7128, lon = -74.0060) {
    // Check if we have a valid API key
    if (!this.apiKey || this.apiKey === 'demo_key' || this.apiKey === 'your_openweather_api_key_here') {
      console.log('No valid weather API key found, using mock data');
      return this.getMockWeatherData();
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        temperature: Math.round(data.main?.temp || 25),
        humidity: data.main?.humidity || 60,
        windSpeed: Math.round((data.wind?.speed || 5) * 10) / 10,
        description: data.weather?.[0]?.description || 'clear sky',
        pressure: data.main?.pressure || 1013
      };
    } catch (error) {
      console.log('Weather API failed, using mock data:', error.message);
      return this.getMockWeatherData();
    }
  }

  getMockWeatherData() {
    const hour = new Date().getHours();
    const month = new Date().getMonth() + 1;
    
    // Generate realistic temperature based on time and season
    let baseTemp = 22;
    if (month >= 4 && month <= 9) baseTemp = 28; // Summer
    if (month >= 11 || month <= 2) baseTemp = 16; // Winter
    
    // Adjust for time of day
    if (hour >= 6 && hour <= 10) baseTemp -= 3;
    if (hour >= 14 && hour <= 18) baseTemp += 4;
    if (hour >= 22 || hour <= 5) baseTemp -= 5;
    
    const temperature = Math.round(baseTemp + (Math.random() - 0.5) * 6);
    
    const descriptions = ['clear sky', 'few clouds', 'scattered clouds', 'partly cloudy', 'sunny'];
    
    return {
      temperature,
      humidity: Math.round(45 + Math.random() * 35),
      windSpeed: Math.round((2 + Math.random() * 8) * 10) / 10,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      pressure: Math.round(1010 + Math.random() * 20)
    };
  }

  async getForecast(lat = 40.7128, lon = -74.0060, days = 5) {
    if (!this.apiKey || this.apiKey === 'demo_key' || this.apiKey === 'your_openweather_api_key_here') {
      return this.getMockForecastData(days);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.list?.slice(0, days * 8).map(item => ({
        date: new Date(item.dt * 1000),
        temperature: Math.round(item.main.temp),
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 10) / 10,
        description: item.weather[0].description
      })) || [];
    } catch (error) {
      console.log('Forecast API failed, using mock data:', error.message);
      return this.getMockForecastData(days);
    }
  }

  getMockForecastData(days) {
    const currentWeather = this.getMockWeatherData();
    
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      const tempVariation = (Math.random() - 0.5) * 8;
      
      return {
        date,
        temperature: Math.round(currentWeather.temperature + tempVariation),
        humidity: Math.round(40 + Math.random() * 40),
        windSpeed: Math.round((2 + Math.random() * 10) * 10) / 10,
        description: ['sunny', 'partly cloudy', 'cloudy', 'light rain'][Math.floor(Math.random() * 4)]
      };
    });
  }
}

export default new WeatherService();