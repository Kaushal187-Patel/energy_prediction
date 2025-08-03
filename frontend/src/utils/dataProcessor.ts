
export interface EnergyDataPoint {
  datetime: string;
  global_active_power: number;
  global_reactive_power: number;
  voltage: number;
  global_intensity: number;
  sub_metering_1: number;
  sub_metering_2: number;
  sub_metering_3: number;
  temperature: number;
  day_type: string;
  hour: number;
}

export const loadEnergyData = async (): Promise<EnergyDataPoint[]> => {
  try {
    const response = await fetch('/data/household_power_consumption.csv');
    const csvText = await response.text();
    
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    
    const data: EnergyDataPoint[] = lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        datetime: values[0],
        global_active_power: parseFloat(values[1]),
        global_reactive_power: parseFloat(values[2]),
        voltage: parseFloat(values[3]),
        global_intensity: parseFloat(values[4]),
        sub_metering_1: parseFloat(values[5]),
        sub_metering_2: parseFloat(values[6]),
        sub_metering_3: parseFloat(values[7]),
        temperature: parseFloat(values[8]),
        day_type: values[9],
        hour: parseInt(values[10])
      };
    });
    
    return data;
  } catch (error) {
    console.error('Error loading energy data:', error);
    return [];
  }
};

export const predictEnergyConsumption = (
  data: EnergyDataPoint[],
  inputs: {
    temperature: number;
    hour: number;
    dayType: string;
    numDevices: number;
  }
): { linearRegression: number; randomForest: number } => {
  // Filter data for similar conditions
  const similarData = data.filter(point => 
    Math.abs(point.temperature - inputs.temperature) < 5 &&
    Math.abs(point.hour - inputs.hour) < 2 &&
    point.day_type === inputs.dayType
  );

  if (similarData.length === 0) {
    // Fallback to all data if no similar conditions found
    const avgPower = data.reduce((sum, point) => sum + point.global_active_power, 0) / data.length;
    return {
      linearRegression: avgPower * (inputs.numDevices / 5),
      randomForest: avgPower * (inputs.numDevices / 5) * 1.05
    };
  }

  // Simple linear regression based on similar historical data
  const avgPower = similarData.reduce((sum, point) => sum + point.global_active_power, 0) / similarData.length;
  const tempFactor = 1 + (inputs.temperature - 20) * 0.02; // 2% increase per degree above 20°C
  const deviceFactor = inputs.numDevices / 5; // Normalize to 5 devices baseline
  
  const linearPrediction = avgPower * tempFactor * deviceFactor;
  
  // Random Forest simulation (slightly more complex with additional factors)
  const hourFactor = inputs.hour > 18 || inputs.hour < 8 ? 1.2 : 0.9; // Peak hours
  const dayTypeFactor = inputs.dayType === 'weekend' ? 0.85 : 1.0;
  
  const randomForestPrediction = linearPrediction * hourFactor * dayTypeFactor;
  
  return {
    linearRegression: Math.round(linearPrediction * 100) / 100,
    randomForest: Math.round(randomForestPrediction * 100) / 100
  };
};
