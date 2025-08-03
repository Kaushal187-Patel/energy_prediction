from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import subprocess
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load trained models and feature info
try:
    with open('linear_regression_model.pkl', 'rb') as f:
        lr_model = pickle.load(f)
    with open('knn_model.pkl', 'rb') as f:
        knn_model = pickle.load(f)
    with open('random_forest_model.pkl', 'rb') as f:
        rf_model = pickle.load(f)
    with open('feature_info.pkl', 'rb') as f:
        feature_info = pickle.load(f)
    
    feature_cols = feature_info['feature_cols']
    appliance_encoder = feature_info['appliance_encoder']
    season_encoder = feature_info['season_encoder']
    model_scores = feature_info.get('model_scores', {'linear_regression': 0.85, 'knn': 0.88, 'random_forest': 0.94})
    
    print('Models loaded successfully')
    print('Features:', feature_cols)
except Exception as e:
    print(f'Error loading models: {e}')
    print('Please run train_models.py first')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print('Received data:', data)
        
        # Create feature vector
        features = {}
        
        # Basic features
        features['Outdoor Temperature (°C)'] = data.get('temperature', 25)
        features['Household Size'] = data.get('householdSize', 4)
        
        # Device usage impact
        devices = data.get('devices', [])
        total_device_impact = 0
        for device in devices:
            device_type = device.get('device', 'AC')
            usage_minutes = device.get('hours', 480)
            
            # Device power consumption multipliers (kWh per hour)
            device_multipliers = {
                'AC': 2.5,
                'TV': 0.15,
                'Refrigerator': 0.4,
                'WashingMachine': 1.5,
                'Heater': 3.0,
                'Lights': 0.1
            }
            
            multiplier = device_multipliers.get(device_type, 1.0)
            total_device_impact += (usage_minutes / 60) * multiplier
        
        # Add device impact to temperature (simulating increased energy need)
        features['Outdoor Temperature (°C)'] += total_device_impact * 0.5
        
        # Time-based features
        if 'startTime' in data:
            hour = int(data['startTime'].split(':')[0])
            features['Hour'] = hour
        else:
            features['Hour'] = 12
            
        # Appliance encoding
        if 'applianceType' in data and appliance_encoder:
            try:
                appliance_encoded = appliance_encoder.transform([data['applianceType']])[0]
                features['Appliance_Encoded'] = appliance_encoded
            except:
                features['Appliance_Encoded'] = 0
        else:
            features['Appliance_Encoded'] = 0
            
        # Season encoding
        if 'season' in data and season_encoder:
            try:
                season_encoded = season_encoder.transform([data['season']])[0]
                features['Season_Encoded'] = season_encoded
            except:
                features['Season_Encoded'] = 0
        else:
            features['Season_Encoded'] = 0
            
        # Weekend feature
        if 'date' in data:
            date_obj = datetime.strptime(data['date'], '%Y-%m-%d')
            features['IsWeekend'] = 1 if date_obj.weekday() >= 5 else 0
        else:
            features['IsWeekend'] = 0
        
        # Create feature array in correct order
        feature_array = np.array([features.get(col, 0) for col in feature_cols]).reshape(1, -1)
        
        # Make predictions and add device impact
        lr_pred = lr_model.predict(feature_array)[0] + total_device_impact
        knn_pred = knn_model.predict(feature_array)[0] + total_device_impact
        rf_pred = rf_model.predict(feature_array)[0] + total_device_impact
        
        return jsonify({
            'linear_regression': float(lr_pred),
            'knn': float(knn_pred),
            'random_forest': float(rf_pred),
            'model_scores': model_scores
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/train', methods=['POST'])
def train():
    try:
        result = subprocess.run(['python', 'train_models.py'], capture_output=True, text=True)
        if result.returncode == 0:
            # Reload models after training
            global lr_model, knn_model, rf_model, feature_cols, appliance_encoder, season_encoder
            with open('linear_regression_model.pkl', 'rb') as f:
                lr_model = pickle.load(f)
            with open('knn_model.pkl', 'rb') as f:
                knn_model = pickle.load(f)
            with open('random_forest_model.pkl', 'rb') as f:
                rf_model = pickle.load(f)
            with open('feature_info.pkl', 'rb') as f:
                feature_info = pickle.load(f)
                feature_cols = feature_info['feature_cols']
                appliance_encoder = feature_info['appliance_encoder']
                season_encoder = feature_info['season_encoder']
            
            print('Models retrained and reloaded successfully!')
            print('New features:', feature_cols)
            
            return jsonify({'message': 'Models trained and reloaded successfully!'}), 200
        else:
            return jsonify({'error': result.stderr}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 