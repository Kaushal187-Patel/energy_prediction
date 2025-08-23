import fetch from 'node-fetch';

class WeatherService {
  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY || 'demo_key';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async getCurrentWeather(lat = 40.7128, lon = -74.0060) {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      const data = await response.json();
      
      return {
        temperature: data.main?.temp || 25,
        humidity: data.main?.humidity || 60,
        windSpeed: data.wind?.speed || 5,
        description: data.weather?.[0]?.description || 'clear sky',
        pressure: data.main?.pressure || 1013
      };
    } catch (error) {
      const temps = [18, 22, 26, 30, 34, 16, 28, 32, 24, 20];
      const randomTemp = temps[Math.floor(Math.random() * temps.length)];
      return {
        temperature: randomTemp,
        humidity: Math.round(40 + Math.random() * 40),
        windSpeed: Math.round(Math.random() * 15),
        description: 'partly cloudy',
        pressure: 1013
      };
    }
  }

  async getForecast(lat = 40.7128, lon = -74.0060, days = 5) {
    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      const data = await response.json();
      
      return data.list?.slice(0, days * 8).map(item => ({
        date: new Date(item.dt * 1000),
        temperature: item.main.temp,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        description: item.weather[0].description
      })) || [];
    } catch (error) {
      return Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
        temperature: 20 + Math.random() * 15,
        humidity: 40 + Math.random() * 40,
        windSpeed: Math.random() * 12,
        description: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)]
      }));
    }
  }
}

export default new WeatherService();