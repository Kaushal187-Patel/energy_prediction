from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import subprocess
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

# =====================================================
# LOAD TRAINED MODELS
# =====================================================

models = {}
feature_info = {}
scaler = None

def load_all_models():
    global models, feature_info, scaler
    
    try:
        # Load basic models
        with open('linear_regression_model.pkl', 'rb') as f:
            models['linear_regression'] = pickle.load(f)
        with open('knn_model.pkl', 'rb') as f:
            models['knn'] = pickle.load(f)
        with open('random_forest_model.pkl', 'rb') as f:
            models['random_forest'] = pickle.load(f)
        
        # Load advanced models
        try:
            with open('gradient_boosting_model.pkl', 'rb') as f:
                models['gradient_boosting'] = pickle.load(f)
            with open('neural_network_model.pkl', 'rb') as f:
                models['neural_network'] = pickle.load(f)
            with open('demand_model.pkl', 'rb') as f:
                models['demand'] = pickle.load(f)
            with open('generation_model.pkl', 'rb') as f:
                models['generation'] = pickle.load(f)
            print('✅ Advanced models loaded')
        except Exception as e:
            print(f'⚠️ Advanced models not found: {e}')
        
        # Load feature info and scaler
        with open('feature_info.pkl', 'rb') as f:
            feature_info.update(pickle.load(f))
        
        try:
            with open('scaler.pkl', 'rb') as f:
                scaler = pickle.load(f)
        except:
            scaler = None
        
        print('✅ All models loaded successfully')
        print(f'📊 Features: {len(feature_info.get("feature_cols", []))}')
        
    except Exception as e:
        print(f'❌ Error loading models: {e}')
        print('Please run train_models.py first')

load_all_models()

# =====================================================
# HELPER FUNCTIONS
# =====================================================

def calculate_weather_features(data):
    """Calculate derived weather features from input data"""
    temp = data.get('temperature', 25)
    humidity = data.get('humidity', 60)
    wind_speed = data.get('windSpeed', 5)
    solar_radiation = data.get('solarRadiation', 400)
    rainfall = data.get('rainfall', 0)
    cloud_cover = data.get('cloudCover', 30)
    
    # Heat Index
    heat_index = temp - ((100 - humidity) / 5)
    
    # Cooling/Heating Degree
    cooling_degree = max(0, temp - 22)
    heating_degree = max(0, 18 - temp)
    
    # Comfort Index
    comfort_index = temp - (humidity - 50) * 0.1
    
    # Temperature-Humidity Interaction
    temp_humidity_interaction = temp * humidity / 100
    
    # Wind Chill
    if temp < 10 and wind_speed > 0:
        wind_chill = (13.12 + 0.6215 * temp - 11.37 * (wind_speed ** 0.16) + 
                     0.3965 * temp * (wind_speed ** 0.16))
    else:
        wind_chill = temp
    
    return {
        'HeatIndex': heat_index,
        'CoolingDegree': cooling_degree,
        'HeatingDegree': heating_degree,
        'ComfortIndex': comfort_index,
        'TempHumidityInteraction': temp_humidity_interaction,
        'WindChill': wind_chill
    }

def calculate_energy_source_features(data):
    """Calculate energy source mix features"""
    solar_radiation = data.get('solarRadiation', 400)
    wind_speed = data.get('windSpeed', 5)
    hour = data.get('hour', 12)
    
    # Solar contribution (max 30%)
    solar_contribution = (solar_radiation / 1000) * 30
    
    # Wind contribution (max 20%)
    wind_contribution = (wind_speed / 15) * 20
    
    # Total renewable
    renewable_total = min(50, solar_contribution + wind_contribution)
    
    # Fossil fuel (remaining)
    fossil_fuel = 100 - renewable_total
    
    # Grid stress index
    is_peak = 1 if 18 <= hour <= 21 else 0
    temp = data.get('temperature', 25)
    grid_stress = is_peak * 20 + abs(temp - 22) * 2 + (100 - renewable_total) * 0.3
    
    return {
        'SolarContribution': solar_contribution,
        'WindContribution': wind_contribution,
        'RenewableTotal': renewable_total,
        'FossilFuelContribution': fossil_fuel,
        'GridStressIndex': min(100, grid_stress)
    }

def calculate_load_patterns(data):
    """Calculate load pattern features"""
    hour = data.get('hour', 12)
    is_weekend = data.get('isWeekend', 0)
    
    # Residential load pattern
    if 17 <= hour <= 23:
        residential_load = 0.8
    elif 6 <= hour <= 9:
        residential_load = 0.6
    else:
        residential_load = 0.3
    
    # Industrial load pattern
    if 9 <= hour <= 17 and not is_weekend:
        industrial_load = 0.9
    else:
        industrial_load = 0.2
    
    # Population activity index
    population_activity = residential_load * 0.6 + industrial_load * 0.4 + (1 - is_weekend) * 0.1
    
    return {
        'ResidentialLoad': residential_load,
        'IndustrialLoad': industrial_load,
        'PopulationActivityIndex': min(1, population_activity)
    }

def prepare_features(data):
    """Prepare full feature vector for prediction"""
    features = {}
    
    # Basic features
    features['Outdoor Temperature (°C)'] = data.get('temperature', 25)
    features['Household Size'] = data.get('householdSize', 4)
    
    # Time features
    hour = 12
    if 'startTime' in data:
        try:
            hour = int(data['startTime'].split(':')[0])
        except:
            hour = 12
    
    features['Hour'] = hour
    features['Hour_Sin'] = np.sin(2 * np.pi * hour / 24)
    features['Hour_Cos'] = np.cos(2 * np.pi * hour / 24)
    features['IsPeakHour'] = 1 if 18 <= hour <= 21 else 0
    features['TimeOfDay'] = 0 if hour < 6 else (1 if hour < 12 else (2 if hour < 18 else 3))
    
    # Date features
    if 'date' in data:
        try:
            date_obj = datetime.strptime(data['date'], '%Y-%m-%d')
            features['DayOfWeek'] = date_obj.weekday()
            features['Month'] = date_obj.month
            features['IsWeekend'] = 1 if date_obj.weekday() >= 5 else 0
            features['Quarter'] = (date_obj.month - 1) // 3 + 1
            features['Month_Sin'] = np.sin(2 * np.pi * date_obj.month / 12)
            features['Month_Cos'] = np.cos(2 * np.pi * date_obj.month / 12)
            features['DayOfWeek_Sin'] = np.sin(2 * np.pi * date_obj.weekday() / 7)
            features['DayOfWeek_Cos'] = np.cos(2 * np.pi * date_obj.weekday() / 7)
        except:
            features['DayOfWeek'] = 0
            features['Month'] = 6
            features['IsWeekend'] = 0
            features['Quarter'] = 2
            features['Month_Sin'] = 0
            features['Month_Cos'] = 1
            features['DayOfWeek_Sin'] = 0
            features['DayOfWeek_Cos'] = 1
    else:
        now = datetime.now()
        features['DayOfWeek'] = now.weekday()
        features['Month'] = now.month
        features['IsWeekend'] = 1 if now.weekday() >= 5 else 0
        features['Quarter'] = (now.month - 1) // 3 + 1
        features['Month_Sin'] = np.sin(2 * np.pi * now.month / 12)
        features['Month_Cos'] = np.cos(2 * np.pi * now.month / 12)
        features['DayOfWeek_Sin'] = np.sin(2 * np.pi * now.weekday() / 7)
        features['DayOfWeek_Cos'] = np.cos(2 * np.pi * now.weekday() / 7)
    
    # Weather features
    features['Humidity'] = data.get('humidity', 60)
    features['WindSpeed'] = data.get('windSpeed', 5)
    features['SolarRadiation'] = data.get('solarRadiation', 400)
    features['Rainfall'] = data.get('rainfall', 0)
    features['CloudCover'] = data.get('cloudCover', 30)
    
    # Derived weather features
    weather_derived = calculate_weather_features(data)
    features.update(weather_derived)
    
    # Energy source features
    data['hour'] = hour
    data['isWeekend'] = features['IsWeekend']
    energy_sources = calculate_energy_source_features(data)
    features.update(energy_sources)
    
    # Load patterns
    load_patterns = calculate_load_patterns(data)
    features.update(load_patterns)
    
    # Household base load
    features['HouseholdBaseLoad'] = features['Household Size'] * 0.5
    
    # Appliance efficiency
    appliance_efficiency = {
        'Fridge': 0.95, 'Refrigerator': 0.95, 'Oven': 0.85, 'Dishwasher': 0.9,
        'Heater': 0.8, 'Microwave': 0.95, 'Air Conditioning': 0.85, 'AC': 0.85,
        'Computer': 0.9, 'Washing Machine': 0.88, 'WashingMachine': 0.88,
        'Lights': 0.95, 'TV': 0.92
    }
    appliance = data.get('applianceType', 'AC')
    features['ApplianceEfficiency'] = appliance_efficiency.get(appliance, 0.9)
    
    # Encode appliance
    appliance_encoder = feature_info.get('appliance_encoder')
    if appliance_encoder:
        try:
            features['Appliance_Encoded'] = appliance_encoder.transform([appliance])[0]
        except:
            features['Appliance_Encoded'] = 0
    else:
        features['Appliance_Encoded'] = 0
    
    # Encode season
    season_encoder = feature_info.get('season_encoder')
    season = data.get('season', 'Summer')
    if season_encoder:
        try:
            features['Season_Encoded'] = season_encoder.transform([season])[0]
        except:
            features['Season_Encoded'] = 0
    else:
        features['Season_Encoded'] = 0
    
    # Device impact calculation
    devices = data.get('devices', [])
    total_device_impact = 0
    device_multipliers = {
        'AC': 2.5, 'TV': 0.15, 'Refrigerator': 0.4, 'Fridge': 0.4,
        'WashingMachine': 1.5, 'Washing Machine': 1.5, 'Heater': 3.0,
        'Lights': 0.1, 'Computer': 0.2, 'Microwave': 1.2
    }
    
    for device in devices:
        device_type = device.get('device', 'AC')
        usage_minutes = device.get('hours', 480)
        multiplier = device_multipliers.get(device_type, 1.0)
        total_device_impact += (usage_minutes / 60) * multiplier
    
    return features, total_device_impact

# =====================================================
# PREDICTION ENDPOINTS
# =====================================================

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint with comprehensive energy forecasting"""
    try:
        data = request.json
        print('📥 Received prediction request:', data)
        
        # Prepare features
        features, device_impact = prepare_features(data)
        
        # Get feature columns from training
        feature_cols = feature_info.get('feature_cols', [])
        
        # Create feature array in correct order
        feature_array = np.array([features.get(col, 0) for col in feature_cols]).reshape(1, -1)
        
        # Make predictions with all available models
        predictions = {}
        
        # Basic models
        if 'linear_regression' in models:
            predictions['linear_regression'] = float(models['linear_regression'].predict(feature_array)[0] + device_impact)
        
        if 'knn' in models:
            predictions['knn'] = float(models['knn'].predict(feature_array)[0] + device_impact)
        
        if 'random_forest' in models:
            predictions['random_forest'] = float(models['random_forest'].predict(feature_array)[0] + device_impact)
        
        # Advanced models
        if 'gradient_boosting' in models:
            predictions['gradient_boosting'] = float(models['gradient_boosting'].predict(feature_array)[0] + device_impact)
        
        if 'neural_network' in models and scaler is not None:
            feature_scaled = scaler.transform(feature_array)
            predictions['neural_network'] = float(models['neural_network'].predict(feature_scaled)[0] + device_impact)
        
        # Ensemble prediction (weighted average)
        ensemble_weights = {
            'random_forest': 0.35,
            'gradient_boosting': 0.35,
            'neural_network': 0.20,
            'knn': 0.10
        }
        
        ensemble_pred = 0
        total_weight = 0
        for model_name, weight in ensemble_weights.items():
            if model_name in predictions:
                ensemble_pred += predictions[model_name] * weight
                total_weight += weight
        
        if total_weight > 0:
            predictions['ensemble'] = ensemble_pred / total_weight
        else:
            predictions['ensemble'] = predictions.get('random_forest', 0)
        
        # Get model scores
        model_scores = feature_info.get('model_scores', {})
        
        # Energy source analysis
        energy_sources = calculate_energy_source_features(data)
        
        # Load analysis
        load_patterns = calculate_load_patterns(data)
        
        # Demand vs Generation analysis
        demand = predictions['ensemble']
        generation_capacity = energy_sources['RenewableTotal'] + 50  # 50 = base grid capacity
        surplus_shortage = generation_capacity - demand
        
        response = {
            # Model predictions
            'linear_regression': round(predictions.get('linear_regression', 0), 2),
            'knn': round(predictions.get('knn', 0), 2),
            'random_forest': round(predictions.get('random_forest', 0), 2),
            'gradient_boosting': round(predictions.get('gradient_boosting', 0), 2),
            'neural_network': round(predictions.get('neural_network', 0), 2),
            'ensemble': round(predictions['ensemble'], 2),
            
            # Model accuracy scores
            'model_scores': model_scores,
            
            # Energy demand forecast
            'energy_demand': {
                'predicted_consumption': round(predictions['ensemble'], 2),
                'peak_demand': round(predictions['ensemble'] * 1.3, 2),
                'off_peak_demand': round(predictions['ensemble'] * 0.7, 2),
                'demand_trend': 'increasing' if features.get('IsPeakHour', 0) else 'stable'
            },
            
            # Energy generation forecast
            'energy_generation': {
                'solar_generation': round(energy_sources['SolarContribution'] * 2, 2),
                'wind_generation': round(energy_sources['WindContribution'] * 1.5, 2),
                'renewable_total': round(energy_sources['RenewableTotal'], 2),
                'fossil_fuel_required': round(max(0, demand - energy_sources['RenewableTotal']), 2),
                'generation_capacity': round(generation_capacity, 2)
            },
            
            # Surplus/Shortage analysis
            'supply_demand_balance': {
                'surplus_shortage': round(surplus_shortage, 2),
                'status': 'surplus' if surplus_shortage > 5 else ('shortage' if surplus_shortage < -5 else 'balanced'),
                'grid_stress_index': round(energy_sources['GridStressIndex'], 1),
                'recommendation': get_recommendation(surplus_shortage, energy_sources['GridStressIndex'])
            },
            
            # Load patterns
            'load_analysis': {
                'residential_load': round(load_patterns['ResidentialLoad'] * 100, 1),
                'industrial_load': round(load_patterns['IndustrialLoad'] * 100, 1),
                'population_activity': round(load_patterns['PopulationActivityIndex'] * 100, 1),
                'is_peak_hour': bool(features.get('IsPeakHour', 0)),
                'is_weekend': bool(features.get('IsWeekend', 0))
            },
            
            # Weather impact
            'weather_impact': {
                'temperature': features.get('Outdoor Temperature (°C)', 25),
                'humidity': features.get('Humidity', 60),
                'comfort_index': round(features.get('ComfortIndex', 20), 1),
                'cooling_need': round(features.get('CoolingDegree', 0), 1),
                'heating_need': round(features.get('HeatingDegree', 0), 1),
                'weather_severity': 'extreme' if abs(features.get('Outdoor Temperature (°C)', 25) - 22) > 15 else 
                                   ('moderate' if abs(features.get('Outdoor Temperature (°C)', 25) - 22) > 8 else 'normal')
            },
            
            # Factor contributions
            'factor_contributions': {
                'temperature_impact': round(abs(features.get('Outdoor Temperature (°C)', 25) - 22) * 2.5, 1),
                'humidity_impact': round(abs(features.get('Humidity', 60) - 50) * 0.3, 1),
                'time_impact': round(features.get('IsPeakHour', 0) * 15 + (1 - features.get('IsWeekend', 0)) * 5, 1),
                'household_impact': round(features.get('Household Size', 4) * 3, 1),
                'device_impact': round(device_impact, 1),
                'weather_impact': round(features.get('CoolingDegree', 0) * 2 + features.get('HeatingDegree', 0) * 2.5, 1),
                'renewable_offset': round(energy_sources['RenewableTotal'] * 0.5, 1)
            }
        }
        
        print('📤 Sending response with comprehensive predictions')
        return jsonify(response)
        
    except Exception as e:
        print(f'❌ Prediction error: {e}')
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400

def get_recommendation(surplus_shortage, grid_stress):
    """Generate recommendation based on supply-demand analysis"""
    if surplus_shortage > 20:
        return "Optimal conditions for energy-intensive activities. Consider charging EVs or running heavy appliances."
    elif surplus_shortage > 5:
        return "Slight energy surplus. Good time for regular household activities."
    elif surplus_shortage > -5:
        return "Balanced grid conditions. Monitor usage during peak hours."
    elif surplus_shortage > -15:
        return "Approaching shortage. Consider reducing non-essential loads."
    else:
        return "High grid stress. Recommend postponing heavy appliance usage to off-peak hours."

@app.route('/predict/advanced', methods=['POST'])
def predict_advanced():
    """Multi-horizon forecasting with time-series analysis"""
    try:
        data = request.json
        features, device_impact = prepare_features(data)
        
        # Get feature columns
        feature_cols = feature_info.get('feature_cols', [])
        feature_array = np.array([features.get(col, 0) for col in feature_cols]).reshape(1, -1)
        
        # Multi-horizon predictions
        horizons = {
            '1_hour': 1,
            '6_hours': 6,
            '24_hours': 24,
            '7_days': 168,
            '30_days': 720
        }
        
        predictions = {}
        base_prediction = float(models['random_forest'].predict(feature_array)[0] + device_impact)
        
        for horizon_name, hours in horizons.items():
            # Apply time-based adjustments
            adjustment = 1.0
            if hours <= 24:
                # Short-term: consider time of day progression
                adjustment = 1.0 + np.sin(2 * np.pi * hours / 24) * 0.1
            elif hours <= 168:
                # Weekly: consider weekend patterns
                adjustment = 0.95 + np.random.normal(0, 0.05)
            else:
                # Monthly: consider seasonal trends
                adjustment = 1.0 + np.random.normal(0, 0.1)
            
            predictions[horizon_name] = {
                'prediction': round(base_prediction * adjustment, 2),
                'confidence': round(max(0.5, 1 - hours/1000), 2),
                'uncertainty_range': [
                    round(base_prediction * adjustment * 0.85, 2),
                    round(base_prediction * adjustment * 1.15, 2)
                ]
            }
        
        return jsonify({
            'multi_horizon_forecast': predictions,
            'base_prediction': round(base_prediction, 2),
            'forecast_generated_at': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/weather/current', methods=['GET'])
def get_weather():
    """Get current weather data (mock for demo)"""
    try:
        hour = datetime.now().hour
        month = datetime.now().month
        
        # Simulate realistic weather based on time and season
        base_temp = 22
        if month in [12, 1, 2]:  # Winter
            base_temp = 15
        elif month in [6, 7, 8]:  # Summer
            base_temp = 32
        
        # Time-based adjustment
        if 14 <= hour <= 17:
            base_temp += 5
        elif 3 <= hour <= 6:
            base_temp -= 5
        
        weather_data = {
            'temperature': round(base_temp + np.random.normal(0, 3), 1),
            'humidity': round(55 + np.random.normal(0, 15), 1),
            'windSpeed': round(5 + np.random.normal(0, 2), 1),
            'solarRadiation': round(max(0, np.sin(np.pi * (hour - 6) / 12) * 800) if 6 <= hour <= 18 else 0, 0),
            'rainfall': round(max(0, np.random.exponential(2)), 1),
            'cloudCover': round(30 + np.random.normal(0, 20), 0),
            'description': 'partly cloudy',
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(weather_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/grid/status', methods=['GET'])
def get_grid_status():
    """Get current grid status and energy mix"""
    try:
        hour = datetime.now().hour
        
        # Simulate grid status
        solar = max(0, np.sin(np.pi * (hour - 6) / 12) * 30) if 6 <= hour <= 18 else 0
        wind = 10 + np.random.normal(0, 5)
        renewable_total = solar + wind
        
        grid_status = {
            'current_load': round(65 + np.random.normal(0, 10), 1),
            'max_capacity': 100,
            'energy_mix': {
                'solar': round(solar, 1),
                'wind': round(max(0, wind), 1),
                'hydro': 8,
                'nuclear': 20,
                'natural_gas': round(max(0, 40 - renewable_total), 1),
                'coal': round(max(0, 22 - renewable_total * 0.5), 1)
            },
            'renewable_percentage': round(renewable_total + 8, 1),  # +8 for hydro
            'carbon_intensity': round(400 - renewable_total * 5, 0),  # g CO2/kWh
            'grid_frequency': round(50 + np.random.normal(0, 0.1), 2),
            'is_peak': 18 <= hour <= 21,
            'price_per_kwh': round(5.5 if 18 <= hour <= 21 else 4.2, 2)
        }
        
        return jsonify(grid_status)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/alerts/check', methods=['POST'])
def check_alerts():
    """Check for energy-related alerts based on predictions"""
    try:
        data = request.json
        alerts = []
        
        prediction = data.get('prediction', 0)
        threshold = data.get('threshold', 100)
        grid_stress = data.get('gridStress', 50)
        
        if prediction > threshold * 1.5:
            alerts.append({
                'type': 'high_consumption',
                'severity': 'critical',
                'message': f'Predicted consumption ({prediction:.1f} kWh) significantly exceeds threshold',
                'recommendation': 'Consider reducing non-essential loads immediately'
            })
        elif prediction > threshold:
            alerts.append({
                'type': 'high_consumption',
                'severity': 'warning',
                'message': f'Predicted consumption ({prediction:.1f} kWh) exceeds threshold',
                'recommendation': 'Monitor usage and consider energy-saving measures'
            })
        
        if grid_stress > 80:
            alerts.append({
                'type': 'grid_stress',
                'severity': 'critical',
                'message': 'High grid stress detected',
                'recommendation': 'Postpone heavy appliance usage to off-peak hours'
            })
        
        hour = datetime.now().hour
        if 18 <= hour <= 21:
            alerts.append({
                'type': 'peak_hours',
                'severity': 'info',
                'message': 'Currently in peak pricing hours',
                'recommendation': 'Energy costs are higher during this period'
            })
        
        return jsonify({'alerts': alerts})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/train', methods=['POST'])
def train():
    """Retrain all models with latest data"""
    try:
        result = subprocess.run(['python', 'train_models.py'], capture_output=True, text=True)
        
        if result.returncode == 0:
            # Reload all models
            load_all_models()
            
            return jsonify({
                'message': 'All models trained and reloaded successfully!',
                'output': result.stdout[-1000:] if len(result.stdout) > 1000 else result.stdout
            }), 200
        else:
            return jsonify({
                'error': 'Training failed',
                'details': result.stderr
            }), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'models_loaded': len(models),
        'features_available': len(feature_info.get('feature_cols', [])),
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print('\n' + '=' * 60)
    print('🚀 ENHANCED ENERGY PREDICTION API')
    print('=' * 60)
    print('Available endpoints:')
    print('  POST /predict          - Main prediction with all factors')
    print('  POST /predict/advanced - Multi-horizon forecasting')
    print('  GET  /weather/current  - Current weather data')
    print('  GET  /grid/status      - Grid status and energy mix')
    print('  POST /alerts/check     - Check for energy alerts')
    print('  POST /train            - Retrain models')
    print('  GET  /health           - Health check')
    print('=' * 60 + '\n')
    
    app.run(debug=True, host='0.0.0.0', port=5000)
